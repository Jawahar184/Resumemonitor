import re

# ─── Skills Bank ──────────────────────────────────────────────────────────────

SKILLS_KEYWORDS = [
    "python", "java", "javascript", "typescript", "c++", "c#", "ruby", "php",
    "swift", "kotlin", "go", "rust", "scala", "matlab", "perl",
    "react", "react.js", "reactjs", "angular", "vue", "vue.js", "next.js",
    "nuxt.js", "svelte", "html", "css", "sass", "tailwind", "bootstrap",
    "jquery", "webpack", "vite",
    "fastapi", "django", "flask", "express", "node.js", "nodejs", "spring",
    "laravel", "rails", "asp.net", "graphql", "rest api", "restful",
    "mongodb", "mysql", "postgresql", "sqlite", "redis", "firebase",
    "elasticsearch", "dynamodb", "cassandra", "oracle",
    "aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "jenkins",
    "ci/cd", "terraform", "ansible", "linux", "bash", "git", "github",
    "gitlab", "bitbucket",
    "machine learning", "deep learning", "tensorflow", "pytorch", "keras",
    "scikit-learn", "pandas", "numpy", "data analysis", "nlp",
    "computer vision", "llm", "openai",
    "android", "ios", "react native", "flutter", "xamarin",
    "excel", "power bi", "tableau", "figma", "photoshop", "ui/ux",
    "agile", "scrum", "jira", "selenium", "junit", "pytest",
    "microservices", "blockchain", "sql", "nosql",
]

# ─── Section Header Vocabulary ────────────────────────────────────────────────

# Section headers to SKIP when detecting name
_NAME_SKIP = re.compile(
    r"^(?:career\s+objective|objective|summary|profile|about\s+me|"
    r"personal\s+(?:info|detail|summary)|contact|declaration|"
    r"education|experience|skill|project|achievement|certificate|"
    r"hobby|interest|language|reference|award|training|internship)s?\b",
    re.IGNORECASE,
)

# Patterns that identify section headings (ALL CAPS short line, or known titles)
_SECTION_HEADER = re.compile(
    r"^(?:"
    r"(?:WORK\s+)?EXPERIENCE|INTERNSHIP|EMPLOYMENT|WORK\s+HISTORY|"
    r"EDUCATION|ACADEMIC|QUALIFICATION|"
    r"SKILL|TECHNICAL\s+SKILL|CORE\s+COMPETENC|"
    r"PROJECT|ACHIEVEMENT|CERTIFICATE|AWARD|TRAINING|"
    r"PERSONAL\s+(?:DETAIL|INFO)|CONTACT|DECLARATION|"
    r"OBJECTIVE|SUMMARY|PROFILE|ABOUT|LANGUAGE|REFERENCE|HOBBY|INTEREST"
    r")S?\b",
    re.IGNORECASE,
)

# Experience section starters
_EXP_SECTION = re.compile(
    r"^(?:(?:WORK\s+)?EXPERIENCE|INTERNSHIP(?:S)?|EMPLOYMENT|WORK\s+HISTORY|PROJECTS?)\s*$",
    re.IGNORECASE,
)

# Education section starters
_EDU_SECTION = re.compile(
    r"^(?:EDUCATION(?:AL)?(?:\s+BACKGROUND|\s+QUALIFICATION)?|ACADEMIC(?:\s+BACKGROUND)?|QUALIFICATION)\s*$",
    re.IGNORECASE,
)

# Degree keywords with word boundaries
DEGREE_PATTERNS = [
    r"b\.tech", r"b\.e\.", r"b\.sc", r"b\.com(?!\w)",
    r"\bbca\b", r"\bbba\b",
    r"m\.tech", r"m\.sc", r"\bmca\b", r"\bmba\b", r"m\.e\.",
    r"\bbachelor", r"\bmaster(?!s?\s+of\s+cerem)", r"\bphd\b", r"\bdoctorate\b",
    r"high\s+school", r"\bintermediate\b",
    r"\b10th\b", r"\b12th\b", r"\bssc\b", r"\bhsc\b",
]

_URL_RE = re.compile(
    r"(?:https?://|www\.)|[\w.-]+\.(?:com|org|net|io|in|edu|gov|co)(?:[/\s]|$)",
    re.IGNORECASE,
)

# Date patterns to exclude from phone detection
_DATE_RE = re.compile(
    r"^\+?\d{0,3}[\s.-]?"           # optional country code
    r"\(?\d{2,5}\)?[\s.-]?"         # area code
    r"\d{3,5}[\s.-]?\d{3,5}"        # subscriber number
)
_DOB_RE = re.compile(
    r"^\s*\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\s*$"   # DD-MM-YYYY or D/M/YY
)


# ─── Text Extractors ──────────────────────────────────────────────────────────

def extract_text_from_pdf(file_bytes: bytes) -> str:
    import fitz
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text


def extract_text_from_docx(file_bytes: bytes) -> str:
    import io
    from docx import Document
    doc = Document(io.BytesIO(file_bytes))
    return "\n".join([para.text for para in doc.paragraphs])


# ─── Section Splitter ─────────────────────────────────────────────────────────

def _split_sections(text: str) -> dict:
    """
    Walk the lines and collect content under each detected section header.
    Returns a dict:  {'raw_top': [...lines before first header...],
                      'EXPERIENCE': [...], 'EDUCATION': [...], ...}
    """
    lines = text.splitlines()
    sections = {"_top_": []}
    current = "_top_"

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        # Detect a section heading: very short (≤5 words), matches known headers
        if (
            _SECTION_HEADER.match(stripped)
            and len(stripped.split()) <= 5
        ):
            current = stripped.upper()
            sections.setdefault(current, [])
        else:
            sections.setdefault(current, []).append(stripped)

    return sections


# ─── Field Extractors ─────────────────────────────────────────────────────────

def extract_email(text: str) -> str:
    m = re.search(r"[\w.+\-]+@[\w\-]+\.[a-zA-Z]{2,}", text)
    return m.group(0) if m else ""


def extract_phone(text: str) -> str:
    """
    Extract a real phone number. Rejects:
      - Date-of-birth strings (DD-MM-YYYY)
      - Numbers with fewer than 7 actual digits
      - Numbers that look like years (4-digit only)
    """
    candidates = re.finditer(r"(\+?[\d][\d\s\-().]{6,}\d)", text)
    for m in candidates:
        raw = m.group(0).strip()
        # Reject if it looks exactly like a date: DD-MM-YYYY
        if _DOB_RE.match(raw):
            continue
        # Count only digits
        digits = re.sub(r"\D", "", raw)
        if len(digits) < 7 or len(digits) > 15:
            continue
        # Reject pure 4-digit years
        if re.match(r"^\d{4}$", digits):
            continue
        return raw
    return ""


def extract_name(text: str) -> str:
    """
    The name is almost always the very first non-empty content line
    before any section header appears.
    Skip lines that are section headers or look like contact/objective text.
    """
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    for line in lines[:15]:
        # Skip if it's a known section header
        if _SECTION_HEADER.match(line):
            break  # headers started, name not found before here
        # Skip objective/summary text — these are common false names
        if _NAME_SKIP.match(line):
            continue
        # Skip lines with email/URL
        if "@" in line or _URL_RE.search(line):
            continue
        # Skip lines that are clearly dates or phone/zip codes
        if re.search(r"\d{5,}", line):
            continue
        # Skip lines with special characters that don't belong in names
        if re.search(r"[|•:;/\\]", line):
            continue
        # Must be short and name-like (only letters, spaces, dots, hyphens)
        words = line.split()
        if 1 <= len(words) <= 5 and re.match(r"^[A-Za-z .'\-]+$", line):
            return line
    return ""


def extract_cgpa(text: str) -> str:
    """
    Multi-strategy CGPA/GPA extractor.
    Handles same-line, split-line (label on one line, value on next), and
    fraction formats. Validates the value is in a plausible academic range.
    """
    KW = r"(?:cgpa|gpa|cpi|aggregate|pointer|grade\s*point|percentage|percent)"

    # ── Strategy 1: same-line patterns ────────────────────────────────────────
    same_line = [
        # CGPA: 8.75  |  CGPA=8.75  |  CGPA 8.75/10
        rf"{KW}\s*[:/=]?\s*(\d{{1,3}}\.?\d{{0,2}})(?:/\d{{1,2}}(?:\.0)?)?",
        # 8.75 CGPA  |  8.75/10 GPA
        rf"(\d{{1,2}}\.\d{{1,2}})\s*(?:/\s*\d{{1,2}})?\s*{KW}",
        # Standalone fractions: 8.75/10  |  3.9/4.0
        r"(\d{1,2}\.\d{1,2})\s*/\s*(?:10|4(?:\.0)?)",
        # Percentage: 85%
        r"[:\s](\d{2,3}\.?\d{0,2})\s*%",
    ]

    for pattern in same_line:
        m = re.search(pattern, text, re.IGNORECASE)
        if m:
            val = m.group(1)
            try:
                f = float(val)
                if 0.1 <= f <= 100:
                    return val
            except ValueError:
                pass

    # ── Strategy 2: label on one line, value on the next ──────────────────────
    LABEL_RE = re.compile(
        r"(?:cgpa|gpa|cpi|aggregate|pointer|grade\s*point|percentage|percent)",
        re.IGNORECASE,
    )
    VALUE_RE = re.compile(r"^\s*(\d{1,3}\.?\d{0,2})\s*(?:/\s*\d{1,2})?\s*$")

    lines = text.splitlines()
    for i, line in enumerate(lines):
        if LABEL_RE.search(line):
            # Try inline number on the same line (skip years)
            inline = re.search(r"(\d{1,3}\.?\d{0,2})\s*(?:/\s*\d{1,2})?", line, re.IGNORECASE)
            if inline:
                val = inline.group(1)
                try:
                    f = float(val)
                    if 0.1 <= f <= 10.0 or 50 <= f <= 100:
                        return val
                except ValueError:
                    pass
            # Check next 1-2 lines for a lone number
            for j in range(i + 1, min(i + 3, len(lines))):
                vm = VALUE_RE.match(lines[j])
                if vm:
                    val = vm.group(1)
                    try:
                        f = float(val)
                        if 0.1 <= f <= 10.0 or 50 <= f <= 100:
                            return val
                    except ValueError:
                        pass
    return ""


def extract_skills(text: str) -> list:
    text_lower = text.lower()
    found = []
    for skill in SKILLS_KEYWORDS:
        pattern = r"(?<![a-zA-Z0-9])" + re.escape(skill) + r"(?![a-zA-Z0-9])"
        if re.search(pattern, text_lower):
            found.append(skill.title())
    return found


def _looks_like_location(line: str) -> bool:
    s = line.strip()
    if len(s) < 10:
        return True
    if re.search(
        r"\b(?:street|road|nagar|colony|sector|block|flat|floor|plot|"
        r"pincode|\d{6}|near|opposite|district|state|village|town|"
        r"municipality|tehsil|mandal|taluk)\b",
        s, re.IGNORECASE,
    ):
        return True
    if re.match(r"^[A-Za-z\s]+,\s*[A-Za-z\s]+$", s) and len(s.split()) <= 4:
        return True
    return False


def _matches_degree(line_lower: str) -> bool:
    for pat in DEGREE_PATTERNS:
        if re.search(pat, line_lower, re.IGNORECASE):
            return True
    return False


def extract_education(text: str) -> list:
    """
    First look inside the EDUCATION section (if found), then fall back to
    scanning the full text for degree-keyword lines.
    """
    sections = _split_sections(text)

    edu_lines = []
    # Try to get lines from the dedicated EDUCATION section key
    for key in sections:
        if _EDU_SECTION.match(key.strip()):
            edu_lines = sections[key]
            break

    # Fallback: scan whole text
    if not edu_lines:
        edu_lines = text.splitlines()

    edu = []
    for line in edu_lines:
        stripped = line.strip()
        if not stripped or stripped in edu:
            continue
        if not _matches_degree(stripped.lower()):
            continue
        if _URL_RE.search(stripped):
            continue
        if _looks_like_location(stripped):
            continue
        if len(stripped) > 200:
            continue
        edu.append(stripped)

    return edu[:5]


def extract_experience(text: str) -> list:
    """
    Section-based experience extractor.
    Finds the EXPERIENCE / INTERNSHIP / PROJECTS section header and
    collects lines until the next section header begins.
    Only captures lines that sound like actual job/role descriptions
    (not certifications or course completions).
    """
    lines = text.splitlines()
    exp_lines = []
    in_exp = False

    # Patterns that belong in achievements/certs, NOT in work experience
    _CERT_RE = re.compile(
        r"\b(?:certificate|certification|completed|completion|course|"
        r"workshop|hackathon|participated|participated\s+in|won|awarded|"
        r"achieved|scholarship|seminar|webinar|training\s+program)\b",
        re.IGNORECASE,
    )

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        # Detect start of experience section
        if _EXP_SECTION.match(stripped):
            in_exp = True
            continue

        # Detect start of any OTHER section → stop collecting
        if in_exp and _SECTION_HEADER.match(stripped) and len(stripped.split()) <= 5:
            break

        if in_exp:
            # Skip certificate/course lines
            if _CERT_RE.search(stripped):
                continue
            exp_lines.append(stripped)
            if len(exp_lines) >= 8:
                break

    return exp_lines


# ─── Main Parser ──────────────────────────────────────────────────────────────

def parse_resume(text: str) -> dict:
    return {
        "name":              extract_name(text),
        "email":             extract_email(text),
        "phone":             extract_phone(text),
        "cgpa":              extract_cgpa(text),
        "skills":            extract_skills(text),
        "education":         extract_education(text),
        "experience":        extract_experience(text),
        "raw_text_preview":  text[:400],
    }
