# Portfolio redesign — September 2026

## Audit and decisions

The existing repository was inspected before implementation: both READMEs, npm manifest/lockfile, all five pages, React Router configuration, shared components, the complete portfolio data file, CSS, public assets, resume and deployment rewrites. The working tree was clean. The application lives in this nested directory, not its parent.

- **Preserve:** React/Vite, npm, React Router, Netlify compatibility, personal links, substantiated EY/HAL history, Voice Anti-Spoofing and the older project repositories.
- **Upgrade:** JavaScript to typed components/data; dark palette to a consistent glass system; scattered pages to a connected narrative; accessibility, navigation, SEO, responsive design and resume.
- **Replace:** typewriter identity, repeated skill walls, emoji cards, oversized hover effects, broken resume paths, stale student/current-role wording and starter artwork. Original assets remain in git history; no stock photography or generated imagery is needed.
- **Remove from publication:** TruthGuard, Advanced RAG, Speech Sentiment, Cartoonization and Taxi Fare cards with `YOUR_REPO_LINK`. Their historical content is preserved in `docs/legacy-portfolio.js` for future verification.
- **Retain with appropriate scope:** Virtual Try-On is an experimental GAN/image pipeline (its README calls it in development, not a shipped real-time app); Parkinson's is a classification project, not a clinical diagnostic product; VXL is an academic submission portal; Payment Fraud is a classification study. Daily Journal stays secondary: its Maven manifest and controllers confirm Spring Boot, MongoDB, Spring Security, JWT and Kafka integration. VXL’s public manifest supports a TypeScript/React/Vite/Firebase interface; its displayed stack is narrowed to that evidence.
- **Do not migrate to Next.js:** this is a small content-led site. Vite build-time rendering provides indexable HTML and route-specific metadata without a new server/runtime.
- **No WebGL:** an original lightweight SVG system diagram communicates the model-to-product story without a GPU dependency.

## Information architecture

Home: identity and engineering pipeline → concise about → flagship ArguLab → Voice Anti-Spoofing → quieter selected work → EY/HAL timeline → evidence-backed skill explorer → education, learning and proof → contact.

`/projects/argulab`: dedicated shareable case study with nine modes, interactive personalization loop, accessible architecture tabs, persistence/audio/security detail, deployment and explicitly historical v3.0.1 verification counts.

Legacy `/about`, `/projects`, `/contact`, `/GetInTouch` URLs redirect to the matching home anchors. Resume paths are kept compatible. Unknown routes show a useful not-found page.

## Design system

Graphite canvas, steel-blue controls and restrained cyan details, following the user’s later request for a technical palette. Saturated violet and decorative button glow were removed. Geist display/body and Geist Mono metadata, self-hosted. Shared tokens cover surfaces, borders, typography, radii, blur, shadows, spacing, focus, success and warning. Glass is reserved for navigation, featured work, experience, skills and the final contact surface. Native scrolling on touch; Lenis enhancement on fine pointers; reduced motion supported throughout.

## Content provenance

The September 2026 user brief is the authority for identity, dates, metrics and professional history. EY descriptions remain at the supplied high level. Full-time EY responsibilities are not inferred. Kubernetes, KServe, DVC and AWS are explicitly learning/practice, not enterprise production experience.

Public repository review: https://github.com/Laabh-Gupta/Portfolio, https://github.com/Laabh-Gupta/argu-lab, https://github.com/Laabh-Gupta/mindforge-ai-debate, and the selected project links in `src/data/portfolio.ts`. The ArguLab product guide and implementation repository are labeled distinctly. No private source, credentials, or EY internal links are copied.

The refreshed resume is generated only from supplied facts. Its source is versioned in `scripts/build_resume.py`; it does not infer full-time duties or claim formal Databricks certification beyond the named learning plan.

The subsequently supplied `Raw Resume 2.docx` confirms the current full-time EY timeline and expanded ArguLab material. The older blue resume image is supplemental context; its student/data-analyst positioning and internship-only timeline do not override the newer explicit brief. Neither attachment is copied into the public site.

## Verification — 27 September 2026

- `npm run lint`, `npm run format:check`, `npm run build` and `git diff --check` pass.
- Final production Playwright run: **25 passed, 7 intentionally skipped** across four viewport projects. Skips cover desktop-only motion/scrollbar checks on touch projects and the mobile menu on desktop.
- Validated 1440, 768, 390 and 320px layouts, plus a 305px content width to account for classic Windows scrollbars. The voice card's min-content width and contact action wrapping were corrected.
- Automated WCAG 2 A/AA and 2.1 AA axe checks report no violations on the home page and ArguLab case study at all four sizes. This is an automated baseline, not a claim of comprehensive accessibility conformance.
- Verified project filtering, keyboard tabs, dialog focus/Escape, anchor navigation, case-study modes and training loop, clipboard feedback, PDF downloads, static content and metadata, direct deep links, unknown/legacy routes, and reduced-motion changes. No console/page errors in the final checked flows.
- Direct case-study loads now receive matching prerendered HTML through both clean `.html` paths and directory indexes. Anchor targets are focusable in the rendered markup, avoiding DOM mutations during hydration. Fallback HTML is not hydrated as a different route.
- Visually reviewed desktop hero and flagship work, tablet architecture, mobile hero and voice project, and the 320px training loop/contact layout in the Codex browser. Both resume PDF pages were rendered and inspected.
- Production main bundle: 153.01 kB gzip; stylesheet: 13.74 kB gzip. The case study (4.65 kB gzip) and Lenis (5.40 kB gzip) load separately. Fonts are local, and there is no video/WebGL/remote asset dependency. These are build sizes, not measured field performance scores.
- npm audit reported **0 vulnerabilities** after compatible dependency updates.
- Reviewed public repositories and validated their links. Live portfolio and ArguLab respond HTTP 200. The supplied Udemy certificate link returns HTTP 403 to automated requests, so it is preserved as supplied and its certificate destination is not independently verified.

Validation used a local production preview. Netlify/Vercel redirect and HTTP status behavior still needs the normal post-deployment smoke check on the actual hosting platform. No private EY material or attachment files are included in the site.
