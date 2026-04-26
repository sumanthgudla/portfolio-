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
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(108, 99, 255, ${this.opacity})`;
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
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(108, 99, 255, ${opacity})`;
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
    // ⚠️ ADD YOUR OPENAI API KEY HERE
    const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY_HERE';

    const trigger = document.getElementById('aiTrigger');
    const overlay = document.getElementById('aiOverlay');
    const commandBar = document.getElementById('aiCommandBar');
    const input = document.getElementById('aiInput');
    const response = document.getElementById('aiResponse');
    const thinking = document.getElementById('aiThinking');

    if (!trigger || !commandBar) return;

    // Site knowledge for the AI system prompt
    const SYSTEM_PROMPT = `You are an AI navigator embedded in Sumanth Gudla's portfolio website. You control the website UI.

ABOUT SUMANTH:
- Agentic AI Developer at Pegasystems (3+ years: Jan 2022 – present)
- Expert in: Multi-agent orchestration, MCP servers, RAG pipelines, LLM-powered applications
- Skills: Python, Java, Kotlin, JavaScript, TypeScript, LangChain, OpenAI, Azure, Docker, PostgreSQL, DuckDB, Pinecone
- Education: B.Tech Computer Science, GMR Institute of Technology (2018-2022, 8.08 CGPA)
- Certifications: Azure AI-900, Azure AI-102
- Email: SumanthGudla52@gmail.com
- LinkedIn: linkedin.com/in/sumanth-gudla-468807160
- GitHub: github.com/sumanthgudla
- Phone: +91 91549 49289
- Location: Visakhapatnam, India

EXPERIENCE AT PEGASYSTEMS:
- Track 1: Agentic AI Systems — Built CDH Agentic APIs (MCP servers for marketing decisioning), Beefree Editor AI integration, real-time customer data enrichment
- Track 2: Cloud & Data Engineering — Data pipeline optimization, cloud migration, performance engineering
- Track 3: Quality & Testing — Led comprehensive testing including Promptfoo LLM evaluation pipeline

PROJECTS:
1. CDH Agentic APIs — Production-grade agentic AI system, 300+ customer deployments, MCP Protocol, 5 specialized AI tools
2. Beefree Editor AI — Schema-constrained AI email templates, reduced template creation by 40-50%
3. AI Function Search — RAG-based semantic search across 10K+ Pega functions, 40% accuracy improvement
4. LLM Agent Evaluation Pipeline — Promptfoo testing, 28+ automated tests, 4-layer guardrail system, red team tested (GitHub: github.com/sumanthgudla/Promptfoo-testing)

WEBSITE SECTIONS (use these IDs for navigation):
- #hero — Top/home with intro
- #about — About section with profile photo and code window
- #experience — Work experience at Pegasystems (3 tracks)
- #projects — Project showcase (4 cards)
- #skills — Skills grid (6 categories)
- #credentials — Education, certifications, achievements
- #contact — Email, LinkedIn, phone, location

RESPONSE FORMAT:
You MUST respond in valid JSON with this exact structure:
{
  "thought": "Brief reasoning about what the user wants (1 sentence)",
  "action": "navigate|answer|highlight|copy",
  "target": "section ID like #projects, or null for answer-only",
  "highlight": "CSS selector to highlight, or null",
  "copy": "text to copy to clipboard, or null",
  "message": "Your natural language response to display (keep concise, use markdown-light formatting)"
}

RULES:
- For navigation questions ("show projects", "go to contact"), use action "navigate" with the target section ID
- For factual questions ("what's his email?", "skills?"), use action "answer" and include the info in message. If there's a relevant section, also navigate there.
- For "copy email" or "copy phone", use action "copy" with the text
- For highlighting specific cards, use action "highlight" with a CSS selector
- Keep messages SHORT and punchy, like an AI agent reporting back
- Be friendly but professional. Use occasional emoji sparingly.
- Always respond in valid JSON. No markdown code blocks around it.`;

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
            const result = await callOpenAI(query);
            thinking.style.display = 'none';
            executeAction(result);
        } catch (err) {
            thinking.style.display = 'none';
            // Fallback to local matching if API fails
            const fallback = localFallback(query);
            executeAction(fallback);
        }
    }

    // OpenAI API call
    async function callOpenAI(query) {
        if (!OPENAI_API_KEY || OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY_HERE') {
            return localFallback(query);
        }

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: query }
                ],
                temperature: 0.3,
                max_tokens: 300
            })
        });

        if (!res.ok) throw new Error('API failed');

        const data = await res.json();
        const content = data.choices[0].message.content.trim();

        try {
            return JSON.parse(content);
        } catch {
            return { thought: '', action: 'answer', target: null, highlight: null, copy: null, message: content };
        }
    }

    // Smart local fallback (works without API key)
    function localFallback(query) {
        const q = query.toLowerCase();

        // Navigation patterns
        const patterns = [
            { match: /project|built|deploy|agent.*built|what.*built/i, target: '#projects', message: '📦 Navigating to **Deployed Agents** — 4 projects including CDH Agentic APIs (300+ deployments) and the Promptfoo evaluation pipeline.' },
            { match: /skill|tech|stack|toolkit|language|python|java/i, target: '#skills', message: '⚡ Here\'s the full toolkit — 6 categories spanning AI/ML, languages, cloud, databases, and more.' },
            { match: /experience|work|job|pega|career|mission/i, target: '#experience', message: '📋 **Mission Logs** — 3+ years at Pegasystems across Agentic AI Systems, Cloud Engineering, and Quality Testing.' },
            { match: /contact|email|mail|reach|connect|linkedin|phone|handshake/i, target: '#contact', message: '🤝 **Initiate Handshake** — reach out via email (SumanthGudla52@gmail.com), LinkedIn, or phone.' },
            { match: /about|who|bio|intro|yourself|sumanth/i, target: '#about', message: '👋 **Sumanth Gudla** — Agentic AI Developer at Pegasystems building autonomous AI systems, multi-agent platforms, and MCP servers.' },
            { match: /education|degree|college|university|cert|train/i, target: '#credentials', message: '🎓 **Training Data** — B.Tech in Computer Science (8.08 CGPA), Azure AI-900 & AI-102 certified.' },
            { match: /top|home|hero|start|beginning/i, target: '#hero', message: '🚀 Back to the top!' },
            { match: /copy.*email|email.*copy/i, target: '#contact', copy: 'SumanthGudla52@gmail.com', message: '📋 Copied **SumanthGudla52@gmail.com** to clipboard!' },
            { match: /copy.*phone|phone.*copy/i, target: '#contact', copy: '+919154949289', message: '📋 Copied **+91 91549 49289** to clipboard!' },
            { match: /promptfoo|test|evaluat|red.?team|guardrail/i, target: '#projects', highlight: '.project-card:last-child', message: '🛡️ **LLM Agent Evaluation Pipeline** — 28+ automated tests across 4 suites: functional, cost/latency, multi-turn, and red team. [View repo →](https://github.com/sumanthgudla/Promptfoo-testing)' },
            { match: /cdh|mcp|marketing|decision/i, target: '#projects', highlight: '.project-card.featured', message: '🤖 **CDH Agentic APIs** — Production-grade MCP server for marketing decisioning. 300+ customer deployments, 5 specialized AI tools.' },
            { match: /beefree|email.*template|editor/i, target: '#projects', highlight: '.project-card:nth-child(2)', message: '✉️ **Beefree Editor AI** — Schema-constrained AI workflow for email templates. Reduced creation time by 40-50%.' },
            { match: /rag|search|pinecone|function.*search/i, target: '#projects', highlight: '.project-card:nth-child(3)', message: '🔍 **AI Function Search** — RAG pipeline with Pinecone across 10K+ functions. 40% accuracy improvement.' },
            { match: /resume|cv|download/i, target: null, message: '📄 Resume available on request — reach out via email or LinkedIn!' },
            { match: /hire|available|open to/i, target: '#contact', message: '✅ Yes! Open to new opportunities. Best way to connect: **SumanthGudla52@gmail.com** or LinkedIn.' },
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

        // Navigate
        if (result.target) {
            const section = document.querySelector(result.target);
            if (section) {
                setTimeout(() => {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    section.classList.add('ai-highlight');
                    setTimeout(() => section.classList.remove('ai-highlight'), 2500);
                }, 400);
            }
        }

        // Highlight specific card
        if (result.highlight) {
            const el = document.querySelector(result.highlight);
            if (el) {
                setTimeout(() => {
                    el.classList.add('ai-highlight-card');
                    setTimeout(() => el.classList.remove('ai-highlight-card'), 3000);
                }, 800);
            }
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
