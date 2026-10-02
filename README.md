# Laabh Gupta — Engineering portfolio

A monochrome React + TypeScript portfolio for AI/ML, software engineering, and MLOps/DevOps. An original silver LG sculpture leads into ArguLab, applied ML projects, and professional experience at EY GDS and HAL.

[Portfolio](https://laabh-portfolio.netlify.app/) · [ArguLab](https://argulab.netlify.app/dashboard)

## Run locally

Use Node.js 22.12 or newer and npm. Run these commands in the directory containing `package.json`:

```sh
npm ci
npm run dev
```

## Production and checks

```sh
npm run typecheck
npm run lint
npm run format:check
npm run build
npm run preview
npm test
```

Build validates TypeScript, bundles the client and server renderer, and prerenders complete HTML. Deploy **`dist` only**. No backend, API keys, or environment variables are required. `dist-ssr` is a build intermediate.

Playwright checks 320, 390, 768, 1024, and 1440px layouts, axe accessibility, keyboard navigation, mobile focus management, overflow, case-study interactions, resume downloads, metadata, direct routes, and motion preferences. Tests also cover the project gallery, product walkthrough, lifecycle map, compact navigation, magnetic actions, 3D loading/failure/context loss, touch-device download exclusion, actual GPU draw calls at rest, spotlight behavior, and the finite contact animation.

Tests use installed Microsoft Edge by default. For Playwright Chromium, install it with `npx playwright install chromium` and set `PLAYWRIGHT_CHANNEL=chromium`. `PLAYWRIGHT_BASE_URL` can target an existing preview instead of starting one:

```powershell
$env:PLAYWRIGHT_BASE_URL = 'http://127.0.0.1:4174'
npm test
```

Use `npm run format` to format source, or `npm run test:ui` for the interactive test runner.

## Deployment and delivery

Netlify configuration remains: build `npm run build`, publish `dist`, Node 22. If importing the outer workspace directory, set the base directory to `laabh-portfolio`. Existing Vercel configuration also supports the static routes.

Home and `/projects/argulab` ship complete HTML, route-specific metadata, and structured data. Legacy page URLs redirect to home sections; the old resume URL remains compatible. Unknown routes use `404.html`. Hosting redirect/status behavior is configured in `public/_redirects` and `vercel.json`; production behavior must be checked after deployment.

Development uses `codex/portfolio-redesign`, with verified pushes and a pull request targeting `main`. A feature-branch push alone does not update `main` or confirm a production deployment. Do not force-push or rewrite the original history.

## Editing content and visuals

| Location                            | Purpose                                                            |
| ----------------------------------- | ------------------------------------------------------------------ |
| `src/data/portfolio.ts`             | Identity, experience, project facts, links, skills, and training   |
| `src/data/seo.ts`                   | Route metadata and structured data                                 |
| `src/styles.css`                    | Monochrome tokens, hero, navigation, shared controls, motion gates |
| `src/sections.css`                  | Career, voice project, about, skills, proof, and contact layouts   |
| `src/projects.css`                  | Flagship walkthrough and interactive project gallery               |
| `src/case-study.css`                | ArguLab narrative, diagrams, and route-specific responsive rules   |
| `src/responsive.css`                | Shared responsive compositions                                     |
| `src/components/Identity.tsx`       | SVG fallback, loading state, and enhancement lifecycle             |
| `src/components/identity/model.ts`  | Swappable, original extruded LG model factory                      |
| `src/components/identity/scene.ts`  | Lazy renderer, studio lighting, interaction, and disposal          |
| `src/components/ProjectGallery.tsx` | Filtered project index with focus/touch previews                   |
| `src/components/ProjectArtwork.tsx` | Original SVG concept illustrations                                 |
| `src/components/ArgulabPreview.tsx` | Practice / review / memory workflow explorer                       |
| `src/components/FlowField.tsx`      | Finite, pointer-responsive monochrome vector field                 |
| `src/components/GlowCard.tsx`       | Surface light, masked rim, and outside bloom                       |
| `src/components/MagneticCursor.tsx` | Settling target morph and contrast inversion                       |
| `src/components/IntroLabel.tsx`     | One finite scramble with stable accessible text                    |
| `src/pages/ProjectCaseStudy.tsx`    | Detailed ArguLab narrative and interactions                        |
| `scripts/prerender.mjs`             | Build-time HTML and sharing metadata                               |
| `docs/MONOCHROME_REDESIGN.md`       | Current research, design decisions, and verification               |
| `docs/REDESIGN.md`                  | Historical September steel-blue redesign record                    |
| `docs/IMPLEMENTATION.md`            | Earlier implementation record                                      |

Self-hosted Geist and Geist Mono sit on a near-black, charcoal, and off-white system. The paper-colored career chapter provides contrast. Base UI supplies dialog and tab semantics. Focus and touch expose the same project information as pointer hover. Illustrations are labeled and do not represent product screenshots or measured model outputs.

No dependencies were added for the monochrome rebuild. React, Three.js, Base UI, Motion, Lenis, and the existing test/build tooling are reused. Motion preferences are honored; Lenis runs only on fine pointers. The native pointer remains everywhere except the opted-in magnetic action itself, and text selection remains native.

### 3D and performance

The separate Three.js renderer chunk loads only when the hero is visible on a wide, fine-pointer display without reduced motion. Mobile, touch, and reduced-motion users receive a complete SVG sculpture without downloading the renderer. The same fallback remains visible during loading and after failure.

Custom beveled geometry uses metallic materials and four procedural studio softboxes; no external models, portraits, HDRs, or textures are downloaded. Pixel ratio is capped at 1.5. The renderer responds to input/resize and stops at rest, offscreen, or in a hidden document. Cleanup releases GPU resources, observers, listeners, and the context.

To use a supplied face model later, replace the `createMonogram` factory with a centered Three.js `Group` within the documented 4.5 × 3 unit envelope. Update the matching static fallback. Keep interaction and lifecycle code separate; do not fabricate a person's likeness.

The optional renderer exceeds Vite's 500 kB raw chunk warning threshold. It remains outside the initial bundle and is skipped on touch/reduced-motion devices. Contact particles stop after a finite burst and pause offscreen/hidden; cursor animation settles when the pointer stops. No continuous background render loop is required.

## Resume and sharing card

The PDF and PNG are committed. Python is not required to run or deploy the site.

```sh
pip install reportlab pillow
python scripts/build_resume.py
python scripts/build_social.py
```

The resume script produces the existing two-page PDF and legacy filename. The social-card generator uses Windows Segoe UI fonts; adapt `fontroot` on another OS. Inspect regenerated assets before publishing. If the domain changes, update `src/data/seo.ts`, `public/sitemap.xml`, `public/robots.txt`, and `src/data/portfolio.ts`, then regenerate the card.

Professional facts follow the supplied brief and resumes. Full-time EY duties are not inferred; internship work remains attributed to the internship. DVC, Kubernetes, KServe, and AWS are labeled as training/practice. ArguLab's 47 unit/integration and 21 browser checks refer to its documented v3.0.1 release, not this portfolio. Voice accuracy remains explicitly test-set performance. HAL's approximately 25% result retains its documented scope.

Unverified legacy descriptions remain in `docs/legacy-portfolio.js`, outside the published site. Git history preserves the original implementation at `9f4db33`.
