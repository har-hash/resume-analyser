"""
Real Resume Analysis Engine
Extracts text from PDF/DOCX, performs keyword matching,
skill gap analysis, action verb checking, ATS scoring, and formatting feedback.
"""

import re
import json
from collections import Counter

# ──────────────────────────────────────────────
# KEYWORD & SKILL DATABASES
# ──────────────────────────────────────────────

TECH_SKILLS = {
    "languages": ["python", "java", "javascript", "typescript", "c++", "c#", "go", "rust", "ruby", "php", "swift", "kotlin", "scala", "r", "matlab", "sql", "html", "css"],
    "frameworks": ["react", "angular", "vue", "next.js", "nextjs", "express", "django", "flask", "fastapi", "spring", "spring boot", "laravel", ".net", "rails", "svelte", "nuxt"],
    "databases": ["mysql", "postgresql", "postgres", "mongodb", "redis", "elasticsearch", "dynamodb", "firebase", "sqlite", "oracle", "cassandra", "neo4j"],
    "cloud": ["aws", "azure", "gcp", "google cloud", "heroku", "vercel", "netlify", "digitalocean", "lambda", "ec2", "s3", "cloudfront"],
    "devops": ["docker", "kubernetes", "k8s", "jenkins", "ci/cd", "github actions", "gitlab ci", "terraform", "ansible", "nginx", "linux", "bash"],
    "data_science": ["machine learning", "deep learning", "tensorflow", "pytorch", "pandas", "numpy", "scikit-learn", "nlp", "computer vision", "data analysis", "statistics", "tableau", "power bi"],
    "tools": ["git", "github", "jira", "confluence", "figma", "postman", "vscode", "intellij", "slack", "trello", "notion"],
    "concepts": ["rest api", "graphql", "microservices", "agile", "scrum", "tdd", "oop", "design patterns", "system design", "data structures", "algorithms"],
}

STRONG_ACTION_VERBS = [
    "achieved", "architected", "automated", "built", "championed", "consolidated",
    "delivered", "designed", "developed", "drove", "eliminated", "engineered",
    "established", "executed", "expanded", "generated", "implemented", "improved",
    "increased", "initiated", "integrated", "launched", "led", "managed",
    "mentored", "migrated", "modernized", "negotiated", "optimized", "orchestrated",
    "overhauled", "pioneered", "produced", "reduced", "refactored", "resolved",
    "revamped", "scaled", "secured", "simplified", "spearheaded", "streamlined",
    "strengthened", "supervised", "surpassed", "transformed", "tripled", "upgraded",
]

WEAK_PHRASES = [
    "responsible for", "worked on", "helped with", "assisted in",
    "was part of", "involved in", "participated in", "duties included",
    "tasked with", "in charge of",
]

SECTION_KEYWORDS = {
    "contact": ["email", "phone", "linkedin", "github", "portfolio", "address", "website"],
    "education": ["education", "university", "college", "bachelor", "master", "degree", "gpa", "coursework", "b.tech", "b.e", "m.tech", "m.s", "ph.d", "diploma"],
    "experience": ["experience", "work history", "employment", "professional experience", "work experience", "internship"],
    "skills": ["skills", "technical skills", "technologies", "proficiencies", "competencies", "tools"],
    "projects": ["projects", "personal projects", "academic projects", "side projects"],
    "certifications": ["certifications", "certificates", "licensed", "credential"],
    "summary": ["summary", "objective", "profile", "about me", "professional summary"],
}

# ──────────────────────────────────────────────
# TEXT EXTRACTION
# ──────────────────────────────────────────────

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from a PDF file."""
    from PyPDF2 import PdfReader
    import io
    reader = PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text.strip()

def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract text from a DOCX file."""
    from docx import Document
    import io
    doc = Document(io.BytesIO(file_bytes))
    text = "\n".join([para.text for para in doc.paragraphs if para.text.strip()])
    return text.strip()

# ──────────────────────────────────────────────
# ANALYSIS FUNCTIONS
# ──────────────────────────────────────────────

def extract_contact_info(text: str) -> dict:
    """Extract name, email, phone from resume text."""
    info = {}
    # Email
    email_match = re.search(r'[\w.+-]+@[\w-]+\.[\w.]+', text)
    if email_match:
        info["email"] = email_match.group()
    # Phone
    phone_match = re.search(r'[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{7,15}', text)
    if phone_match:
        info["phone"] = phone_match.group().strip()
    # LinkedIn
    linkedin_match = re.search(r'linkedin\.com/in/[\w-]+', text, re.IGNORECASE)
    if linkedin_match:
        info["linkedin"] = linkedin_match.group()
    # GitHub
    github_match = re.search(r'github\.com/[\w-]+', text, re.IGNORECASE)
    if github_match:
        info["github"] = github_match.group()
    # Name (first non-empty line, heuristic)
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    if lines:
        # Assume name is the first line that is NOT an email/url/phone
        for line in lines[:5]:
            if '@' not in line and 'http' not in line and not re.match(r'^[\d\+\(]', line) and len(line) < 60:
                info["name"] = line
                break
    return info

def detect_skills(text: str) -> dict:
    """Detect technical skills found in the resume."""
    text_lower = text.lower()
    found = {}
    for category, skills in TECH_SKILLS.items():
        matched = []
        for skill in skills:
            # Use word boundary matching for short skills
            if len(skill) <= 3:
                pattern = r'\b' + re.escape(skill) + r'\b'
                if re.search(pattern, text_lower):
                    matched.append(skill)
            else:
                if skill in text_lower:
                    matched.append(skill)
        if matched:
            found[category] = matched
    return found

def detect_sections(text: str) -> dict:
    """Detect which resume sections are present."""
    text_lower = text.lower()
    found_sections = {}
    for section, keywords in SECTION_KEYWORDS.items():
        for kw in keywords:
            if kw in text_lower:
                found_sections[section] = True
                break
        if section not in found_sections:
            found_sections[section] = False
    return found_sections

def analyze_action_verbs(text: str) -> dict:
    """Analyze usage of strong vs weak action verbs."""
    text_lower = text.lower()
    strong_found = [v for v in STRONG_ACTION_VERBS if re.search(r'\b' + v + r'\b', text_lower)]
    weak_found = [p for p in WEAK_PHRASES if p in text_lower]
    return {
        "strong_verbs": strong_found,
        "weak_phrases": weak_found,
    }

def analyze_metrics(text: str) -> dict:
    """Detect quantifiable impact metrics."""
    # Look for percentages, dollar amounts, numbers with context
    percentage_matches = re.findall(r'\d+[\.\d]*\s*%', text)
    dollar_matches = re.findall(r'\$[\d,]+[\.\d]*[KMBkmb]?', text)
    number_matches = re.findall(r'\b\d+[xX]\b', text)
    large_numbers = re.findall(r'\b\d{2,}[,\d]*\+?\b', text)
    
    has_metrics = bool(percentage_matches or dollar_matches or number_matches)
    return {
        "has_metrics": has_metrics,
        "percentages": percentage_matches[:10],
        "dollar_amounts": dollar_matches[:10],
        "multipliers": number_matches[:10],
        "count": len(percentage_matches) + len(dollar_matches) + len(number_matches),
    }

def check_formatting(text: str) -> list:
    """Check for common formatting issues."""
    issues = []
    lines = text.split('\n')
    
    # Check length
    word_count = len(text.split())
    if word_count < 150:
        issues.append("Resume appears too short. Aim for at least 300-600 words for a strong resume.")
    elif word_count > 1200:
        issues.append("Resume may be too long. For most roles, keep it to 1-2 pages (400-800 words).")
    
    # Check for email
    if not re.search(r'[\w.+-]+@[\w-]+\.[\w.]+', text):
        issues.append("No email address detected. Ensure your contact info is clearly visible.")
    
    # Check for phone
    if not re.search(r'[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{7,15}', text):
        issues.append("No phone number detected. Include a phone number for recruiters to reach you.")
    
    # Check for all caps (ATS issue)
    all_caps_lines = [l for l in lines if l.strip() and l == l.upper() and len(l.strip()) > 20]
    if len(all_caps_lines) > 3:
        issues.append("Excessive use of ALL CAPS detected. Use standard casing for better ATS readability.")
    
    # Check for bullet points or structured content
    bullet_chars = sum(1 for l in lines if l.strip().startswith(('•', '-', '●', '◦', '▪', '*')))
    if bullet_chars < 3 and word_count > 200:
        issues.append("Few bullet points detected. Use bullet points to structure your experience for ATS scanners.")
    
    # Check for dates
    date_patterns = re.findall(r'(20\d{2}|19\d{2})', text)
    if len(date_patterns) < 2 and word_count > 200:
        issues.append("Few dates found. Include clear date ranges for your experience and education.")
    
    return issues

def match_job_description(resume_text: str, job_description: str) -> dict:
    """Match resume against a job description."""
    if not job_description or not job_description.strip():
        return {"matched": [], "missing": [], "match_percentage": 0}
    
    # Extract important words from job description (2+ chars, not common words)
    stop_words = {"the", "and", "for", "are", "with", "you", "our", "will", "your", "have", "this", "that", "from", "they", "been", "has", "was", "were", "can", "may", "would", "should", "could", "about", "into", "more", "other", "than", "then", "when", "what", "who", "how", "all", "each", "every", "both", "few", "some", "such", "only", "own", "same", "also", "but", "not", "just", "work", "team", "role", "ability", "experience", "years", "strong", "looking", "join", "company", "etc", "including", "using", "must", "well", "new", "one", "two", "per"}
    
    jd_words = set()
    for word in re.findall(r'\b[a-zA-Z+#.]{3,}\b', job_description.lower()):
        if word not in stop_words:
            jd_words.add(word)
    
    resume_lower = resume_text.lower()
    matched = [w for w in jd_words if w in resume_lower]
    missing = [w for w in jd_words if w not in resume_lower]
    
    match_pct = round(len(matched) / max(len(jd_words), 1) * 100)
    
    return {
        "matched": sorted(matched)[:30],
        "missing": sorted(missing)[:20],
        "match_percentage": min(match_pct, 100),
    }

# ──────────────────────────────────────────────
# ATS SCORE CALCULATION
# ──────────────────────────────────────────────

def calculate_ats_score(
    skills: dict,
    sections: dict,
    verbs: dict,
    metrics: dict,
    formatting_issues: list,
    job_match: dict,
    text: str,
) -> dict:
    """Calculate a comprehensive ATS compatibility score (0-100)."""
    score = 0
    breakdown = {}
    
    # 1. Skills presence (max 25 pts)
    total_skills = sum(len(v) for v in skills.values())
    skill_score = min(total_skills * 2, 25)
    breakdown["skills"] = {"score": skill_score, "max": 25, "label": "Technical Skills"}
    score += skill_score
    
    # 2. Section completeness (max 20 pts)
    important_sections = ["contact", "education", "experience", "skills"]
    bonus_sections = ["projects", "certifications", "summary"]
    section_score = 0
    for s in important_sections:
        if sections.get(s):
            section_score += 4
    for s in bonus_sections:
        if sections.get(s):
            section_score += 1
    section_score = min(section_score, 20)
    breakdown["sections"] = {"score": section_score, "max": 20, "label": "Section Structure"}
    score += section_score
    
    # 3. Action verbs (max 15 pts)
    verb_score = min(len(verbs.get("strong_verbs", [])) * 2, 12)
    weak_penalty = min(len(verbs.get("weak_phrases", [])) * 2, 6)
    verb_score = max(verb_score - weak_penalty, 0)
    verb_score = min(verb_score, 15)
    breakdown["action_verbs"] = {"score": verb_score, "max": 15, "label": "Action Verbs"}
    score += verb_score
    
    # 4. Quantifiable metrics (max 15 pts)
    metric_score = min(metrics.get("count", 0) * 3, 15)
    breakdown["metrics"] = {"score": metric_score, "max": 15, "label": "Impact Metrics"}
    score += metric_score
    
    # 5. Formatting (max 10 pts)
    format_score = max(10 - len(formatting_issues) * 2, 0)
    breakdown["formatting"] = {"score": format_score, "max": 10, "label": "Formatting"}
    score += format_score
    
    # 6. Length & depth (max 15 pts)
    word_count = len(text.split())
    if 300 <= word_count <= 900:
        length_score = 15
    elif 200 <= word_count < 300 or 900 < word_count <= 1200:
        length_score = 10
    elif 100 <= word_count < 200:
        length_score = 5
    else:
        length_score = 2
    breakdown["length"] = {"score": length_score, "max": 15, "label": "Content Depth"}
    score += length_score
    
    # If job description was provided, blend in match score
    if job_match.get("match_percentage", 0) > 0:
        jd_bonus = round(job_match["match_percentage"] * 0.15)
        score = round(score * 0.7 + job_match["match_percentage"] * 0.3)
        breakdown["job_match"] = {"score": job_match["match_percentage"], "max": 100, "label": "Job Description Match"}
    
    score = max(min(score, 100), 0)
    
    return {"total": score, "breakdown": breakdown}

# ──────────────────────────────────────────────
# GENERATE IMPROVEMENT SUGGESTIONS
# ──────────────────────────────────────────────

def generate_suggestions(
    skills: dict,
    sections: dict,
    verbs: dict,
    metrics: dict,
    formatting_issues: list,
    text: str,
) -> list:
    """Generate actionable improvement suggestions."""
    suggestions = []
    
    # Missing sections
    if not sections.get("summary"):
        suggestions.append({
            "type": "section",
            "severity": "medium",
            "title": "Add a Professional Summary",
            "detail": "A 2-3 sentence professional summary at the top helps ATS systems and recruiters quickly understand your profile.",
        })
    if not sections.get("skills"):
        suggestions.append({
            "type": "section",
            "severity": "high",
            "title": "Add a Skills Section",
            "detail": "A dedicated Skills section with keywords is critical for ATS matching. List your technical and soft skills clearly.",
        })
    if not sections.get("projects") and not sections.get("certifications"):
        suggestions.append({
            "type": "section",
            "severity": "low",
            "title": "Consider Adding Projects or Certifications",
            "detail": "Projects and certifications showcase hands-on ability and continuous learning, boosting your competitiveness.",
        })
    
    # Weak phrases
    for phrase in verbs.get("weak_phrases", [])[:3]:
        replacement_map = {
            "responsible for": "Led / Managed / Executed",
            "worked on": "Developed / Built / Engineered",
            "helped with": "Contributed to / Supported / Facilitated",
            "assisted in": "Collaborated on / Supported",
            "was part of": "Contributed to / Participated as key member in",
            "involved in": "Engaged in / Drove / Contributed to",
            "participated in": "Contributed to / Co-led",
            "duties included": "Key achievements include",
            "tasked with": "Spearheaded / Owned",
            "in charge of": "Directed / Oversaw / Managed",
        }
        replacement = replacement_map.get(phrase, "a stronger action verb")
        suggestions.append({
            "type": "language",
            "severity": "high",
            "title": f'Replace "{phrase}"',
            "detail": f'The phrase "{phrase}" is passive and weak for ATS. Replace with: {replacement}.',
        })
    
    # Metrics
    if not metrics.get("has_metrics"):
        suggestions.append({
            "type": "impact",
            "severity": "high",
            "title": "Add Quantifiable Impact Metrics",
            "detail": "Resumes with numbers perform 40% better. Add metrics like 'Reduced load time by 35%' or 'Managed team of 8 engineers'.",
        })
    
    # Formatting issues
    for issue in formatting_issues[:3]:
        suggestions.append({
            "type": "formatting",
            "severity": "medium",
            "title": "Formatting Issue",
            "detail": issue,
        })
    
    # Few skills
    total_skills = sum(len(v) for v in skills.values())
    if total_skills < 5:
        suggestions.append({
            "type": "skills",
            "severity": "high",
            "title": "Expand Your Skills List",
            "detail": "Only a few technical skills were detected. Ensure your resume explicitly lists all relevant technologies, frameworks, and tools you know.",
        })
    
    return suggestions

# ──────────────────────────────────────────────
# MAIN ANALYSIS ENTRY POINT
# ──────────────────────────────────────────────

def analyze_resume(file_bytes: bytes, filename: str, job_description: str = "") -> dict:
    """
    Full resume analysis pipeline.
    Returns a comprehensive analysis dict.
    """
    # 1. Extract text
    ext = filename.lower().rsplit('.', 1)[-1] if '.' in filename else ''
    if ext == 'pdf':
        text = extract_text_from_pdf(file_bytes)
    elif ext in ('docx', 'doc'):
        text = extract_text_from_docx(file_bytes)
    else:
        raise ValueError(f"Unsupported file format: {ext}")
    
    if not text or len(text.strip()) < 20:
        raise ValueError("Could not extract meaningful text from the file. The file may be image-based or corrupted.")
    
    # 2. Run all analyses
    contact = extract_contact_info(text)
    skills = detect_skills(text)
    sections = detect_sections(text)
    verbs = analyze_action_verbs(text)
    metrics = analyze_metrics(text)
    formatting_issues = check_formatting(text)
    job_match = match_job_description(text, job_description)
    
    # 3. Calculate score
    score_result = calculate_ats_score(skills, sections, verbs, metrics, formatting_issues, job_match, text)
    
    # 4. Generate suggestions
    suggestions = generate_suggestions(skills, sections, verbs, metrics, formatting_issues, text)
    
    # 5. Build result
    all_skills_flat = []
    for cat_skills in skills.values():
        all_skills_flat.extend(cat_skills)
    
    result = {
        "extracted_text": text[:5000],  # Truncate for storage
        "word_count": len(text.split()),
        "contact_info": contact,
        "skills_found": skills,
        "skills_flat": all_skills_flat,
        "sections_detected": sections,
        "action_verbs": verbs,
        "metrics": metrics,
        "formatting_issues": formatting_issues,
        "job_match": job_match,
        "ats_score": score_result,
        "suggestions": suggestions,
    }
    
    return result
