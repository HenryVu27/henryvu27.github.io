# Lamplight Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild henryvu.io as a lamplit reading room (Direction B): full-bleed scholar painting, IM Fell English and Crimson Pro, walnut and vellum themes, a ruled project catalogue, and content refreshed to September 2026.

**Architecture:** Plain HTML, CSS, and JavaScript on GitHub Pages, no build step. One token system on `html[data-theme]` drives every color. `index.html` carries all content; `styles.css` is rewritten from scratch on the tokens; `script.js` shrinks to theme, anchors, contact form, and one disclosure control. The Life pages keep their class names so the shared stylesheet restyles them for free.

**Tech Stack:** HTML5, CSS custom properties, vanilla JS, Google Fonts (IM Fell English, IM Fell English SC, Crimson Pro, plus a 2.5 KB EB Garamond glyph subset), Web3Forms for the contact form, Playwright (Python) for verification only.

**Spec:** `docs/superpowers/specs/2026-09-07-lamplight-redesign-design.md`

## Global Constraints

- No frameworks, no bundler, no npm dependencies in the repo. Verification scripts use the Playwright already installed in the local Python.
- Every color in CSS comes from a token; no literal hex outside the two token blocks and the hero overlay gradient.
- Copy rules: first person, contractions, no em dashes anywhere (use commas, colons, or a new sentence), one meaningful number per entry at most, no stacked metrics. Section 5 of the spec is the copy; use it verbatim.
- Ornament budget: one fleuron (U+2767) between sections, small caps for labels, one manicule (U+261E) on "Get in touch". Nothing else.
- No scroll-triggered reveals, no typing animation, no fixed header, no Font Awesome.
- Night is the default theme. localStorage key stays `theme`; values become `night` and `day`; old values `piano-symphony` and `morning-fog` migrate on load.
- Body text 19.5px Crimson Pro, line-height 1.55, max 62ch. Display IM Fell English never below 28px.
- Both themes must pass WCAG AA for body text (they do by construction from the token values).
- Commit after every task with the attribution footer used in this repo.

---

### Task 1: Assets (hero image, resume PDF, favicon)

**Files:**
- Create: `assets/scholar.jpg` (2000px wide or the best available), `assets/scholar-1200.jpg`
- Create: `assets/favicon.png` (512 by 512), `assets/favicon.svg`
- Create: `Henry_Vu_Resume.pdf` (copy of `~/personal/Resume_FDE.pdf`)
- Reference only: `~/personal/blog/series/ai-engineering/OG1.jpg` (fallback hero)

**Interfaces:**
- Produces: `assets/scholar.jpg` and `assets/scholar-1200.jpg` referenced by `styles.css` (`.hero`) in Task 3; `assets/favicon.png` and `assets/favicon.svg` referenced by the head in Task 2 and Task 5; `Henry_Vu_Resume.pdf` linked from the About section in Task 2.

- [ ] **Step 1: Pick the hero source**

If the painting agent delivered `scratchpad/hero-source.jpg` wider than 1400px and visually matching OG1.jpg, use it. Otherwise use OG1.jpg. Then:

```bash
cd /Users/vuducdung/personal/henryvu27.github.io
python3 - <<'EOF'
from PIL import Image
import os
src_hi = "/private/tmp/claude-502/-Users-vuducdung-personal/6a6ba90c-6359-4213-be9b-b58ee86505c2/scratchpad/hero-source.jpg"
src_lo = "/Users/vuducdung/personal/blog/series/ai-engineering/OG1.jpg"
src = src_hi if os.path.exists(src_hi) and Image.open(src_hi).size[0] >= 1400 else src_lo
im = Image.open(src).convert("RGB")
print("source", src, im.size)
for w, name, q in [(2000, "assets/scholar.jpg", 78), (1200, "assets/scholar-1200.jpg", 76)]:
    if im.size[0] < w and src == src_lo:
        out = im.copy()          # do not upscale the fallback
    else:
        r = w / im.size[0]; out = im.resize((w, round(im.size[1]*r)), Image.LANCZOS)
    out.save(name, "JPEG", quality=q, optimize=True, progressive=True)
    print(name, out.size, os.path.getsize(name)//1024, "KB")
EOF
```

Expected: two JPEGs written; the 2000px one under 600 KB.

- [ ] **Step 2: Copy the resume**

```bash
cp /Users/vuducdung/personal/Resume_FDE.pdf Henry_Vu_Resume.pdf && ls -la Henry_Vu_Resume.pdf
```

Expected: 137797 bytes.

- [ ] **Step 3: Render the favicon with the real display face**

Write `tools/render-favicon.html`:

```html
<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IM+Fell+English&display=swap">
<style>
  body{margin:0;background:#1f1811}
  .f{width:512px;height:512px;display:grid;place-items:center;background:#1f1811;color:#d2a85a;font:400 380px/1 "IM Fell English",serif}
</style>
<div class="f">H</div>
```

Then:

```bash
mkdir -p tools && python3 - <<'EOF'
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={"width":512,"height":512})
        await pg.goto("file:///Users/vuducdung/personal/henryvu27.github.io/tools/render-favicon.html", wait_until="networkidle")
        await pg.evaluate("document.fonts.ready"); await pg.wait_for_timeout(500)
        await pg.locator(".f").screenshot(path="assets/favicon.png"); await b.close()
asyncio.run(main())
EOF
cat > assets/favicon.svg <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#1f1811"/><text x="32" y="50" text-anchor="middle" font-family="IM Fell English, Iowan Old Style, Palatino, Georgia, serif" font-size="50" fill="#d2a85a">H</text></svg>
EOF
python3 -c "from PIL import Image; print(Image.open('assets/favicon.png').size)"
```

Expected: `(512, 512)`.

- [ ] **Step 4: Commit**

```bash
git add assets/scholar.jpg assets/scholar-1200.jpg assets/favicon.png assets/favicon.svg Henry_Vu_Resume.pdf tools/render-favicon.html
git rm -q --cached LLM_Eng_Resume.pdf 2>/dev/null; true
git commit -m "Add hero painting, favicon, and current resume PDF" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" -m "Claude-Session: https://claude.ai/code/session_01NFffw4nUcGiLCbetL6fmCd"
```

---

### Task 2: index.html rewrite (head and body)

**Files:**
- Modify: `index.html` (whole file)

**Interfaces:**
- Produces the class names `styles.css` (Task 3) and `script.js` (Task 4) rely on: `.rh`, `.rh-name`, `.rh-nav`, `.theme-toggle`, `.hero`, `.hero-inner`, `.hero-title`, `.hero-sub`, `.hero-where`, `.hero-links`, `.hand`, `.sec`, `.prose`, `.dinkus`, `.work`, `.when`, `.entry-dates`, `.proj`, `.tags`, `.earlier`, `.earlier-toggle`, `.contact-form`, `.field`, `.error-message`, `#form-status`, `.colophon`, `.social`.
- Element ids consumed by JS: `#contactForm`, `#form-status`, `#earlier`, `#earlier-toggle`, `#theme-toggle`.

- [ ] **Step 1: Write the head**

Replace everything from `<!DOCTYPE html>` through `</head>` with:

```html
<!DOCTYPE html>
<html lang="en" data-theme="night">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Henry Vu, Machine Learning Engineer in Dallas</title>
    <meta name="description" content="Henry Vu is the founding machine learning engineer at eXRealityAI in Dallas and an M.Sc. student at UT Dallas. Knowledge graphs, retrieval and evaluation for a Meta Quest repair app; voice and vision models at the edge; GardenXR on the Meta Horizon Store; NIH-funded ultrasound segmentation.">
    <meta name="author" content="Henry Vu">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://henryvu.io/">
    <meta property="og:title" content="Henry Vu, Machine Learning Engineer in Dallas">
    <meta property="og:description" content="Founding machine learning engineer at eXRealityAI. Knowledge graphs, retrieval and evaluation for a Meta Quest repair app; voice and vision models at the edge; GardenXR on the Meta Horizon Store; NIH-funded ultrasound segmentation at UT Dallas.">
    <meta property="og:image" content="https://henryvu.io/assets/og-image.png">
    <meta property="og:url" content="https://henryvu.io/">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Henry Vu">
    <meta property="og:locale" content="en_US">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@HenryVu27">
    <meta name="twitter:creator" content="@HenryVu27">
    <meta name="twitter:title" content="Henry Vu, Machine Learning Engineer in Dallas">
    <meta name="twitter:description" content="Founding machine learning engineer at eXRealityAI. Knowledge graphs, retrieval and evaluation for a Meta Quest repair app; voice and vision models at the edge; GardenXR on the Meta Horizon Store; NIH-funded ultrasound segmentation at UT Dallas.">
    <meta name="twitter:image" content="https://henryvu.io/assets/og-image.png">
    <meta name="theme-color" content="#1f1811">
    <meta name="geo.region" content="US-TX">
    <meta name="geo.placename" content="Dallas">
    <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
    <link rel="icon" type="image/png" sizes="512x512" href="assets/favicon.png">
    <link rel="apple-touch-icon" href="assets/favicon.png">
    <script>
      // Apply the saved theme before first paint so there is no flash.
      (function () {
        try {
          var t = localStorage.getItem('theme');
          if (t === 'morning-fog') t = 'day';
          if (t === 'piano-symphony') t = 'night';
          if (t === 'day' || t === 'night') document.documentElement.setAttribute('data-theme', t);
        } catch (e) {}
      })();
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=IM+Fell+English+SC&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=EB+Garamond&text=%E2%9D%A6%E2%9D%A7%E2%98%99%E2%98%9E&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css?v=6">
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-PJESH4V1MQ"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-PJESH4V1MQ');
    </script>
    <!-- JSON-LD: inserted in Step 2 -->
</head>
```

- [ ] **Step 2: Write the structured data**

Insert one `<script type="application/ld+json">` per block below at the JSON-LD comment. Every claim below is taken from spec sections 3 and 5.

Person:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://henryvu.io/#henry-vu",
  "name": "Henry Vu",
  "alternateName": ["HenryVu27", "Henry Vu Dallas", "Henry Vu UTD"],
  "jobTitle": "Founding Machine Learning Engineer",
  "description": "Henry Vu is the founding machine learning engineer at eXRealityAI in Dallas and an M.Sc. student in Computer Science at the University of Texas at Dallas, expected Summer 2027. He builds knowledge graphs, retrieval, and evaluation for a Meta Quest repair app, runs voice and vision models at the edge, shipped GardenXR to the Meta Horizon Store, and works on NIH-funded ultrasound segmentation with ThorMed Innovation and UT Dallas Bioengineering.",
  "url": "https://henryvu.io/",
  "image": "https://henryvu.io/assets/ppp.webp",
  "address": {"@type": "PostalAddress", "addressLocality": "Dallas", "addressRegion": "TX", "addressCountry": "US"},
  "worksFor": [
    {"@type": "Organization", "name": "eXRealityAI", "url": "https://exreality.ai/"},
    {"@type": "Organization", "name": "ThorMed Innovation"},
    {"@type": "EducationalOrganization", "name": "University of Texas at Dallas"}
  ],
  "affiliation": {"@type": "EducationalOrganization", "name": "University of Texas at Dallas", "alternateName": ["UTDallas", "UTD", "UT Dallas"]},
  "alumniOf": {"@type": "Organization", "name": "University of Alberta", "alternateName": "UAlberta"},
  "hasCredential": [
    {"@type": "EducationalOccupationalCredential", "credentialCategory": "degree", "educationalLevel": "Bachelor's", "name": "B.Sc. Computing Science with Honors, Summa Cum Laude", "recognizedBy": {"@type": "CollegeOrUniversity", "name": "University of Alberta"}}
  ],
  "award": ["Summa Cum Laude, University of Alberta"],
  "hasOccupation": [
    {"@type": "Occupation", "name": "Founding Machine Learning Engineer", "description": "Knowledge graph, retrieval, and evaluation for a Meta Quest 3 automotive repair app; voice and vision models on NVIDIA Jetson; GardenXR on the Meta Horizon Store"},
    {"@type": "Occupation", "name": "Computer Vision Engineer", "description": "NIH-funded ultrasound bladder segmentation with self-supervised pretraining and 4-bit quantization for portable devices"},
    {"@type": "Occupation", "name": "Teaching Assistant", "description": "Algorithms and data structures at UT Dallas"}
  ],
  "knowsAbout": ["Machine Learning", "LLM Agents", "Retrieval-Augmented Generation", "Knowledge Graphs", "Evaluation", "Computer Vision", "Medical Image Segmentation", "Self-Supervised Learning", "Model Quantization", "Edge AI", "Mixed Reality", "Multi-Armed Bandits", "Online Algorithms", "PyTorch", "LangGraph"],
  "sameAs": ["https://github.com/HenryVu27", "https://www.linkedin.com/in/henry-vu27/", "https://x.com/HenryVu27", "https://www.henryvu.blog/"]
}
```

WebSite (unchanged apart from the name):

```json
{"@context": "https://schema.org", "@type": "WebSite", "name": "Henry Vu", "alternateName": ["HenryVu27", "Henry Vu UTD", "Henry Vu Dallas"], "url": "https://henryvu.io/"}
```

SoftwareApplication for GardenXR: keep the existing block but delete the `aggregateRating` object and change `"author"."name"` to `"eXRealityAI"`.

Blog block: keep as is.

ItemList of projects: keep positions 1 to 4 and 6 to 9 as they are; replace position 5 ("Voice-to-Voice RAG System") description with the sentence from the eXRealityAI timeline entry ("A voice-to-voice assistant that runs entirely on an NVIDIA Jetson Orin: Whisper for speech in, hybrid BM25 and FAISS retrieval, a quantized Mistral 7B, and Kokoro for speech out.") and add two new entries:

```json
{"@type": "SoftwareSourceCode", "position": 10, "name": "DatDai", "description": "A question-answering assistant over Vietnamese land law, live on Cloud Run. Every answer cites the exact article and clause, an amendment graph pulls in the decrees that later changed a clause, and a citation verifier checks each cited article against what was actually retrieved.", "author": {"@type": "Person", "name": "Henry Vu", "url": "https://henryvu.io/"}, "codeRepository": "https://github.com/HenryVu27/Urban", "programmingLanguage": "Python"},
{"@type": "SoftwareSourceCode", "position": 11, "name": "ADHD Coaching Agent", "description": "A coaching chatbot for parents of children with ADHD: a LangGraph ReAct agent between two guardrail gates, hybrid retrieval with a local cross-encoder reranker, four-tier memory, and an evaluation package with LLM judges and pairwise comparisons.", "author": {"@type": "Person", "name": "Henry Vu", "url": "https://henryvu.io/"}, "codeRepository": "https://github.com/HenryVu27/ADHDAgent", "programmingLanguage": "Python"}
```

Also fix the ScholarlyArticle at position 1: description becomes "NIH-funded work with UT Dallas Bioengineering: self-supervised pretraining of U-Net encoders on 9.2K ultrasound images, 96 percent Dice on bladder segmentation, and about seven times better robustness under 4-bit quantization for portable devices."

FAQPage: keep the six questions; replace every answer:

1. Who is Henry Vu? "Henry Vu is the founding machine learning engineer at eXRealityAI in Dallas and an M.Sc. student in Computer Science at the University of Texas at Dallas, expected Summer 2027. He also works as a computer vision engineer at ThorMed Innovation on NIH-funded medical imaging, and graduated summa cum laude from the University of Alberta."
2. What does Henry Vu work on? (rename from "research") "Knowledge graphs, retrieval, and evaluation for LLM products; voice and vision models running at the edge on NVIDIA Jetson; mixed reality apps for Meta Quest; and self-supervised learning and quantization for medical ultrasound segmentation. Earlier, online algorithms and multi-armed bandits at Amii and SODALab."
3. Where does Henry Vu work? "eXRealityAI, where he is the founding machine learning engineer; ThorMed Innovation, as a computer vision engineer on NIH-funded bladder segmentation; and UT Dallas, as a teaching assistant for algorithms and data structures."
4. What has Henry Vu built? "The knowledge graph, retrieval layer, and CI evaluation harness behind a Meta Quest 3 automotive repair app; a voice-to-voice assistant that runs entirely on an NVIDIA Jetson Orin; GardenXR, published on the Meta Horizon Store; DatDai, a Vietnamese land-law assistant on Cloud Run with a citation verifier; an ADHD coaching agent with guardrails and an evaluation suite; and ML Interview Practice, a browser-only Python practice site."
5. Where did Henry Vu study? "B.Sc. in Computing Science with Honors, summa cum laude, from the University of Alberta, and an M.Sc. in Computer Science at the University of Texas at Dallas, expected Summer 2027."
6. What is Henry Vu's blog about? Keep the existing answer.

Delete the BreadcrumbList and ProfilePage blocks entirely (the Person block above carries everything they said that was true).

- [ ] **Step 3: Write the body**

Replace everything from `<body>` to `</html>` with the structure below. Copy for About, the timeline, and the projects comes verbatim from spec section 5. The templates show one instance of each repeated element; repeat them for every entry in the spec.

```html
<body>
    <a class="skip" href="#about">Skip to content</a>

    <header class="hero" id="top">
        <div class="rh">
            <a class="rh-name" href="#top">Henry Vu</a>
            <nav class="rh-nav" aria-label="Sections">
                <a href="#about">About</a>
                <a href="#work">Work</a>
                <a href="#projects">Projects</a>
                <a href="#contact">Contact</a>
                <button type="button" class="theme-toggle" id="theme-toggle" aria-pressed="true">Day</button>
            </nav>
        </div>
        <div class="hero-inner">
            <h1 class="hero-title">Henry Vu</h1>
            <p class="hero-sub">I'm exploring how to build machines that can learn.</p>
            <p class="hero-where">Machine learning engineer in Dallas</p>
            <p class="hero-links">
                <a href="#about">About me</a>
                <a href="#contact"><span class="hand" aria-hidden="true">&#x261E;</span>Get in touch</a>
            </p>
        </div>
    </header>

    <main class="page">
        <section class="sec" id="about" aria-labelledby="about-h">
            <h2 id="about-h">About</h2>
            <div class="prose">
                <p>Hey, I'm Henry. I'm the founding machine learning engineer at <a href="https://exreality.ai/" target="_blank" rel="noopener">eXRealityAI</a> in Dallas, ... (spec section 5, paragraph 1)</p>
                <p>... (paragraph 2)</p>
                <p>... (paragraph 3)</p>
                <p><a href="Henry_Vu_Resume.pdf" target="_blank" rel="noopener">My resume</a></p>
            </div>
        </section>

        <div class="dinkus" role="separator" aria-hidden="true">&#x2767;</div>

        <section class="sec" id="work" aria-labelledby="work-h">
            <h2 id="work-h">Where I've worked</h2>
            <ol class="work">
                <li>
                    <span class="when">2025</span>
                    <div class="entry">
                        <h3>Founding Machine Learning Engineer <i>at <a href="https://exreality.ai/" target="_blank" rel="noopener">eXRealityAI</a></i></h3>
                        <span class="entry-dates">Aug 2025 to now</span>
                        <ul>
                            <li>Built the knowledge graph and retrieval layer ... (spec section 5)</li>
                            <li>...</li>
                        </ul>
                    </div>
                </li>
                <!-- ThorMed (2025), UT Dallas TA (2025), SODALab (2024), UAlberta TA (2023), Amii (2022) -->
            </ol>
        </section>

        <div class="dinkus" role="separator" aria-hidden="true">&#x2767;</div>

        <section class="sec" id="projects" aria-labelledby="projects-h">
            <h2 id="projects-h">Projects</h2>
            <ul class="proj">
                <li>
                    <h3><a href="https://github.com/HenryVu27/Urban" target="_blank" rel="noopener">DatDai</a></h3>
                    <p>A question-answering assistant over Vietnamese land law, live on Cloud Run. ... (spec)</p>
                    <span class="tags">Python, Gemini, Qdrant, Langfuse, Cloud Run</span>
                </li>
                <!-- remaining Featured entries, then the More entries. StitchKit uses <h3>StitchKit</h3> with no link. Entries with two links use two <a> in a <span class="links"> after the tags. -->
            </ul>
            <button type="button" class="earlier-toggle" id="earlier-toggle" aria-expanded="false" aria-controls="earlier">Show earlier work</button>
            <ul class="earlier" id="earlier" hidden>
                <li><a href="https://github.com/HenryVu27/ViT-and-Contrastive-Learning" target="_blank" rel="noopener">ViT and Contrastive Representation Learning</a> <span class="year">2023</span></li>
                <!-- one line per Earlier entry, newest first, existing titles and links -->
            </ul>
        </section>

        <div class="dinkus" role="separator" aria-hidden="true">&#x2767;</div>

        <section class="sec" id="contact" aria-labelledby="contact-h">
            <h2 id="contact-h">Get in touch</h2>
            <p class="prose contact-note">I read every message. Drop me a line and I'll get back to you soon.</p>
            <form class="contact-form" id="contactForm" action="https://api.web3forms.com/submit" method="POST" novalidate>
                <input type="hidden" name="access_key" value="3c4613f9-1572-4002-a1ff-56c37491db51">
                <div class="field">
                    <label for="subject">Subject</label>
                    <input type="text" id="subject" name="subject" autocomplete="off">
                    <div class="error-message" aria-live="polite"></div>
                </div>
                <div class="field">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required autocomplete="email">
                    <div class="error-message" aria-live="polite"></div>
                </div>
                <div class="field">
                    <label for="message">Message</label>
                    <textarea id="message" name="message" rows="6" required></textarea>
                    <div class="error-message" aria-live="polite"></div>
                </div>
                <input type="checkbox" name="botcheck" class="botcheck" tabindex="-1" aria-hidden="true">
                <button type="submit" class="send">Send</button>
            </form>
            <p id="form-status" role="status"></p>
        </section>
    </main>

    <footer class="colophon">
        <p>Set in IM Fell English and Crimson Pro</p>
        <p class="social">
            <a href="https://github.com/HenryVu27" target="_blank" rel="noopener">GitHub</a>
            <a href="https://www.linkedin.com/in/henry-vu27/" target="_blank" rel="noopener">LinkedIn</a>
            <a href="https://x.com/HenryVu27" target="_blank" rel="noopener">X</a>
            <a href="https://www.henryvu.blog/" target="_blank" rel="noopener">Blog</a>
        </p>
    </footer>

    <script src="script.js?v=4"></script>
</body>
</html>
```

Project entries with two links (bladder segmentation, ML Interview Practice) put both links inside the `<h3>` is wrong; instead the `<h3>` links to the primary and a trailing `<span class="links"><a href="...">Paper</a></span>` follows the tags.

- [ ] **Step 4: Check the file parses and the ids exist**

```bash
python3 - <<'EOF'
import json, re, html.parser
src = open("index.html", encoding="utf-8").read()
for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', src, re.S):
    json.loads(m.group(1))            # raises on bad JSON
for i in ["about","work","projects","contact","contactForm","form-status","earlier","earlier-toggle","theme-toggle"]:
    assert f'id="{i}"' in src, i
for bad in ["fa-", "font-awesome", "LLM_Eng_Resume", "AGES", "5/5", "30+ technical", "grad student", "—"]:
    assert bad not in src, bad
class P(html.parser.HTMLParser):
    def __init__(s): super().__init__(); s.stack=[]
    def handle_starttag(s,t,a):
        if t not in ("meta","link","input","br","img","hr"): s.stack.append(t)
    def handle_endtag(s,t):
        assert s.stack and s.stack[-1]==t, f"mismatch at {t}, stack {s.stack[-3:]}"; s.stack.pop()
p=P(); p.feed(src); assert not p.stack, p.stack
print("index.html ok")
EOF
```

Expected: `index.html ok`.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Rewrite index.html: lamplight structure, refreshed content, corrected structured data" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" -m "Claude-Session: https://claude.ai/code/session_01NFffw4nUcGiLCbetL6fmCd"
```

---

### Task 3: styles.css rewrite

**Files:**
- Modify: `styles.css` (whole file)

**Interfaces:**
- Consumes the class names from Task 2 and the Life page class names (`.life-landing`, `.life-narrative`, `.life-hint`, `.life-category`, `.life-back`, `.life-tagline`, `.life-entries`, `.life-entry`, `.life-entry-media`, `.life-entry-text`, `.life-entry-location`, `.life-entry-title`, `.life-entry-review`, `.life-entry-rating`, `.video-container`).
- Produces: nothing consumed by later tasks except the visual result.

- [ ] **Step 1: Write the file**

```css
/* henryvu.io: Lamplight. Tokens first, then base, then components. */

/* ---------- Tokens ---------- */
:root, :root[data-theme="night"] {
  --bg: #1f1811; --card: #28201a; --raised: #342a21;
  --ink: #f1e4cd; --text: #d9cbb2; --text-2: #b3a48b; --muted: #a09280;
  --rule: #3d3227; --border: #857462;
  --accent: #dc7d55; --gold: #d2a85a; --link: #d2a85a;
  --selection: #4b3719;
  --edge: #17120d;
  --grain-opacity: .09; --grain-blend: soft-light;
  --hero-fade: var(--bg);
  color-scheme: dark;
}
:root[data-theme="day"] {
  --bg: #f3ebda; --card: #ebe0c9; --raised: #faf5ea;
  --ink: #2a2118; --text: #3f3428; --text-2: #6b5b48; --muted: #6e5e48;
  --rule: #d8cbb0; --border: #8a7858;
  --accent: #7f2a1e; --gold: #7a5c14; --link: #7f2a1e;
  --selection: #ecd2b1;
  --edge: #f3ebda;
  --grain-opacity: .055; --grain-blend: multiply;
  color-scheme: light;
}

:root {
  --fd: "IM Fell English", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
  --fb: "Crimson Pro", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
  --fsc: "IM Fell English SC", "IM Fell English", Georgia, serif;
  --forn: "EB Garamond", var(--fb);
  --col: 880px;
  --pad: clamp(20px, 4vw, 56px);
}

/* ---------- Base ---------- */
*, *::before, *::after { box-sizing: border-box; }
html { background: var(--edge); scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body {
  margin: 0; position: relative; isolation: isolate;
  background: var(--bg); color: var(--text);
  font-family: var(--fb); font-size: 19.5px; line-height: 1.55;
  font-synthesis: none; text-wrap: pretty;
  transition: background-color .3s ease, color .3s ease;
}
::selection { background: var(--selection); color: var(--ink); }
h1, h2, h3 { margin: 0; color: var(--ink); text-wrap: balance; }
p { margin: 0; }
a { color: var(--link); text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: .18em;
    text-decoration-color: color-mix(in oklab, var(--link) 45%, transparent); transition: text-decoration-color .15s ease; }
a:hover { text-decoration-color: currentColor; }
a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }
button { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; }
.skip { position: absolute; left: -999px; top: 0; padding: .5em 1em; background: var(--raised); color: var(--ink); z-index: 100; }
.skip:focus { left: 12px; top: 12px; }
.sc, .rh, .hero-where, .hero-links, .when, .entry-dates, .tags, .colophon, .earlier-toggle, .theme-toggle, .year, .links {
  font-family: var(--fsc); letter-spacing: .1em; font-size: 15px;
}

/* grain and lamplight, under everything */
body::before {
  content: ""; position: fixed; inset: 0; z-index: -1; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch' seed='7'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
  background-size: 240px 240px; opacity: var(--grain-opacity); mix-blend-mode: var(--grain-blend);
  will-change: transform;
}
body::after {
  content: ""; position: fixed; inset: 0; z-index: -2; pointer-events: none; opacity: 0; transition: opacity .3s ease;
  background:
    radial-gradient(90% 60% at 38% 0%, rgba(255,190,110,.07) 0%, rgba(255,190,110,.03) 40%, transparent 70%),
    radial-gradient(130% 95% at 42% 18%, #2a2117 0%, #221b14 42%, #1a140f 78%, #17120d 100%);
  will-change: transform;
}
:root[data-theme="night"] body::after { opacity: 1; }
@media (max-width: 480px), (prefers-reduced-transparency: reduce), (prefers-reduced-data: reduce), print {
  body::before { display: none; }
}

/* ---------- Running head ---------- */
.rh {
  position: absolute; top: 0; left: 0; right: 0; z-index: 3;
  display: flex; justify-content: space-between; align-items: baseline; gap: 24px;
  max-width: var(--col); margin: 0 auto; padding: 22px var(--pad) 14px;
  color: rgba(241,228,205,.82);
}
.rh a, .rh button { color: inherit; text-decoration: none; }
.rh a:hover, .rh button:hover, .rh .rh-name { color: #f1e4cd; }
.rh-nav { display: flex; gap: 26px; flex-wrap: wrap; align-items: baseline; }
.theme-toggle { padding: 0; border-bottom: 1px solid transparent; }
.theme-toggle:hover { border-bottom-color: currentColor; }

/* ---------- Hero ---------- */
.hero {
  position: relative; min-height: 85vh; min-height: 85svh; /* vh fallback first, svh wins where supported */
  display: flex; align-items: flex-end;
  background: #17120d url("assets/scholar-1200.jpg") center 28% / cover no-repeat;
}
@media (min-width: 900px) { .hero { background-image: url("assets/scholar.jpg"); } }
.hero::after {
  content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: linear-gradient(to bottom, rgba(18,12,7,.30) 0%, rgba(18,12,7,.48) 50%, rgba(18,12,7,.62) 86%, var(--hero-fade) 100%);
}
:root[data-theme="day"] .hero::after {
  background: linear-gradient(to bottom, rgba(18,12,7,.25) 0%, rgba(18,12,7,.52) 55%, rgba(18,12,7,.66) 100%);
  border-bottom: 1px solid var(--rule);
}
.hero-inner { position: relative; z-index: 2; width: 100%; max-width: var(--col); margin: 0 auto; padding: 200px var(--pad) 44px; }
.hero-title { font-family: var(--fd); font-weight: 400; font-size: clamp(50px, 7vw, 72px); line-height: 1; color: #f7ecd8; text-shadow: 0 1px 2px rgba(0,0,0,.35); }
.hero-sub { font-style: italic; font-size: 24px; color: rgba(247,236,216,.92); margin: 14px 0 12px; max-width: 30ch; text-shadow: 0 1px 2px rgba(0,0,0,.35); }
.hero-where { color: rgba(241,228,205,.78); letter-spacing: .12em; }
.hero-links { margin-top: 22px; display: flex; gap: 28px; letter-spacing: .12em; font-size: 16px; }
.hero-links a { color: #e6c98a; text-decoration: none; }
.hero-links a:hover { text-decoration: underline; }
.hand { font-family: var(--forn); letter-spacing: 0; margin-right: .3em; }

/* ---------- Page and sections ---------- */
.page { max-width: var(--col); margin: 0 auto; padding: 0 var(--pad); animation: rise .45s cubic-bezier(.23,1,.32,1) both; }
@keyframes rise { from { opacity: 0; transform: translateY(6px); } }
.sec { padding-top: 48px; scroll-margin-top: 24px; }
.sec h2 { font-family: var(--fd); font-weight: 400; font-size: 36px; line-height: 1.1; margin-bottom: 20px; }
.prose { max-width: 62ch; }
.prose p + p { margin-top: .9em; }
.dinkus { text-align: center; font-family: var(--forn); font-size: 1.35em; line-height: 1; color: var(--gold); opacity: .75; margin: 52px 0 4px; }

/* ---------- Work ---------- */
.work { list-style: none; margin: 0; padding: 0; }
.work > li { display: grid; grid-template-columns: 6.5rem 1fr; gap: 20px; padding: 18px 0; border-top: 1px solid var(--rule); }
.work > li:last-child { border-bottom: 1px solid var(--rule); }
.when { color: var(--gold); opacity: .85; padding-top: .3em; }
.entry h3 { font-family: var(--fb); font-weight: 500; font-size: 1.05em; line-height: 1.3; }
.entry h3 i { font-weight: 400; color: var(--text-2); }
.entry h3 a { color: inherit; text-decoration: none; }
.entry h3 a:hover { text-decoration: underline; }
.entry-dates { display: block; color: var(--muted); margin: 2px 0 8px; font-size: 14px; }
.entry ul { list-style: none; margin: 0; padding: 0; max-width: 62ch; }
.entry li { position: relative; padding-left: 1rem; color: var(--text-2); font-size: .95em; line-height: 1.5; margin-bottom: .35em; }
.entry li::before { content: ""; position: absolute; left: 0; top: .72em; width: 3px; height: 3px; border-radius: 50%; background: var(--muted); opacity: .6; }

/* ---------- Projects ---------- */
.proj { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; column-gap: 40px; }
.proj > li { padding: 14px 0; border-top: 1px solid var(--rule); display: flex; flex-direction: column; gap: 4px; }
.proj h3 { font-family: var(--fb); font-weight: 500; font-size: 1.02em; line-height: 1.3; }
.proj h3 a { text-decoration: none; }
.proj h3 a:hover { text-decoration: underline; }
.proj p { color: var(--text-2); font-size: .9em; }
.tags, .links { color: var(--muted); letter-spacing: .06em; font-size: 14px; }
.links a { margin-right: 1em; }
.earlier-toggle { display: block; margin: 20px 0 0; padding: 8px 0; color: var(--link); border-bottom: 1px solid transparent; }
.earlier-toggle:hover { border-bottom-color: currentColor; }
.earlier { list-style: none; margin: 12px 0 0; padding: 0; }
.earlier li { display: flex; justify-content: space-between; gap: 16px; padding: 8px 0; border-top: 1px solid var(--rule); font-size: .95em; }
.earlier li:last-child { border-bottom: 1px solid var(--rule); }
.earlier .year { color: var(--muted); flex-shrink: 0; }

/* ---------- Contact ---------- */
.contact-note { color: var(--text-2); font-style: italic; margin-bottom: 20px; }
.contact-form { max-width: 62ch; display: flex; flex-direction: column; gap: 22px; }
.field { display: flex; flex-direction: column; gap: 4px; }
.field label { font-family: var(--fsc); letter-spacing: .1em; font-size: 14px; color: var(--muted); }
.field input, .field textarea {
  width: 100%; background: transparent; color: var(--text); border: 0; border-bottom: 1px solid var(--border);
  border-radius: 0; padding: 6px 0; font: inherit; line-height: 1.4; resize: vertical;
}
.field input:focus, .field textarea:focus { outline: none; border-bottom-color: var(--gold); }
.error-message { min-height: 1.2em; font-size: .85em; color: var(--accent); }
.botcheck { display: none; }
.send {
  align-self: flex-start; font-family: var(--fsc); letter-spacing: .12em; font-size: 16px;
  color: var(--bg); background: var(--gold); padding: 10px 26px; border-radius: 2px;
  transition: box-shadow .2s ease, transform .2s ease;
}
.send:hover { box-shadow: 0 1px 2px rgba(0,0,0,.25), 0 6px 18px rgba(0,0,0,.25); transform: translateY(-1px); }
#form-status { margin-top: 18px; color: var(--gold); font-style: italic; }
#form-status.error { color: var(--accent); }

/* ---------- Colophon ---------- */
.colophon { text-align: center; padding: 64px var(--pad) 40px; color: var(--muted); line-height: 2; }
.social { display: flex; justify-content: center; gap: 28px; flex-wrap: wrap; }
.social a { color: inherit; text-decoration: none; }
.social a:hover { color: var(--ink); }

/* ---------- Life pages (unlinked, kept readable) ---------- */
.life-landing, .life-category { max-width: var(--col); margin: 0 auto; padding: 120px var(--pad) 80px; }
.life-landing h2, .life-category h2 { font-family: var(--fd); font-weight: 400; font-size: 36px; margin-bottom: 16px; color: var(--ink); }
.life-narrative { font-size: 1.1em; line-height: 1.7; max-width: 62ch; }
.life-hint, .life-tagline, .life-entry-location { color: var(--muted); font-style: italic; }
.life-back { display: inline-block; margin-bottom: 20px; }
.life-entries { display: flex; flex-direction: column; }
.life-entry { display: flex; gap: 24px; align-items: center; padding: 2rem 0; border-bottom: 1px solid var(--rule); }
.life-entry:last-child { border-bottom: 0; }
.life-entry:nth-child(even) { flex-direction: row-reverse; }
.life-entry-media, .life-entry-text { flex: 1; min-width: 0; }
.life-entry-media img { width: 100%; height: auto; display: block; }
.life-entry-title { font-family: var(--fb); font-weight: 500; font-size: 1.05em; color: var(--ink); margin: 0 0 .5rem; }
.life-entry-review { color: var(--text-2); font-size: .95em; }
.life-entry-rating { display: inline-block; color: var(--gold); margin-top: .5rem; }
.video-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; }
.video-container iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.life-page .rh { position: static; color: var(--text-2); border-bottom: 1px solid var(--rule); }
.life-page .rh .rh-name, .life-page .rh a:hover, .life-page .rh button:hover { color: var(--ink); }

/* ---------- Responsive ---------- */
@media (max-width: 760px) {
  body { font-size: 18px; }
  .hero { min-height: 70vh; min-height: 70svh; }
  .hero-inner { padding-top: 150px; }
  .rh { flex-direction: column; align-items: flex-start; gap: 10px; }
  .rh-nav { gap: 18px; }
  .work > li { grid-template-columns: 1fr; gap: 4px; }
  .proj { grid-template-columns: 1fr; }
  .life-entry, .life-entry:nth-child(even) { flex-direction: column; gap: 16px; }
}
@media (max-width: 480px) { .hero { min-height: 520px; } .sec h2 { font-size: 32px; } }

/* ---------- Motion preferences and view transitions ---------- */
@media (prefers-reduced-motion: no-preference) {
  @view-transition { navigation: auto; }
  ::view-transition-old(root) { animation: 160ms cubic-bezier(.4,0,1,1) both vt-out; }
  ::view-transition-new(root) { animation: 280ms cubic-bezier(.23,1,.32,1) both vt-in; }
}
@keyframes vt-out { to { opacity: 0; } }
@keyframes vt-in { from { opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .page { animation: none; }
  html { scroll-behavior: auto; }
  .send:hover { transform: none; }
}
```

- [ ] **Step 2: Check the file for balanced braces and literal colors outside tokens**

```bash
python3 - <<'EOF'
import re
css = open("styles.css").read()
assert css.count("{") == css.count("}"), "unbalanced braces"
body = css.split("/* ---------- Base ---------- */")[1]
hexes = set(re.findall(r"#[0-9a-fA-F]{6}\b", body))
allowed = {"#17120d","#2a2117","#221b14","#1a140f","#f1e4cd","#f7ecd8","#e6c98a"}  # hero overlay, lamplight, cream-over-painting
print("literal colors outside tokens:", sorted(hexes - allowed) or "none")
print("styles.css ok, lines:", css.count("\n"))
EOF
```

Expected: `literal colors outside tokens: none`.

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "Rewrite styles.css on the walnut and vellum token system" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" -m "Claude-Session: https://claude.ai/code/session_01NFffw4nUcGiLCbetL6fmCd"
```

---

### Task 4: script.js rewrite

**Files:**
- Modify: `script.js` (whole file)
- Create: `tools/check_site.py` (Playwright checks used here and in Task 7)

**Interfaces:**
- Consumes: `#theme-toggle`, `#contactForm`, `#form-status`, `#earlier`, `#earlier-toggle`, `a[href^="#"]` from Task 2.
- Produces: `window.__theme` is not exposed; state lives in `html[data-theme]` and `localStorage.theme` (`night` or `day`).

- [ ] **Step 1: Write script.js**

```js
// henryvu.io: theme, anchors, contact form, earlier-work disclosure. No scroll effects.
(function () {
  'use strict';
  var root = document.documentElement;

  // ---- Theme ----
  function currentTheme() { return root.getAttribute('data-theme') === 'day' ? 'day' : 'night'; }
  function applyTheme(next) {
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    var btn = document.getElementById('theme-toggle');
    if (btn) { btn.textContent = next === 'night' ? 'Day' : 'Night'; btn.setAttribute('aria-pressed', String(next === 'night')); }
  }
  // Migrate old keys; the inline head script already set the attribute for first paint.
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'morning-fog') saved = 'day';
    if (saved === 'piano-symphony') saved = 'night';
    if (saved === 'day' || saved === 'night') applyTheme(saved); else applyTheme(currentTheme());
  } catch (e) { applyTheme(currentTheme()); }

  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'night' ? 'day' : 'night';
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (document.startViewTransition && !reduce) document.startViewTransition(function () { applyTheme(next); });
      else applyTheme(next);
    });
  }

  // ---- Same-page anchors (smooth unless reduced motion) ----
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1);
      var el = id ? document.getElementById(id) : null;
      if (!el) return;
      e.preventDefault();
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + id);
    });
  });

  // ---- Earlier work disclosure ----
  var earlierBtn = document.getElementById('earlier-toggle');
  var earlier = document.getElementById('earlier');
  if (earlierBtn && earlier) {
    earlierBtn.addEventListener('click', function () {
      var open = earlier.hidden;
      earlier.hidden = !open;
      earlierBtn.setAttribute('aria-expanded', String(open));
      earlierBtn.textContent = open ? 'Hide earlier work' : 'Show earlier work';
    });
  }

  // ---- Contact form (Web3Forms) ----
  var form = document.getElementById('contactForm');
  var status = document.getElementById('form-status');
  function setError(input, msg) { var box = input.parentElement.querySelector('.error-message'); if (box) box.textContent = msg; }
  if (form && status) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      form.querySelectorAll('.error-message').forEach(function (d) { d.textContent = ''; });
      status.textContent = ''; status.classList.remove('error');
      var email = form.querySelector('input[name="email"]');
      var message = form.querySelector('textarea[name="message"]');
      var ok = true;
      if (!email.value.trim()) { setError(email, 'Please enter your email.'); ok = false; }
      else if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) { setError(email, 'Please enter a valid email.'); ok = false; }
      if (!message.value.trim()) { setError(message, 'Please enter a message.'); ok = false; }
      if (!ok) return;
      var send = form.querySelector('.send');
      send.disabled = true; send.textContent = 'Sending';
      try {
        var res = await fetch(form.action, { method: 'POST', body: new FormData(form) });
        var data = await res.json();
        if (!data.success) throw new Error(data.message || 'Something went wrong.');
        form.hidden = true;
        status.textContent = 'Sent. Thank you, I will write back soon.';
      } catch (err) {
        send.disabled = false; send.textContent = 'Send';
        status.classList.add('error');
        status.textContent = 'Could not send the message. Please try again in a moment.';
      }
    });
  }
})();
```

- [ ] **Step 2: Write the verification script**

`tools/check_site.py`:

```python
"""Render the site with Playwright and check the things a reviewer would check by hand."""
import asyncio, sys, os
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "tools", "shots"); os.makedirs(OUT, exist_ok=True)
URL = "file://" + os.path.join(ROOT, "index.html")

async def main():
    failures = []
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for theme in ("night", "day"):
            for w in (390, 820, 1440):
                ctx = await b.new_context(viewport={"width": w, "height": 900})
                await ctx.add_init_script(f"localStorage.setItem('theme','{theme}')")
                pg = await ctx.new_page(); errors = []
                pg.on("pageerror", lambda e: errors.append(str(e)))
                pg.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
                await pg.goto(URL, wait_until="networkidle"); await pg.evaluate("document.fonts.ready"); await pg.wait_for_timeout(600)
                await pg.screenshot(path=f"{OUT}/{theme}-{w}.png", full_page=True)
                sw = await pg.evaluate("document.documentElement.scrollWidth"); cw = await pg.evaluate("document.documentElement.clientWidth")
                if sw > cw: failures.append(f"{theme}-{w}: horizontal scroll {sw}>{cw}")
                if errors: failures.append(f"{theme}-{w}: console errors {errors[:3]}")
                fonts = await pg.evaluate("Array.from(document.fonts).filter(f=>f.status==='loaded').map(f=>f.family)")
                for f in ("IM Fell English", "IM Fell English SC", "Crimson Pro", "EB Garamond"):
                    if f not in fonts: failures.append(f"{theme}-{w}: font not loaded {f}")
                got = await pg.evaluate("document.documentElement.getAttribute('data-theme')")
                if got != theme: failures.append(f"{theme}-{w}: theme attr {got}")
                if w == 1440 and theme == "night":
                    # interactions
                    await pg.click("#theme-toggle"); await pg.wait_for_timeout(400)
                    if await pg.evaluate("localStorage.getItem('theme')") != "day": failures.append("toggle did not persist day")
                    await pg.click("#earlier-toggle")
                    if await pg.evaluate("document.getElementById('earlier').hidden"): failures.append("earlier did not open")
                    await pg.click("#contactForm .send")
                    msgs = await pg.evaluate("Array.from(document.querySelectorAll('#contactForm .error-message')).map(e=>e.textContent).filter(Boolean)")
                    if len(msgs) < 2: failures.append(f"form validation messages {msgs}")
                await ctx.close()
        await b.close()
    print("\n".join(failures) if failures else "all checks passed")
    sys.exit(1 if failures else 0)
asyncio.run(main())
```

- [ ] **Step 3: Run it**

```bash
python3 tools/check_site.py
```

Expected: `all checks passed`. Then look at `tools/shots/night-1440.png` and `tools/shots/day-390.png` (crop the tall ones) and fix anything visibly wrong in CSS before committing.

- [ ] **Step 4: Commit**

```bash
git add script.js tools/check_site.py
printf 'tools/shots/\n' >> .gitignore
git add .gitignore
git commit -m "Rewrite script.js: theme with view transition, anchors, form, earlier-work toggle; add Playwright checks" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" -m "Claude-Session: https://claude.ai/code/session_01NFffw4nUcGiLCbetL6fmCd"
```

---

### Task 5: Life pages and 404

**Files:**
- Modify: `life.html`, `life/food.html`, `life/wine.html`, `life/piano.html` (head and header only; entries untouched)
- Keep: `404.html` (it is a meta-refresh redirect to `/`; no restyle needed, contrary to the spec's one-line note, because nothing renders long enough to style)

**Interfaces:**
- Consumes `.life-page .rh` styles from Task 3 and `#theme-toggle` behavior from Task 4.

- [ ] **Step 1: Replace each Life page head and header**

For each of the four files, replace the `<link>` tags for DM Sans, the three Font Awesome sheets, and `styles.css` with (adjust `../` for the three sub-pages):

```html
    <script>(function(){try{var t=localStorage.getItem('theme');if(t==='morning-fog')t='day';if(t==='piano-symphony')t='night';if(t==='day'||t==='night')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=IM+Fell+English+SC&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=EB+Garamond&text=%E2%9D%A6%E2%9D%A7%E2%98%99%E2%98%9E&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css?v=6">
```

Set `<html lang="en" data-theme="night">` and add `class="life-page"` to `<body>`. Replace the whole `<header>...</header>` with:

```html
    <header class="rh">
        <a class="rh-name" href="index.html">Henry Vu</a>
        <nav class="rh-nav" aria-label="Sections">
            <a href="index.html#about">About</a>
            <a href="index.html#work">Work</a>
            <a href="index.html#projects">Projects</a>
            <a href="index.html#contact">Contact</a>
            <button type="button" class="theme-toggle" id="theme-toggle" aria-pressed="true">Day</button>
        </nav>
    </header>
```

Replace the `<footer>` with the colophon from Task 2 (paths adjusted) and keep `<script src="script.js?v=4"></script>` (path adjusted).

- [ ] **Step 2: Check**

```bash
grep -l "font-awesome\|DM+Sans\|fa-" life.html life/*.html && echo "STALE REFERENCES FOUND" || echo "life pages clean"
python3 - <<'EOF'
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={"width":1200,"height":800})
        for f in ["life.html","life/food.html"]:
            await pg.goto("file:///Users/vuducdung/personal/henryvu27.github.io/"+f, wait_until="networkidle")
            await pg.screenshot(path=f"tools/shots/{f.replace('/','-')}.png")
            print(f, await pg.evaluate("getComputedStyle(document.body).backgroundColor"))
        await b.close()
asyncio.run(main())
EOF
```

Expected: `life pages clean`, and both pages report `rgb(31, 24, 17)` (walnut).

- [ ] **Step 3: Commit**

```bash
git add life.html life/food.html life/wine.html life/piano.html
git commit -m "Restyle the unlinked Life pages on the new tokens" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" -m "Claude-Session: https://claude.ai/code/session_01NFffw4nUcGiLCbetL6fmCd"
```

---

### Task 6: Social image, sitemap, llms files

**Files:**
- Create: `tools/render-og.html`; regenerate `assets/og-image.png` (1200 by 630)
- Modify: `sitemap.xml`, `llms.txt`, `llms-full.txt`

- [ ] **Step 1: Render the social image**

`tools/render-og.html`:

```html
<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IM+Fell+English&family=IM+Fell+English+SC&family=Crimson+Pro:ital@1&display=swap">
<style>
  body{margin:0;background:#1f1811}
  .og{position:relative;width:1200px;height:630px;overflow:hidden;background:#17120d url(../assets/scholar.jpg) center 30%/cover no-repeat}
  .og::after{content:"";position:absolute;inset:0;background:linear-gradient(to bottom,rgba(18,12,7,.25),rgba(18,12,7,.7))}
  .t{position:absolute;left:72px;bottom:64px;z-index:1;color:#f7ecd8}
  .t h1{margin:0;font:400 96px/1 "IM Fell English",serif}
  .t p{margin:14px 0 0;font:italic 34px/1.2 "Crimson Pro",serif;opacity:.92}
  .t small{display:block;margin-top:16px;font:400 20px/1 "IM Fell English SC",serif;letter-spacing:.14em;opacity:.8}
</style>
<div class="og"><div class="t"><h1>Henry Vu</h1><p>I'm exploring how to build machines that can learn.</p><small>Machine learning engineer in Dallas</small></div></div>
```

```bash
python3 - <<'EOF'
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={"width":1200,"height":630})
        await pg.goto("file:///Users/vuducdung/personal/henryvu27.github.io/tools/render-og.html", wait_until="networkidle")
        await pg.evaluate("document.fonts.ready"); await pg.wait_for_timeout(500)
        await pg.locator(".og").screenshot(path="assets/og-image.png"); await b.close()
asyncio.run(main())
EOF
python3 -c "from PIL import Image; print(Image.open('assets/og-image.png').size)"
```

Expected: `(1200, 630)`.

- [ ] **Step 2: Rewrite sitemap.xml**

Replace the `LLM_Eng_Resume.pdf` entry with `https://henryvu.io/Henry_Vu_Resume.pdf`, rename `#experience` to `#work`, and set every `lastmod` to `2026-09-07`.

- [ ] **Step 3: Rewrite llms.txt and llms-full.txt**

Rewrite `llms.txt` from the spec copy: the identity line, links, the three About paragraphs, the six timeline entries as short paragraphs, the Featured and More projects with links, and education. Remove the "Newsletter with 50,000+ readers", "AGES", "5/5 stars", and "AI researcher" claims. `llms-full.txt` is the same plus the Earlier project list and the FAQ answers from Task 2.

- [ ] **Step 4: Check**

```bash
for f in sitemap.xml llms.txt llms-full.txt index.html; do
  grep -nE "LLM_Eng_Resume|AGES|5/5|50,000|30\+|#experience|life\.html" "$f" && echo "STALE in $f"; done; echo "scan done"
python3 -c "import xml.dom.minidom as m; m.parse('sitemap.xml'); print('sitemap parses')"
```

Expected: only `scan done` and `sitemap parses`.

- [ ] **Step 5: Commit**

```bash
git add assets/og-image.png tools/render-og.html sitemap.xml llms.txt llms-full.txt
git commit -m "Regenerate social image; refresh sitemap and llms files" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" -m "Claude-Session: https://claude.ai/code/session_01NFffw4nUcGiLCbetL6fmCd"
```

---

### Task 7: Final verification

**Files:** none modified unless a check fails.

- [ ] **Step 1: Full Playwright pass**

```bash
python3 tools/check_site.py
```

Expected: `all checks passed`.

- [ ] **Step 2: Reduced-motion and system-theme paths**

```bash
python3 - <<'EOF'
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={"width":1200,"height":800}, reduced_motion="reduce")
        pg = await ctx.new_page(); await pg.goto("file:///Users/vuducdung/personal/henryvu27.github.io/index.html", wait_until="networkidle")
        print("page animation under reduced motion:", await pg.evaluate("getComputedStyle(document.querySelector('.page')).animationName"))
        await pg.click("#theme-toggle"); await pg.wait_for_timeout(200)
        print("theme after toggle:", await pg.evaluate("document.documentElement.dataset.theme"))
        await b.close()
asyncio.run(main())
EOF
```

Expected: `animationName` is `none`; theme becomes `day`.

- [ ] **Step 3: External links**

```bash
grep -oE 'href="https?://[^"]+"' index.html | sed 's/href=//; s/"//g' | sort -u | while read u; do printf "%s %s\n" "$(curl -s -o /dev/null -w '%{http_code}' -L -A 'Mozilla/5.0' --max-time 20 "$u")" "$u"; done | sort | grep -v '^200' || echo "all links 200"
```

Expected: `all links 200` (Google Fonts and gtag URLs may return 200 or 404 for HEAD-less GET on the script; anything else non-200 must be fixed).

- [ ] **Step 4: Look at the screenshots**

Open `tools/shots/night-1440.png`, `tools/shots/day-1440.png`, `tools/shots/night-390.png`. Confirm: painting edge to edge, running head legible over it, no drop cap, no Life link, fleurons render as ornaments (not tofu), the Earlier list opens, and the contact fields are ruled lines. Fix in CSS if not, re-run Step 1, and commit the fix.

- [ ] **Step 5: Report**

Leave the branch unpushed. Summarize for Henry: what changed, the two decisions that shipped as defaults, and that `git push` deploys it to GitHub Pages.
