# Agent Tools — Extensible tool system for the AI agent
# Add new tools here and they'll be automatically available to the agent

from agent.knowledge import PROFILE, PROJECTS, SKILLS, EXPERIENCE


# ===== TOOL IMPLEMENTATIONS =====

def get_profile_info(field: str) -> dict:
    """Get specific profile information about Sumanth."""
    field = field.lower()
    if field in PROFILE:
        return {"field": field, "value": PROFILE[field]}

    # Fuzzy match
    for key, value in PROFILE.items():
        if field in key or key in field:
            return {"field": key, "value": value}

    return {"field": field, "value": None, "available_fields": list(PROFILE.keys())}


def get_project_details(project_name: str) -> dict:
    """Get detailed info about a specific project."""
    name_lower = project_name.lower()
    for project in PROJECTS:
        if name_lower in project["name"].lower() or any(name_lower in kw for kw in project.get("keywords", [])):
            return project

    return {
        "error": f"Project '{project_name}' not found",
        "available_projects": [p["name"] for p in PROJECTS],
    }


def list_projects() -> dict:
    """List all projects with brief descriptions."""
    return {
        "projects": [
            {"name": p["name"], "subtitle": p["subtitle"], "impact": p.get("impact", "")}
            for p in PROJECTS
        ]
    }


def get_skills(category: str = "all") -> dict:
    """Get skills by category or all skills."""
    if category.lower() == "all":
        return {"skills": SKILLS}
    
    cat_lower = category.lower()
    for cat_name, skills in SKILLS.items():
        if cat_lower in cat_name.lower():
            return {"category": cat_name, "skills": skills}

    return {"error": f"Category '{category}' not found", "available_categories": list(SKILLS.keys())}


def get_experience(track: str = "all") -> dict:
    """Get work experience details, optionally filtered by track."""
    if track.lower() == "all":
        return {"experience": EXPERIENCE}

    track_lower = track.lower()
    for t in EXPERIENCE:
        if track_lower in t["track"].lower() or track_lower in t["name"].lower():
            return t

    return {"error": f"Track '{track}' not found", "available_tracks": [t["name"] for t in EXPERIENCE]}


def navigate_to_section(section: str) -> dict:
    """Navigate the website to a specific section."""
    section_map = {
        "home": "#hero", "top": "#hero", "hero": "#hero",
        "about": "#about", "bio": "#about",
        "experience": "#experience", "work": "#experience", "career": "#experience",
        "projects": "#projects", "portfolio": "#projects",
        "skills": "#skills", "toolkit": "#skills", "tech": "#skills",
        "education": "#credentials", "certifications": "#credentials", "credentials": "#credentials",
        "contact": "#contact", "email": "#contact", "connect": "#contact",
    }

    target = section_map.get(section.lower().strip("#"), section if section.startswith("#") else f"#{section}")
    return {"action": "navigate", "target": target}


def highlight_element(selector: str) -> dict:
    """Highlight a specific element on the page."""
    return {"action": "highlight", "highlight": selector}


def copy_to_clipboard(text: str) -> dict:
    """Copy text to the visitor's clipboard."""
    return {"action": "copy", "copy": text}


# ===== TOOL REGISTRY =====
# Maps tool names to their implementation functions

TOOLS = {
    "get_profile_info": get_profile_info,
    "get_project_details": get_project_details,
    "list_projects": list_projects,
    "get_skills": get_skills,
    "get_experience": get_experience,
    "navigate_to_section": navigate_to_section,
    "highlight_element": highlight_element,
    "copy_to_clipboard": copy_to_clipboard,
}


def execute_tool(name: str, args: dict) -> dict:
    """Execute a tool by name with given arguments."""
    if name not in TOOLS:
        return {"error": f"Unknown tool: {name}"}
    try:
        return TOOLS[name](**args)
    except Exception as e:
        return {"error": f"Tool '{name}' failed: {str(e)}"}


# ===== OPENAI FUNCTION DEFINITIONS =====
# These are sent to the LLM so it knows what tools are available

TOOL_DEFINITIONS = [
    {
        "type": "function",
        "function": {
            "name": "get_profile_info",
            "description": "Get specific profile information about Sumanth Gudla — name, role, email, phone, linkedin, github, location, education, certifications, summary.",
            "parameters": {
                "type": "object",
                "properties": {
                    "field": {
                        "type": "string",
                        "description": "The field to look up: name, role, email, phone, linkedin, github, location, education, certifications, summary"
                    }
                },
                "required": ["field"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_project_details",
            "description": "Get detailed information about one of Sumanth's projects — CDH Agentic APIs, Beefree Editor AI, AI Function Search, or LLM Agent Evaluation Pipeline.",
            "parameters": {
                "type": "object",
                "properties": {
                    "project_name": {
                        "type": "string",
                        "description": "Name or keyword of the project to look up"
                    }
                },
                "required": ["project_name"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "list_projects",
            "description": "List all of Sumanth's projects with brief descriptions.",
            "parameters": {"type": "object", "properties": {}}
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_skills",
            "description": "Get Sumanth's technical skills, optionally filtered by category (languages, ai_ml, cloud, databases, testing, web).",
            "parameters": {
                "type": "object",
                "properties": {
                    "category": {
                        "type": "string",
                        "description": "Skill category to filter by, or 'all' for everything",
                        "default": "all"
                    }
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_experience",
            "description": "Get Sumanth's work experience at Pegasystems. Can filter by track: 'agentic_ai', 'cloud_data', or 'quality_testing'.",
            "parameters": {
                "type": "object",
                "properties": {
                    "track": {
                        "type": "string",
                        "description": "Experience track to filter by, or 'all'",
                        "default": "all"
                    }
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "navigate_to_section",
            "description": "Navigate the portfolio website to a specific section. Use when the user wants to see a section.",
            "parameters": {
                "type": "object",
                "properties": {
                    "section": {
                        "type": "string",
                        "description": "Section to navigate to: home, about, experience, projects, skills, credentials, contact"
                    }
                },
                "required": ["section"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "highlight_element",
            "description": "Highlight a specific element on the page using a CSS selector. Useful for drawing attention to a specific project card or section.",
            "parameters": {
                "type": "object",
                "properties": {
                    "selector": {
                        "type": "string",
                        "description": "CSS selector of the element to highlight, e.g. '.project-card.featured' or '.project-card:nth-child(2)'"
                    }
                },
                "required": ["selector"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "copy_to_clipboard",
            "description": "Copy text to the visitor's clipboard. Use for email, phone, or other contact info when asked.",
            "parameters": {
                "type": "object",
                "properties": {
                    "text": {
                        "type": "string",
                        "description": "The text to copy to clipboard"
                    }
                },
                "required": ["text"]
            }
        }
    },
]
