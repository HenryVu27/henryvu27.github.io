# Lamplight Redesign, Design Spec

Date: 2026-09-07
Status: approved 2026-09-07 with two corrections (enrolled through Summer 2027; the portfolio is the complete record, the resume is the space-limited one)
Mockup: https://claude.ai/code/artifact/9226cb6d-7f36-4d6f-ac57-d12293697731 (Direction B, revised)

## 1. Goal

Push henryvu.io from "clean and minimalist" to a page that feels like a quiet reading room at lamplight: warm, safe, unhurried, slightly medieval, still clean. Bring the main site into the same visual world as henryvu.blog (which already uses a scholar painting, a serif, and fleurons), and refresh the content so it matches the September 2026 resume.

Henry chose Direction B ("Lamplight") from three mocked directions and asked for three edits: the painting should run edge to edge and take up the page, the first letter of the About text should be plain (no drop cap), and the Life section should come out until there is content for it.

## 2. Decisions already made

| Decision | Choice |
|---|---|
| Direction | B, Lamplight |
| Hero | Full-bleed painting, roughly 85 percent of the viewport tall, title block bottom-left, running head over the image |
| Drop caps | None |
| Life section | Removed from nav and home page. Files `life.html` and `life/*.html` stay in the repo, unlinked, restyled through the shared tokens so they do not rot |
| Ornament | One fleuron (U+2767) between sections, small caps for labels and the running head, a manicule (U+261E) on "Get in touch". Nothing else |
| Cards, pills, badges | Gone. Projects become a ruled catalogue |
| Scroll reveals, typing animation, bouncing chevron, hide-on-scroll header | Gone |
| Font Awesome | Dropped. Social links become text in small caps; the theme toggle becomes the word "Night" or "Day" |

## 3. Content principle and settled decisions

**The resume is space-limited; the portfolio is the complete record.** Where the resume omits something real, the site keeps it. Where the resume is newer and more accurate (titles, the eXRealityAI story, the ThorMed numbers), the site adopts it and adds the rest.

1. **Default theme.** Night (walnut). Day (vellum) is one click away and persists in localStorage.
2. **Enrollment.** Henry is enrolled in the M.Sc. at UT Dallas through Summer 2027 on a lighter course load. The site says so, and the structured data keeps the student affiliation alongside the job title.
3. **Teaching roles.** Both stay: UT Dallas (Jan 2025 to now) and University of Alberta (Sep 2023 to May 2024).
4. **Amii and SODALab.** Two entries, as on the current site: Amii (Apr 2022 to May 2023) and SODALab with Dr. Xiaoqi Tan (Dec 2023 to May 2024).
5. **Edge inference work.** Stays. The eXRealityAI entry carries both the resume's knowledge-graph, retrieval, evaluation, and GardenXR story and the earlier voice RAG on Jetson Orin, the XR workflows, and the retrieval pipeline work.
6. **The typing joke ("sentient sand").** Retired; the subtitle is the static line "I'm exploring how to build machines that can learn."
7. **GardenXR figure.** "Twenty thousand people used it in the first two days" (two sources agree). The "5/5 stars, one rating" claim is removed.
8. **Projects.** Nothing is dropped. Three tiers: Featured and More in the catalogue, Earlier collapsed behind one control.
9. **StitchKit.** No GitHub remote yet, so it is listed without a link. Feature it once it is pushed.
10. **DatDai repo name.** The remote is `HenryVu27/Urban`; link to it as is (GitHub redirects after a rename).
11. **OEM name.** "An OEM pilot", matching the current resume.
12. **Blog index.** Out of scope for this pass. A follow-up should give it the same running head, small caps, and dinkus.

## 4. Visual system

### Tokens

Every color on the site comes from these variables. Night is the default; day is `[data-theme="day"]` on `html`. The current theme names (`morning-fog`, `piano-symphony`) are retired; the localStorage key is migrated on first load.

Night (walnut, lamplight, gold leaf):

```
--bg #1f1811   --card #28201a   --raised #342a21
--ink #f1e4cd  --text #d9cbb2   --text-2 #b3a48b   --muted #a09280
--rule #3d3227 --border #857462
--accent #dc7d55 (burnt sienna)   --gold #d2a85a   --link #d2a85a
--selection #4b3719
```

Day (vellum and iron-gall ink):

```
--bg #f3ebda   --card #ebe0c9   --raised #faf5ea
--ink #2a2118  --text #3f3428   --text-2 #6b5b48   --muted #6e5e48
--rule #d8cbb0 --border #8a7858
--accent #7f2a1e (madder)   --gold #7a5c14   --link #7f2a1e
--selection #ecd2b1
```

All body-text pairs pass WCAG AA with margin (night text on page 11.0:1, day text on page 10.2:1; muted 5.8:1 and 5.3:1). Links pass at 7.9:1 in both.

### Type

- Display: IM Fell English (400, italic 400) for h1 and h2. Never below 28px.
- Text: Crimson Pro (400, 500, 600, italic 400), 19.5px body on desktop, 18px under 600px, line-height 1.55.
- Small caps: IM Fell English SC for the running head, year column, tags, the colophon. Letter-spacing 0.1em.
- Ornaments: a 2.5 KB EB Garamond glyph subset for U+2767 and U+261E, loaded from Google Fonts with the `text=` parameter, because the standard hosted subsets drop those codepoints.
- All loaded from fonts.googleapis.com with `display=swap` and preconnect. `font-synthesis: none` so no fake bold or italic.
- Scale: h1 clamp(50px, 7vw, 72px); h2 36px; h3 (entry titles) 1.05em at weight 500; small caps 15px; tags 14px.
- Measure: text blocks capped at 62ch; the page column is 880px wide.

### Layout

Single page, single column, anchors for About, Work, Projects, Contact. The running head is static (not fixed), sits over the painting at the top, and repeats nothing lower on the page; the colophon carries the same links at the bottom.

```
+------------------------------------------------------------+
| HENRY VU                     ABOUT  WORK  PROJECTS  CONTACT  NIGHT |
|                                                              |
|            [ painting, full width, ~85svh ]                  |
|                                                              |
|   Henry Vu                                                   |
|   I'm exploring how to build machines that can learn.        |
|   MACHINE LEARNING ENGINEER IN DALLAS                        |
|   ABOUT ME   ☞ GET IN TOUCH                                  |
+------------------------------------------------------------+
|   About                          (62ch prose, 3 paragraphs)  |
|                          ❧                                   |
|   Where I've worked              (year column + entry rows)  |
|                          ❧                                   |
|   Projects                       (2-col ruled catalogue)     |
|   Earlier work                   (collapsed one-line list)   |
|                          ❧                                   |
|   Get in touch                   (ruled fields, Send)        |
|                                                              |
|   SET IN IM FELL ENGLISH AND CRIMSON PRO                     |
|   GITHUB   LINKEDIN   X   BLOG                               |
+------------------------------------------------------------+
```

Responsive: under 760px the work rows stack (year above title), the catalogue is one column, the hero drops to 70svh with a 520px minimum, and the running head wraps.

### Atmosphere

- Paper grain: a 240px SVG `feTurbulence` tile on a fixed `body::before` layer under the content, `soft-light` at 0.09 in night and `multiply` at 0.055 in day. Off under 480px and under `prefers-reduced-transparency`, `prefers-reduced-data`, and `print`.
- Lamplight: in night, a fixed `body::after` with two radial gradients (warm tint top-left, walnut falloff) behind everything. Cards keep flat tokens on top of it.
- Hero overlay: a gradient from 30 percent dark at the top to 62 percent dark at the bottom, so the cream title reads over any part of the painting. In night the last 12 percent dissolves into `--bg`; in day the hero ends on a hairline rule instead.
- Shadows: none, except the contact form's Send button on hover (a warm, tinted, two-layer shadow).

### Motion

- One page-load fade on `main` (opacity 0 to 1 plus a 6px rise, 450ms, ease-out), CSS animation only, so content is visible without JavaScript.
- Theme toggle: `document.startViewTransition` crossfade (280ms) when available; plain swap otherwise.
- Cross-page navigation (to the Life pages or 404): `@view-transition { navigation: auto }` as a progressive enhancement.
- Hover: link underline darkens (150ms). Nothing else moves.
- `prefers-reduced-motion`: page-load fade and view transitions off; color transitions stay.

## 5. Page content

All copy below is final unless an open decision in section 3 changes it. Voice: plain, first person, contractions, no stacked metrics, no em dashes.

### Hero

- h1: Henry Vu
- Subtitle (italic): I'm exploring how to build machines that can learn.
- Line (small caps): Machine learning engineer in Dallas
- Links (small caps): About me, ☞ Get in touch

### About

Hey, I'm Henry. I'm the founding machine learning engineer at [eXRealityAI](https://exreality.ai/) in Dallas, where I've been the first engineer since 2025, and I'm finishing my M.Sc. in Computer Science at UT Dallas, expected Summer 2027. Before that I did my B.Sc. Honors in Computing Science at the University of Alberta.

At eXReality I build the parts of an AI product that decide whether it can be trusted: the knowledge graph behind a Meta Quest 3 repair app for an automotive pilot, the retrieval layer that finds the right procedure for a technician's question, and the evaluation harness that scores it in CI. I also work on inference at the edge, running voice and vision models locally on NVIDIA Jetson and Apple silicon, and I shipped [GardenXR](https://www.meta.com/experiences/gardenxr/24200709416226235/) to the Meta Horizon Store. On the research side, I work with [Dr. Katherine Brown](https://be.utdallas.edu/people/faculty/katherine-brown/) at UT Dallas on NIH-funded ultrasound segmentation, getting models small and robust enough to run on portable hardware.

I got into this through math competitions. The tricks were fun, but what stuck was learning to take a messy problem and find the angle that cracks it. That led me to research at [Amii](https://www.amii.ca/) on online algorithms and bandits, and over time toward the gap between theory and things that actually run. I write about that at [henryvu.blog](https://www.henryvu.blog/).

[My resume](Henry_Vu_Resume.pdf)

### Where I've worked

Each entry: year in the small-caps column, title with the organization in italic, the date range in small caps under the title, then two to four plain sentences as a list with the small dot marker. Year markers: 2025, 2024, 2023, 2022.

**2025. Founding Machine Learning Engineer at eXRealityAI. Aug 2025 to now.**
- Built the knowledge graph and retrieval layer behind a Meta Quest 3 automotive repair app for an OEM pilot, and the evaluation harness that scores it in CI. On an expert-written test set it puts the correct procedure first 92 percent of the time.
- Built a voice-to-voice assistant that runs entirely on an NVIDIA Jetson Orin: Whisper for speech in, hybrid BM25 and FAISS retrieval, a quantized Mistral 7B, and Kokoro for speech out.
- Multimodal XR workflows on Gemini, YOLOv9, and Wit.ai voice input across two applications, and a retrieval pipeline (EmbeddingGemma, cross-encoder reranking, query rewriting) that cut retrieval work by roughly half.
- Shipped GardenXR to the Meta Horizon Store, traced a run of bad production answers to a vendor proxy that was silently dropping images, and mentored the team on LLM integration.

**2025. Computer Vision Engineer at ThorMed Innovation. Feb 2025 to now.**
- Modeling lead on an NIH-funded project to segment the bladder in clinical ultrasound, so patients can be monitored without a catheter.
- Pretrained U-Net and SimSiam encoders on 9.2K ultrasound images before fine-tuning, reaching 96 percent Dice.
- Got the model onto portable hardware with 4-bit quantization, where the domain-pretrained weights held up about seven times better than ImageNet weights, and built the pipeline that extracts and cleans frames from clinical ultrasound video.

**2025. Teaching Assistant at UT Dallas. Jan 2025 to now.**
- Algorithms and data structures: weekly office hours, seminar and exam material, and technical reviews for more than a hundred students.

**2024. Undergraduate Research Assistant at SODALab. Dec 2023 to May 2024.**
- A theoretical and empirical survey of multi-armed bandits across stochastic, adversarial, Markovian, and restless settings, with Dr. Xiaoqi Tan.
- Simulations comparing UCB, Exp3, Thompson sampling, and the Gittins index.

**2023. Teaching Assistant at the University of Alberta. Sep 2023 to May 2024.**
- Algorithms and data structures for a few hundred students: office hours, weekly problem-solving sessions, and grading.

**2022. Undergraduate Researcher, Online Learning, at Amii. Apr 2022 to May 2023.**
- Online optimization with the primal-dual framework: conversion, knapsack, and bipartite matching problems where decisions are made before all the input arrives.
- Algorithms that use machine-learned predictions to beat worst-case bounds when the predictions are good, without losing the guarantees when they are not.

### Projects

Three tiers. Featured and More render in the two-column catalogue; Earlier is a collapsed one-line list behind a "Show earlier work" control. The four category filter tabs are removed.

**Featured**

- **DatDai.** A question-answering assistant over Vietnamese land law, live on Cloud Run. Every answer cites the exact article and clause, an amendment graph pulls in the decrees that later changed a clause, and a citation verifier checks each cited article against what was actually retrieved, with no extra model call. Tags: Python, Gemini, Qdrant, Langfuse, Cloud Run. Link: github.com/HenryVu27/Urban
- **ADHD Coaching Agent.** A coaching chatbot for parents of children with ADHD: a LangGraph ReAct agent between two guardrail gates, hybrid retrieval with a local cross-encoder reranker, four-tier memory, and an evaluation package with LLM judges and pairwise comparisons. Tags: Python, LangGraph, Qdrant, ONNX. Link: github.com/HenryVu27/ADHDAgent
- **GardenXR.** A mixed-reality gardening app for Meta Quest, published on the Meta Horizon Store after passing review for restricted camera access. Twenty thousand people used it in the first two days. Tags: Unity, C#, Gemini. Link: Meta Horizon Store page.
- **Ultrasound Bladder Segmentation.** NIH-funded work with UT Dallas Bioengineering: self-supervised pretraining on 9.2K ultrasound images, then 4-bit quantization for portable devices, with a paper on making the models small and robust. Tags: PyTorch, SimSiam, U-Net. Links: github.com/HenryVu27/ThorMed and the paper PDF.
- **ML Interview Practice.** LeetCode-style practice for ML coding interviews that runs entirely in the browser: real CPython with numpy through Pyodide, no backend, no build step. Built in eight days before an interview and used for real. Tags: JavaScript, Pyodide, CodeMirror. Links: henryvu.io/MLInterviewPractice and github.com/HenryVu27/MLInterviewPractice
- **Agentic Framework for Suspect Detection.** Multi-agent pipeline using LangGraph and Gemini for automated suspect identification from surveillance data. Tags: Python, LangGraph, Gemini, FAISS. Link: github.com/HenryVu27/Suspect-Detection

**More**

- **StitchKit.** Turns a client's logo into a machine-ready embroidery stitch file for a one-person shop whose only computer is an older iPhone: phone-first, entirely in Vietnamese, with preflight checks because a bad file perforates leather for good. Tags: Python, FastAPI, Ink/Stitch, Swift. No link yet.
- **VoiceBridge.** Real-time Vietnamese-to-Russian speech translation over push-to-talk, a two-day proof of concept for a director who needed to talk across a language barrier. Tags: FastAPI, Deepgram, DeepL. Link: github.com/HenryVu27/voice-agent
- **EEG Decoding: a Multi-Modal Approach.** Existing card text. Link unchanged.
- **Modeling Political Sarcasm.** Existing card text. Link unchanged.
- **Multi-armed Bandits and Online Learning.** Survey, simulations, and seminar slides from the Amii and SODALab work. Link: github.com/HenryVu27/Multi-armed-Bandits-and-Online-Learning
- **Polyps and Breast Ultrasound Segmentation.** Existing card text. Link unchanged.
- **A Survey of Geometric Set Cover.** Existing card text. Links unchanged.

**Earlier (collapsed behind "Show earlier work")**

One line each, existing text and links, newest first: ViT and Contrastive Representation Learning; VAE and Diffusion for FashionMNIST; Yahoo's News Recommendation with MABs; TFT Rolling Odds Calculator; Online Algorithms seminar slides; BTS Concert Ticket Buying Simulator; Valentine Surprise; This Web Portfolio; UManitoba Navigator; HabiTrak; Toronto Neighbourhoods Data Analysis; Gomoku Solver; Sudoku Solver; Edmonton Restaurant Finder; Encrypted Arduino Communication; Huffman Coding.

Nothing is dropped.

### Get in touch

Note: I read every message. Drop me a line and I'll get back to you soon.
Fields: Subject, Email, Message. Button: Send. Same Web3Forms endpoint and access key, same client-side validation, same status messages. Fields are ruled (bottom border only) on the page, no card.

### Colophon

Set in IM Fell English and Crimson Pro.
GitHub, LinkedIn, X, Blog.

## 6. Head, SEO, structured data

- `<title>`: Henry Vu, Machine Learning Engineer in Dallas
- Meta description and og/twitter descriptions: "Henry Vu is the founding machine learning engineer at eXRealityAI in Dallas and an M.Sc. student at UT Dallas. Knowledge graphs, retrieval and evaluation for a Meta Quest repair app; voice and vision models at the edge; GardenXR on the Meta Horizon Store; NIH-funded ultrasound segmentation."
- JSON-LD Person: `jobTitle` "Founding Machine Learning Engineer"; `worksFor` eXRealityAI, ThorMed Innovation, and UT Dallas (teaching assistant); `affiliation` UT Dallas (M.Sc. student, expected 2027); `alumniOf` University of Alberta only; `hasOccupation` rewritten to match the timeline. Remove `aggregateRating`, the "5/5 stars" FAQ answer, "30+ technical projects", "Alberta Graduate Excellence Scholarship", and every "AI researcher" or "graduate student" claim. Keep the FAQ block but rewrite each answer from the copy above.
- `theme-color`: `#1f1811`.
- `og:image`: regenerate `assets/og-image.png` from the new hero (painting, name in IM Fell English) at 1200 by 630.
- `sitemap.xml` and `llms.txt`: drop the Life URLs, refresh the summary text. `llms-full.txt` regenerated from the new copy.

## 7. Files

| File | Change |
|---|---|
| `index.html` | Rewrite body; update head per section 6 |
| `styles.css` | Rewrite from scratch on the token system (expect roughly 600 lines, down from 1535) |
| `script.js` | Rewrite: theme toggle with view transition, smooth anchor scroll, contact form, "Show earlier work". Expect roughly 120 lines, down from 429 |
| `life.html`, `life/food.html`, `life/wine.html`, `life/piano.html` | Keep. Swap head links to the new fonts, remove Font Awesome, update nav to the four items, keep class names so the shared stylesheet styles them |
| `404.html` | Restyle with the tokens |
| `assets/scholar.jpg`, `assets/scholar-1200.jpg` | New hero image. Source a higher-resolution public-domain file of the same painting from Wikimedia Commons; if none is found, use the blog's `OG1.jpg` (1000px) and accept softness on large screens |
| `assets/og-image.png` | Regenerated |
| `Henry_Vu_Resume.pdf` | Copy of `~/personal/Resume_FDE.pdf`. Fixes the dead `LLM_Eng_Resume.pdf` link |
| `sitemap.xml`, `llms.txt`, `llms-full.txt` | Updated |
| `banner.html`, `equations.txt`, `assets/CBA Emailer Assets/`, `assets/Logo.png`, `assets/Header.png` | Untouched (unrelated leftovers; flag for a later cleanup) |

No build step, no dependencies, no framework. Plain HTML, CSS, JavaScript, as today.

## 8. Verification

- Playwright screenshots of `index.html` at 390, 820, and 1440px wide, both themes, saved for review; no horizontal scroll at any width.
- `document.fonts` reports IM Fell English, IM Fell English SC, Crimson Pro loaded; the fleuron and manicule render from the glyph subset, not a system fallback.
- Every external link answers 200 (curl HEAD), including the Store page, the paper PDF, the repos, and the resume.
- Contact form: client-side validation paths exercised; a real submission is left to Henry.
- Theme persists across reload and across navigation to the Life pages.
- `prefers-reduced-motion` and `prefers-color-scheme` paths checked in Playwright with emulated media.
- HTML passes a validator with no errors.
- Life pages and 404 open and are readable in both themes.

## 9. Out of scope

- The blog (henryvu.blog) beyond nothing changing there. Follow-up: give the blog index the running head, small caps, and dinkus.
- New Life content.
- Self-hosting fonts. Crimson Pro's old-style figures and discretionary ligatures would need a self-hosted subset; not worth it for this pass.
- The Samsung interview, ML Interview Practice, or any other project repo.
