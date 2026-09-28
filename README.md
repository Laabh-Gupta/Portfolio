# Laabh Gupta — Engineering portfolio

React + TypeScript portfolio for AI/ML, software engineering and MLOps/DevOps. An original steel LG identity leads into ArguLab, applied ML projects and professional experience at EY GDS and HAL.

[Portfolio](https://laabh-portfolio.netlify.app/) · [ArguLab](https://argulab.netlify.app/dashboard)

## Run locally

Use Node.js 22.12 or newer and npm. Run commands inside this directory, which contains `package.json` (the checkout is nested under the workspace folder).

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

Build validates TypeScript, bundles the client and server renderer, and prerenders complete HTML. Deploy **`dist` only**. No backend, API keys or environment variables are needed. `dist-ssr` is a build intermediate.

Playwright checks 320, 390, 768, 1024 and 1440px layouts, axe accessibility, keyboard navigation, mobile focus management, overflow, case-study interactions, resume downloads, metadata, direct routes and motion preferences. Enhancement tests cover delayed 3D loading, unavailable WebGL, context loss, touch-device download exclusion, actual GPU draw calls at rest, local spotlight behavior and the finite contact animation.

Tests use installed Microsoft Edge by default. For Playwright Chromium, install it with `npx playwright install chromium` and set `PLAYWRIGHT_CHANNEL=chromium`. `PLAYWRIGHT_BASE_URL` optionally targets a running production preview and disables automatic preview startup.

```powershell
$env:PLAYWRIGHT_BASE_URL = 'http://127.0.0.1:4174'
npm test
```

Format source with `npm run format`. `npm run test:ui` opens the interactive test runner.

## Deployment

Netlify configuration is included: build `npm run build`, publish `dist`, Node 22. If importing the outer workspace directory, set Netlify's base directory to `laabh-portfolio`. The existing Vercel configuration also supports the generated static routes. No server-side rendering service is required.

Home and `/projects/argulab` ship complete HTML, route-specific metadata and structured data. Legacy page URLs redirect to home sections; the old resume URL remains compatible. Unknown routes use `404.html`. Vite preview verifies the application; production redirect/status behavior is configured in `public/_redirects` and `vercel.json` and should be checked after deployment.

## Editing content and visuals

| Location                           | Purpose                                                    |
| ---------------------------------- | ---------------------------------------------------------- |
| `src/data/portfolio.ts`            | Identity, experience, projects, skills and learning        |
| `src/data/seo.ts`                  | Route metadata and structured data                         |
| `src/styles.css`                   | Brand tokens and home visual system                        |
| `src/case-study.css`               | ArguLab case-study layouts and diagrams                    |
| `src/responsive.css`               | Responsive layouts and reduced-motion rules                |
| `src/components/Identity.tsx`      | Server-rendered SVG fallback and enhancement lifecycle     |
| `src/components/identity/model.ts` | Replaceable 3D LG model factory                            |
| `src/components/identity/scene.ts` | Lazy renderer, lighting, pointer response and disposal     |
| `src/components/FlowField.tsx`     | Finite contact drawing, paused offscreen/hidden            |
| `src/components/GlowCard.tsx`      | Local pointer spotlight on selected projects               |
| `src/components/IntroLabel.tsx`    | One brief introduction resolve with stable accessible text |
| `src/pages/ProjectCaseStudy.tsx`   | Detailed ArguLab narrative and interactions                |
| `scripts/prerender.mjs`            | Build-time HTML and sharing metadata                       |
| `docs/REDESIGN.md`                 | Current design rationale, sources and verification         |
| `docs/IMPLEMENTATION.md`           | Historical pre-redesign implementation notes               |

Fonts are self-hosted Geist and Geist Mono. The graphite / steel-blue / cyan brand tokens are unchanged. Base UI provides accessible dialog and tab behavior. Motion and Lenis respect reduced motion; Lenis runs only on fine pointers. The native cursor remains available.

### 3D and performance

Three.js is the only added runtime dependency. Its separate renderer chunk loads when the hero is visible on a wide, fine-pointer display without reduced motion. Mobile, touch and reduced-motion users receive an SVG LG illustration without downloading that chunk. The same fallback remains visible during loading and after failure.

The model uses local geometry and a generated brushed-steel texture; no external models, HDRs or portrait assets are downloaded. Pixel ratio is capped at 1.5. Rendering responds to pointer movement and resize, settles at rest, and pauses offscreen or in hidden documents. Disposal releases geometry, materials, textures, the environment, listeners and the WebGL context.

To introduce a supplied face model later, replace the `createMonogram` factory with a factory returning a centered Three.js `Group` within the documented envelope. Keep camera, interaction and lifecycle code separate. The static fallback should be updated to match the supplied asset. No likeness is fabricated by this implementation.

The optional Three.js chunk exceeds Vite's 500 kB raw warning threshold. It is intentionally isolated from the main bundle; see the measured sizes and limitations in `docs/REDESIGN.md`.

## Resume and sharing card

The PDF and PNG are committed; Python is not required to run or deploy the site.

```sh
pip install reportlab pillow
python scripts/build_resume.py
python scripts/build_social.py
```

The resume script generates the current two-page PDF and its legacy filename. The social-card script uses Windows Segoe UI fonts; adapt `fontroot` on another OS. Inspect regenerated assets before publishing. If the site moves, update the canonical domain in `src/data/seo.ts`, `public/sitemap.xml`, `public/robots.txt` and `src/data/portfolio.ts`, then regenerate the social card.

Professional facts follow the supplied September 2026 brief and resumes. Full-time EY duties are not inferred; internship deliverables remain clearly attributed. DVC, Kubernetes, KServe and AWS are labeled as training/practice. ArguLab's 47 unit/integration and 21 browser checks are documented v3.0.1 project results, not portfolio test counts. The voice project's 99.75% result is identified as test-set accuracy. Product diagrams are labeled illustrations, not customer screenshots.

Unverified legacy descriptions remain in `docs/legacy-portfolio.js`, outside the published site. Git history retains the original implementation at `9f4db33`; the redesign lives on `codex/portfolio-redesign`.
