// ===== TYPEWRITER EFFECT =====
const typewriterEl = document.getElementById('typewriter');
const phrases = [
    'Agentic AI Developer',
    'MCP Protocol Engineer',
    'Multi-Agent Architect',
    'RAG Pipeline Builder',
    'AI Safety Advocate'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 80;

function typeWriter() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40;
    } else {
        typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 400;
    }

    setTimeout(typeWriter, typeSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeWriter, 1000);
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    const scrollY = window.scrollY + 200;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        function updateCounter() {
            current += step;
            if (current >= target) {
                counter.textContent = target;
                return;
            }
            counter.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        }

        updateCounter();
    });
}

// ===== REVEAL ON SCROLL (with stagger) =====
function setupRevealAnimations() {
    const revealSelectors = [
        '.about-grid',
        '.exp-track',
        '.project-card',
        '.skill-category',
        '.credential-card',
        '.contact-card',
        '.section-header',
        '.highlight-item',
        '.glow-line'
    ];

    const revealElements = document.querySelectorAll(revealSelectors.join(', '));
    revealElements.forEach(el => el.classList.add('reveal'));

    // Add stagger index to siblings
    const staggerGroups = ['.skills-grid', '.credentials-grid', '.contact-grid', '.projects-grid', '.about-highlights', '.exp-tracks'];
    staggerGroups.forEach(group => {
        document.querySelectorAll(group).forEach(container => {
            Array.from(container.children).forEach((child, i) => {
                child.style.setProperty('--stagger-index', i);
            });
            container.classList.add('stagger-children');
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

// ===== COUNTER TRIGGER =====
const statsSection = document.querySelector('.hero-stats');
let counterStarted = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !counterStarted) {
            counterStarted = true;
            animateCounters();
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    statsObserver.observe(statsSection);
}

// ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== THEME TOGGLE =====
function setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const icon = document.getElementById('themeIcon');
    if (!toggle || !icon) return;

    // Check saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');

    applyTheme(theme);

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('theme', next);
    });

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'light') {
            icon.className = 'fa-solid fa-moon';
        } else {
            icon.className = 'fa-solid fa-sun';
        }
    }
}

// Run theme setup immediately (before DOMContentLoaded) to prevent flash
setupThemeToggle();

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    setupRevealAnimations();
    setupParticles();
    setupMouseGlow();
    setupCardTilt();
    setupMagneticButtons();
});

// ===== PARTICLE SYSTEM =====
function setupParticles() {
    const canvas = document.getElementById('heroParticles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let mouse = { x: null, y: null };

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    canvas.parentElement.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.parentElement.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse repulsion
            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const force = (120 - dist) / 120;
                    this.x += (dx / dist) * force * 2;
                    this.y += (dy / dist) * force * 2;
                }
            }

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            const cs = getComputedStyle(document.documentElement);
            const pc = cs.getPropertyValue('--particle-color').trim() || '108, 99, 255';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${pc}, ${this.opacity})`;
            ctx.fill();
        }
    }

    const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.15;
                    const cs = getComputedStyle(document.documentElement);
                    const pc = cs.getPropertyValue('--particle-color').trim() || '108, 99, 255';
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${pc}, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        animationId = requestAnimationFrame(animate);
    }

    // Only animate when hero is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate();
            } else {
                cancelAnimationFrame(animationId);
            }
        });
    }, { threshold: 0 });
    heroObserver.observe(canvas.parentElement);
}

// ===== MOUSE GLOW TRACKER =====
function setupMouseGlow() {
    const glow = document.getElementById('mouseGlow');
    if (!glow) return;

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(updateGlow);
    }
    updateGlow();
}

// ===== CARD TILT EFFECT =====
function setupCardTilt() {
    const cards = document.querySelectorAll('.project-card, .skill-category');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;

            // Move card glow
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.left = x + 'px';
                glow.style.top = y + 'px';
                glow.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.opacity = '0';
            }
        });
    });
}

// ===== MAGNETIC BUTTONS =====
function setupMagneticButtons() {
    const buttons = document.querySelectorAll('.btn, .hero-social a');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

// ===== PARALLAX ON SCROLL =====
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const orbs = document.querySelectorAll('.orb');
            orbs.forEach((orb, i) => {
                const speed = (i + 1) * 0.03;
                orb.style.transform = `translateY(${scrollY * speed}px)`;
            });
            ticking = false;
        });
        ticking = true;
    }
});

// ===== AI NAVIGATOR =====
(function() {
    // Agent backend URL — set after deploying
    // Local dev: http://localhost:8000/chat
    // Production: https://your-deployed-url/chat
    const AGENT_URL = 'http://localhost:8000/chat';

    const trigger = document.getElementById('aiTrigger');
    const overlay = document.getElementById('aiOverlay');
    const commandBar = document.getElementById('aiCommandBar');
    const input = document.getElementById('aiInput');
    const response = document.getElementById('aiResponse');
    const thinking = document.getElementById('aiThinking');

    if (!trigger || !commandBar) return;



    let isOpen = false;

    function openBar() {
        isOpen = true;
        overlay.classList.add('active');
        commandBar.classList.add('active');
        trigger.style.display = 'none';
        input.value = '';
        input.focus();
        resetWelcome();
    }

    function closeBar() {
        isOpen = false;
        overlay.classList.remove('active');
        commandBar.classList.remove('active');
        trigger.style.display = 'flex';
    }

    function resetWelcome() {
        response.innerHTML = `
            <div class="ai-welcome">
                <p class="ai-welcome-text"><i class="fa-solid fa-sparkles"></i> I'm Sumanth's AI navigator. Ask me anything about his work.</p>
                <div class="ai-suggestions">
                    <button class="ai-suggestion" data-query="show me your projects">show me your projects</button>
                    <button class="ai-suggestion" data-query="what are your skills?">what are your skills?</button>
                    <button class="ai-suggestion" data-query="tell me about your experience">tell me about your experience</button>
                    <button class="ai-suggestion" data-query="how can I contact you?">how can I contact you?</button>
                    <button class="ai-suggestion" data-query="who are you?">who are you?</button>
                </div>
            </div>`;
        bindSuggestions();
    }

    function bindSuggestions() {
        document.querySelectorAll('.ai-suggestion').forEach(btn => {
            btn.addEventListener('click', () => {
                input.value = btn.dataset.query;
                handleQuery(btn.dataset.query);
            });
        });
    }

    // Open/close handlers
    trigger.addEventListener('click', openBar);
    overlay.addEventListener('click', closeBar);

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            isOpen ? closeBar() : openBar();
        }
        if (e.key === 'Escape' && isOpen) closeBar();
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value.trim()) {
            handleQuery(input.value.trim());
        }
    });

    // Main query handler
    async function handleQuery(query) {
        thinking.style.display = 'flex';
        response.innerHTML = '';

        try {
            const result = await callAgent(query);
            thinking.style.display = 'none';
            executeAction(result);
        } catch (err) {
            thinking.style.display = 'none';
            // Fallback to local matching if API fails
            const fallback = localFallback(query);
            executeAction(fallback);
        }
    }

    // Call Python Agent backend
    async function callAgent(query) {
        if (!AGENT_URL || AGENT_URL.includes('YOUR_')) {
            return localFallback(query);
        }

        const res = await fetch(AGENT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: query })
        });

        if (!res.ok) throw new Error('Agent unavailable');

        const result = await res.json();
        if (result.detail) throw new Error(result.detail);
        return result;
    }

    // Smart local fallback (works without API key)
    function localFallback(query) {
        const q = query.toLowerCase();

        // Patterns: conversational answers first, then navigation
        const patterns = [
            // === CONVERSATIONAL / SUMMARY QUERIES ===
            { match: /summar|overview|tell me about (him|sumanth|this|everything)|brief|quick intro|who is (he|sumanth)|describe/i, target: null, message: '🧠 **Sumanth Gudla** is an Agentic AI Developer at Pegasystems with 3+ years of experience building production-grade AI systems.\n\n**What he does:**\n• Builds multi-agent orchestration platforms (MCP servers, ReAct agents)\n• Designs RAG pipelines and LLM-powered applications\n• Ships enterprise AI — 300+ customer deployments\n\n**Key projects:** CDH Agentic APIs, Beefree Editor AI, AI Function Search, LLM Evaluation Pipeline\n\n**Stack:** Python, Kotlin, Java, LangChain, OpenAI, Azure, Docker\n\n**Certifications:** Azure AI-900, AI-102' },
            { match: /strength|good at|best at|speciali|expertise|what makes|unique|stand.?out|why.*hire/i, target: null, message: '💪 **Core Strengths:**\n\n• **Agentic AI Architecture** — Designed MCP servers handling 300+ enterprise deployments\n• **Full-Stack AI** — From RAG pipelines to production APIs to red-team testing\n• **Testing & Safety** — Built a 28+ test evaluation pipeline with 4-layer guardrails\n• **Multi-Agent Systems** — ReAct agents, tool orchestration, autonomous workflows\n• **Cloud + Data** — Azure certified, experience with Docker, PostgreSQL, DuckDB\n\nHe doesn\'t just build AI — he tests it, secures it, and ships it to production.' },
            { match: /what (does|did) (he|sumanth) (do|build|work)|what.*work.*on|day.?to.?day|responsib/i, target: '#experience', message: '🔧 **What Sumanth works on at Pegasystems:**\n\n**Track 1 — Agentic AI Systems**\n• Building CDH Agentic APIs with MCP Protocol\n• AI-powered email generation (Beefree integration)\n• Real-time customer data enrichment\n\n**Track 2 — Cloud & Data Engineering**\n• Data pipeline optimization & cloud migration\n• Performance engineering\n\n**Track 3 — Quality & Testing**\n• LLM evaluation with Promptfoo (28+ automated tests)\n• Red team testing & guardrail validation' },
            { match: /how many (year|exp)|experience.*year|year.*experience|how long/i, target: null, message: '📅 **3+ years** of professional experience at Pegasystems (Jan 2022 – Present), working across Agentic AI, Cloud Engineering, and Testing.' },
            { match: /ai|artificial intelligence|machine learning|ml|llm|agent/i, target: null, message: '🤖 **Sumanth\'s AI expertise:**\n\n• **Agentic AI** — Multi-agent orchestration, MCP servers, ReAct pattern\n• **LLMs** — GPT-4o, Azure OpenAI, prompt engineering, function calling\n• **RAG** — Pinecone, FAISS, embedding pipelines, semantic search\n• **AI Safety** — Red team testing, 4-layer guardrails, Promptfoo evaluation\n• **Tools** — LangChain, OpenAI API, Azure AI services\n\nHe builds AI that reasons, acts, and is rigorously tested.' },
            { match: /interest|passion|hobby|outside work|fun fact/i, target: null, message: '🎯 Sumanth is passionate about **agentic AI systems** — building autonomous agents that can reason, plan, and act. He\'s particularly interested in AI safety, red-team testing, and making AI systems reliable enough for enterprise production.' },
            { match: /location|where.*live|where.*from|based|city/i, target: null, message: '📍 Based in **Visakhapatnam, India**.' },
            { match: /github|repo|code|open.?source/i, target: null, message: '💻 GitHub: [github.com/sumanthgudla](https://github.com/sumanthgudla)\n\nNotable repo: [Promptfoo-testing](https://github.com/sumanthgudla/Promptfoo-testing) — LLM agent evaluation pipeline with 28+ tests.' },

            // === NAVIGATION QUERIES ===
            { match: /show.*project|go.*project|navigate.*project|see.*project|project/i, target: '#projects', message: '📦 **Deployed Agents** — 4 projects including CDH Agentic APIs (300+ deployments) and the Promptfoo evaluation pipeline.' },
            { match: /show.*skill|go.*skill|navigate.*skill|see.*skill|skill|tech|stack|toolkit|language/i, target: '#skills', message: '⚡ Here\'s the full toolkit — 6 categories spanning AI/ML, languages, cloud, databases, and more.' },
            { match: /show.*experience|go.*experience|navigate.*experience|see.*experience|experience|work|job|pega|career|mission/i, target: '#experience', message: '📋 **Mission Logs** — 3+ years at Pegasystems across Agentic AI Systems, Cloud Engineering, and Quality Testing.' },
            { match: /show.*contact|go.*contact|navigate.*contact|see.*contact|contact|reach|connect|handshake/i, target: '#contact', message: '🤝 **Initiate Handshake** — reach out via email, LinkedIn, or phone.' },
            { match: /about|who are you|bio|intro/i, target: '#about', message: '👋 **Sumanth Gudla** — Agentic AI Developer at Pegasystems building autonomous AI systems, multi-agent platforms, and MCP servers.' },
            { match: /education|degree|college|university|cert|train/i, target: '#credentials', message: '🎓 **Training Data** — B.Tech in Computer Science (8.08 CGPA), Azure AI-900 & AI-102 certified.' },
            { match: /top|home|hero|start|beginning/i, target: '#hero', message: '🚀 Back to the top!' },

            // === ACTION QUERIES ===
            { match: /copy.*email|email.*copy/i, target: '#contact', copy: 'SumanthGudla52@gmail.com', message: '📋 Copied **SumanthGudla52@gmail.com** to clipboard!' },
            { match: /copy.*phone|phone.*copy/i, target: '#contact', copy: '+919154949289', message: '📋 Copied **+91 91549 49289** to clipboard!' },
            { match: /email/i, target: null, message: '📧 **SumanthGudla52@gmail.com** — or say "copy email" and I\'ll copy it to your clipboard.' },
            { match: /phone|number|call/i, target: null, message: '📞 **+91 91549 49289** — or say "copy phone" to copy it.' },
            { match: /linkedin/i, target: null, message: '🔗 [linkedin.com/in/sumanth-gudla-468807160](https://www.linkedin.com/in/sumanth-gudla-468807160)' },

            // === SPECIFIC PROJECT QUERIES ===
            { match: /promptfoo|test|evaluat|red.?team|guardrail/i, target: '#projects', highlight: '.project-card:last-child', message: '🛡️ **LLM Agent Evaluation Pipeline** — 28+ automated tests across 4 suites: functional, cost/latency, multi-turn, and red team. Built with Python, Promptfoo, and Azure OpenAI GPT-4o. Features a 4-layer guardrail system.\n\n[View repo →](https://github.com/sumanthgudla/Promptfoo-testing)' },
            { match: /cdh|mcp|marketing|decision/i, target: '#projects', highlight: '.project-card.featured', message: '🤖 **CDH Agentic APIs** — Production-grade MCP server for Pega Customer Decision Hub. 300+ customer deployments, 5 specialized AI tools with sandbox enforcement. Built with Kotlin, Java, Python, DuckDB.' },
            { match: /beefree|email.*template|editor/i, target: '#projects', highlight: '.project-card:nth-child(2)', message: '✉️ **Beefree Editor AI** — Schema-constrained AI workflow for email templates using ReAct-style reasoning. Reduced template creation by 40-50%.' },
            { match: /rag|search|pinecone|function.*search/i, target: '#projects', highlight: '.project-card:nth-child(3)', message: '🔍 **AI Function Search** — RAG pipeline with Pinecone across 10K+ Pega functions. Improved search accuracy by 40%.' },

            // === META QUERIES ===
            { match: /resume|cv|download/i, target: null, message: '📄 Resume available on request — reach out via email or LinkedIn!' },
            { match: /hire|available|open to|opportunit/i, target: '#contact', message: '✅ Yes! Open to new opportunities in Agentic AI, LLM systems, and full-stack AI development. Best way to connect: **SumanthGudla52@gmail.com** or LinkedIn.' },
            { match: /help|what can you|command|how.*work/i, target: null, message: '🤖 I\'m Sumanth\'s AI navigator! Here\'s what I can do:\n\n• **Ask anything** — "give me a summary", "what are his strengths?"\n• **Navigate** — "show projects", "go to skills", "take me to contact"\n• **Get details** — "tell me about CDH", "what\'s Promptfoo?"\n• **Copy info** — "copy email", "copy phone"\n• **Explore** — "what AI tech does he use?", "why should I hire him?"' },
            { match: /hello|hi|hey|greet|sup|yo/i, target: null, message: '👋 Hey! I\'m Sumanth\'s AI navigator. Ask me anything — like "give me a summary" or "show me his projects"!' },
            { match: /thank|thanks|awesome|cool|nice|great/i, target: null, message: '🙌 Glad I could help! Feel free to ask more or explore the site.' },
        ];

        for (const p of patterns) {
            if (p.match.test(q)) {
                return {
                    thought: 'Matched local pattern',
                    action: p.copy ? 'copy' : (p.highlight ? 'highlight' : 'navigate'),
                    target: p.target,
                    highlight: p.highlight || null,
                    copy: p.copy || null,
                    message: p.message
                };
            }
        }

        // Default
        return {
            thought: 'No pattern matched',
            action: 'answer',
            target: null,
            highlight: null,
            copy: null,
            message: '🤔 I can help you navigate this site! Try asking about **projects**, **skills**, **experience**, **contact info**, or any specific project like **CDH Agentic APIs** or **Promptfoo testing**.'
        };
    }

    // Execute the AI's action on the page
    function executeAction(result) {
        // Show response
        const msgHtml = formatMessage(result.message);
        let html = `<div class="ai-response-content">`;

        if (result.thought && result.thought !== 'Matched local pattern') {
            html += `<div class="ai-action-label"><i class="fa-solid fa-brain"></i> ${escapeHtml(result.thought)}</div>`;
        }

        // Show tools used (agentic thinking)
        if (result.tools_used && result.tools_used.length > 0) {
            html += `<div class="ai-action-label"><i class="fa-solid fa-wrench"></i> Tools: ${result.tools_used.join(' → ')}</div>`;
        }

        html += `<div class="ai-answer">${msgHtml}</div>`;

        if (result.target) {
            const sectionName = result.target.replace('#', '');
            html += `<div class="ai-nav-indicator"><i class="fa-solid fa-arrow-down"></i> Navigated to <strong>${sectionName}</strong></div>`;
        }

        if (result.copy) {
            html += `<div class="ai-nav-indicator"><i class="fa-solid fa-copy"></i> Copied to clipboard</div>`;
        }

        html += `</div>`;
        response.innerHTML = html;

        // Auto-close and navigate
        if (result.target) {
            // Brief delay to show the response, then close and scroll
            setTimeout(() => {
                closeBar();
                setTimeout(() => {
                    const section = document.querySelector(result.target);
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        section.classList.add('ai-highlight');
                        setTimeout(() => section.classList.remove('ai-highlight'), 2500);
                    }
                }, 300);
            }, 1200);
        }

        // Highlight specific card (after navigation closes)
        if (result.highlight) {
            const delay = result.target ? 2000 : 800;
            setTimeout(() => {
                const el = document.querySelector(result.highlight);
                if (el) {
                    el.classList.add('ai-highlight-card');
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => el.classList.remove('ai-highlight-card'), 3000);
                }
            }, delay);
        }

        // Copy to clipboard
        if (result.copy) {
            navigator.clipboard.writeText(result.copy).catch(() => {});
        }
    }

    // Simple markdown-light formatting
    function formatMessage(msg) {
        if (!msg) return '';
        return msg
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
            .replace(/\n/g, '<br>');
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Initial bind
    bindSuggestions();
})();
