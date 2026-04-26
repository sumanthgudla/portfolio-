# Agent Knowledge Base — All structured data about Sumanth
# Edit this file to update the agent's knowledge

SYSTEM_PROMPT = """You are Sumanth Gudla's personal AI agent embedded on his portfolio website.

PERSONALITY:
- Speak about Sumanth in third person. Be concise (2-4 sentences default).
- Professional yet approachable. Light emoji usage is fine.
- If you don't know something, say so honestly.

YOU HAVE TOOLS. USE THEM:
- Use get_profile_info to look up specific details (email, phone, etc.)
- Use get_project_details or list_projects for project questions
- Use get_skills for technical skill questions
- Use get_experience for work history questions
- Use navigate_to_section when the user wants to SEE a section
- Use highlight_element to draw attention to a specific card
- Use copy_to_clipboard when asked to copy info

RESPONSE FORMAT:
After using tools, respond in valid JSON:
{
  "message": "Your answer (supports **bold** and [links](url))",
  "action": "navigate|answer|highlight|copy",
  "target": "#section-id or null",
  "highlight": "CSS selector or null",
  "copy": "text to copy or null",
  "thought": "Brief reasoning (optional)"
}

RULES:
- Always call tools to get data rather than making things up
- Combine navigate + answer when relevant (answer the question AND scroll to the section)
- For copy requests, use copy_to_clipboard tool and set action to "copy"
- Keep messages concise. Bullet points for lists.
- Always respond in valid JSON. No code blocks around it.
"""

# === STRUCTURED PROFILE DATA ===

PROFILE = {
    "name": "Sumanth Gudla",
    "role": "Agentic AI Developer (Senior Associate System Engineer)",
    "company": "Pegasystems",
    "tenure": "Jan 2022 – Present (3+ years)",
    "location": "Visakhapatnam, India",
    "email": "SumanthGudla52@gmail.com",
    "phone": "+91 91549 49289",
    "linkedin": "linkedin.com/in/sumanth-gudla-468807160",
    "github": "github.com/sumanthgudla",
    "summary": (
        "Agentic AI Developer at Pegasystems with 3+ years of experience building "
        "production-grade autonomous AI systems, multi-agent orchestration platforms, "
        "MCP servers, RAG pipelines, and LLM-powered applications. "
        "His work powers 300+ enterprise customer deployments worldwide."
    ),
    "education": "B.Tech in Computer Science, GMR Institute of Technology (2018-2022), CGPA: 8.08",
    "certifications": "Microsoft Azure AI-900 (AI Fundamentals), Microsoft Azure AI-102 (AI Engineer Associate)",
    "strengths": (
        "1. End-to-end AI ownership — architecture to testing to deployment. "
        "2. Production-scale — 300+ enterprise customer deployments. "
        "3. AI Safety — 4-layer guardrail system + red team testing. "
        "4. Agentic AI pioneer — MCP servers, multi-agent orchestration. "
        "5. Testing discipline — 28+ automated LLM evaluation tests."
    ),
}


PROJECTS = [
    {
        "name": "CDH Agentic APIs",
        "subtitle": "AI Agent Platform for Marketing Decisioning",
        "description": (
            "Production-grade agentic AI system exposing Pega Customer Decision Hub "
            "to autonomous tools via the Model Context Protocol (MCP). Enables marketing "
            "operations across 5 specialized capabilities with multi-backend architecture "
            "supporting live Pega Infinity, rules ZIP archives, and Parquet snapshots."
        ),
        "tech": ["Kotlin", "Java", "Python", "DuckDB", "PostgreSQL", "Docker", "MCP Protocol", "OpenAI API"],
        "impact": "300+ customer deployments, 5 specialized AI tools with sandbox enforcement",
        "highlights": [
            "300+ customer deployments worldwide",
            "5 specialized AI tools with sandbox enforcement",
            "Red-team tested (OWASP LLM Top 10, MITRE ATLAS)",
        ],
        "keywords": ["cdh", "mcp", "marketing", "decision", "agentic api"],
        "css_selector": ".project-card.featured",
    },
    {
        "name": "Beefree Editor AI",
        "subtitle": "AI-Powered Email Content Generation",
        "description": (
            "Schema-constrained AI workflow for generating structured email templates. "
            "Uses ReAct-style reasoning with tool-calling to dynamically retrieve brand "
            "voice attributes and validate schema compatibility."
        ),
        "tech": ["Python", "OpenAI API", "Azure OpenAI", "REST APIs", "JSON Schema"],
        "impact": "Reduced template creation time by 40-50%",
        "highlights": [
            "Reduced template creation by 40–50%",
            "ReAct-style reasoning with tool-calling",
        ],
        "keywords": ["beefree", "email", "template", "editor"],
        "css_selector": ".project-card:nth-child(2)",
    },
    {
        "name": "AI Function Search",
        "subtitle": "RAG-Powered Semantic Search Pipeline",
        "description": (
            "RAG-based semantic search across 10K+ Pega functions using Pinecone "
            "vector database. Integrated embedding generation and cosine similarity "
            "for high-performance context retrieval."
        ),
        "tech": ["Python", "Pinecone", "FAISS", "Embeddings", "REST APIs"],
        "impact": "10K+ functions indexed, 40% accuracy improvement",
        "highlights": [
            "10K+ functions indexed & searchable",
            "Improved search accuracy by 40%",
        ],
        "keywords": ["rag", "search", "pinecone", "function", "semantic"],
        "css_selector": ".project-card:nth-child(3)",
    },
    {
        "name": "LLM Agent Evaluation Pipeline",
        "subtitle": "Comprehensive Testing with Promptfoo",
        "description": (
            "End-to-end evaluation pipeline for a ReAct agent using Promptfoo. "
            "Validates across 4 dimensions — functional correctness, cost/latency budgets, "
            "multi-turn conversation memory, and adversarial red team attacks. "
            "28+ automated tests with a 4-layer guardrail system."
        ),
        "tech": ["Python 3.13", "Azure OpenAI", "GPT-4o", "Promptfoo", "ReAct Agent", "Red Teaming"],
        "impact": "28+ automated tests, 4-layer guardrail system",
        "highlights": [
            "28+ automated tests across 4 test suites",
            "4-layer guardrail system — regex + LLM defense",
            "Red team tested with auto-generated adversarial attacks",
        ],
        "keywords": ["promptfoo", "test", "evaluation", "red team", "guardrail"],
        "github": "github.com/sumanthgudla/Promptfoo-testing",
        "css_selector": ".project-card:last-child",
    },
]


SKILLS = {
    "Languages": ["Python", "Java", "Kotlin", "JavaScript", "TypeScript", "SQL"],
    "AI & ML": ["LangChain", "OpenAI API", "Azure OpenAI", "RAG", "MCP Protocol", "Prompt Engineering", "Function Calling", "ReAct Agents"],
    "Cloud & DevOps": ["AWS", "Azure", "Docker", "CI/CD", "Kubernetes basics"],
    "Databases": ["PostgreSQL", "DuckDB", "Pinecone", "FAISS", "MongoDB"],
    "Testing": ["Promptfoo", "Red Team Testing", "OWASP LLM Top 10", "MITRE ATLAS"],
    "Web": ["REST APIs", "FastAPI", "Flask", "HTML/CSS/JS"],
}


EXPERIENCE = [
    {
        "name": "Agentic AI Systems",
        "track": "Track 1",
        "period": "Jan 2022 – Present",
        "company": "Pegasystems",
        "details": [
            "Built CDH Agentic APIs — production-grade MCP server for Pega Customer Decision Hub. 300+ customer deployments, 5 specialized AI tools.",
            "Beefree Editor AI Integration — schema-constrained AI email template generation using ReAct-style reasoning. Reduced creation by 40-50%.",
            "Real-time customer data enrichment systems and AI-powered decisioning pipelines.",
        ],
    },
    {
        "name": "Cloud & Data Engineering",
        "track": "Track 2",
        "period": "Jan 2022 – Present",
        "company": "Pegasystems",
        "details": [
            "Data pipeline optimization and cloud migration projects.",
            "Performance engineering and system optimization.",
            "Worked with AWS, Azure, Docker, PostgreSQL, DuckDB.",
        ],
    },
    {
        "name": "Quality & Testing",
        "track": "Track 3",
        "period": "Jan 2022 – Present",
        "company": "Pegasystems",
        "details": [
            "Built LLM Agent Evaluation Pipeline using Promptfoo — 28+ automated tests.",
            "4 test suites: functional, cost/latency, multi-turn, adversarial red team.",
            "Designed 4-layer guardrail system: input guard, system prompt, tool guard, output guard.",
            "Red team tested with auto-generated adversarial attacks (OWASP LLM Top 10, MITRE ATLAS).",
        ],
    },
]
