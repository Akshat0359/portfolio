# Akshat — Portfolio

A complete professional portfolio website for an AI/ML Engineer.

## Structure

```
portfolio/
├── index.html              ← Home / Landing page
├── projects.html           ← All 6 project cards
├── about.html              ← About page
├── resume.html             ← Résumé (inline + PDF download)
├── contact.html            ← Contact page
├── case-ai-research.html   ← Case study: AI Research Analyst MCP-A2A

├── case-lending.html       ← Case study: Digital Lending Platform (C#/.NET)
├── case-anomaly.html       ← Case study: Network Anomaly Detector
├── case-devops.html        ← Case study: Cloud DevOps Platform
├── case-stock.html         ← Case study: Stock Broker Dashboard
├── css/
│   ├── base.css            ← Design tokens, resets, shared components
│   ├── home.css            ← Home page specific styles
│   └── pages.css           ← Inner pages: projects, about, resume, contact
├── js/
│   └── main.js             ← Navigation, scroll reveal, tilt, animations
└── assets/
    ├── portrait.png        ← Professional headshot
    └── Resume.pdf          ← Downloadable résumé PDF
```

## [NEEDS INPUT] Checklist

Before going live, fill in:

1. **`assets/portrait.png`** — Professional headshot (loaded correctly)
2. **`assets/Resume.pdf`** — Downloadable résumé PDF (loaded correctly)
3. All content is already filled with real information from your background

## Design System

- **Background:** `#080c10` (deep dark)
- **Accent:** `#4f9eff` (blue) + `#7c5cfc` (purple)
- **Typography:** Inter (sans) + JetBrains Mono (code)
- **Fonts loaded:** Google Fonts CDN

## Animations

- Scroll reveal: `.reveal-up` / `.reveal-right` — add these classes to trigger
- Tilt effect: `.tilt-card` — add to any card for 3D hover tilt
- All animations respect `prefers-reduced-motion`

## Editing Content

All content is in the HTML files themselves. To update:

- **Profile info:** Edit `index.html` (hero section) and `about.html`
- **Projects:** Edit `projects.html` cards and individual `case-*.html` files
- **Resume:** Edit `resume.html` inline content
- **Contact:** Edit `contact.html` — already has real email/GitHub/LinkedIn

## Deployment

Works as a static site — no server needed. Deploy to:
- GitHub Pages
- Netlify (drag and drop the folder)
- Vercel (connect GitHub repo)
- Any static host
