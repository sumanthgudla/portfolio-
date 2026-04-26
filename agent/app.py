# Sumanth's AI Agent — FastAPI Backend
# Agentic architecture with tool-calling, easily extensible

import os
import json
import time
from typing import Optional
from collections import defaultdict
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from openai import AzureOpenAI

from agent.tools import TOOLS, TOOL_DEFINITIONS, execute_tool
from agent.knowledge import SYSTEM_PROMPT

# Load .env from agent directory
load_dotenv(Path(__file__).parent / ".env")

app = FastAPI(title="Sumanth AI Agent", version="1.0.0")

# CORS — allow your GitHub Pages site
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "https://sumanthgudla.github.io,http://localhost:5500,http://127.0.0.1:5500").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

# Azure OpenAI client
client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT", ""),
    api_key=os.getenv("AZURE_OPENAI_API_KEY", ""),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION", "2024-06-01"),
)
DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4o")

# Rate limiting (in-memory, per IP)
rate_limits: dict[str, list[float]] = defaultdict(list)
RATE_LIMIT = 20  # requests per minute
RATE_WINDOW = 60  # seconds


def check_rate_limit(ip: str) -> bool:
    now = time.time()
    timestamps = rate_limits[ip]
    # Remove old entries
    rate_limits[ip] = [t for t in timestamps if now - t < RATE_WINDOW]
    if len(rate_limits[ip]) >= RATE_LIMIT:
        return False
    rate_limits[ip].append(now)
    return True


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=500)


class AgentResponse(BaseModel):
    message: str
    action: str = "answer"
    target: Optional[str] = None
    highlight: Optional[str] = None
    copy: Optional[str] = None
    thought: Optional[str] = None
    tools_used: list[str] = []


@app.post("/chat", response_model=AgentResponse)
async def chat(req: ChatRequest, request: Request):
    # Rate limit
    ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "unknown")
    if not check_rate_limit(ip):
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Try again in a minute.")

    # Validate Azure config
    if not os.getenv("AZURE_OPENAI_API_KEY"):
        raise HTTPException(status_code=503, detail="AI service not configured")

    try:
        return await run_agent(req.message)
    except Exception as e:
        print(f"Agent error: {e}")
        raise HTTPException(status_code=500, detail="Agent encountered an error")


async def run_agent(user_message: str, max_iterations: int = 5) -> AgentResponse:
    """
    ReAct-style agent loop:
    1. Send user message + tools to LLM
    2. If LLM calls a tool → execute it → feed result back
    3. Repeat until LLM gives a final answer (no more tool calls)
    4. Parse the final response into an AgentResponse
    """
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_message},
    ]
    tools_used = []

    for _ in range(max_iterations):
        response = client.chat.completions.create(
            model=DEPLOYMENT,
            messages=messages,
            tools=TOOL_DEFINITIONS,
            tool_choice="auto",
            temperature=0.4,
            max_tokens=500,
        )

        choice = response.choices[0]

        # If the model wants to call tools
        if choice.finish_reason == "tool_calls" or choice.message.tool_calls:
            # Add assistant message with tool calls
            messages.append(choice.message)

            for tool_call in choice.message.tool_calls:
                fn_name = tool_call.function.name
                fn_args = json.loads(tool_call.function.arguments)
                tools_used.append(fn_name)

                # Execute the tool
                result = execute_tool(fn_name, fn_args)

                # Add tool result to messages
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": json.dumps(result) if isinstance(result, dict) else str(result),
                })

            continue  # Loop back for the model to process tool results

        # Final answer (no more tool calls)
        content = choice.message.content.strip() if choice.message.content else ""

        # Try to parse as JSON
        try:
            data = json.loads(content)
            return AgentResponse(
                message=data.get("message", content),
                action=data.get("action", "answer"),
                target=data.get("target"),
                highlight=data.get("highlight"),
                copy=data.get("copy"),
                thought=data.get("thought"),
                tools_used=tools_used,
            )
        except (json.JSONDecodeError, AttributeError):
            return AgentResponse(
                message=content,
                action="answer",
                tools_used=tools_used,
            )

    # Max iterations reached
    return AgentResponse(
        message="I'm still thinking... Could you rephrase your question?",
        action="answer",
        tools_used=tools_used,
    )


@app.get("/health")
async def health():
    return {"status": "ok", "agent": "sumanth-ai-agent", "version": "1.0.0"}
