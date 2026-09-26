# Laabh Gupta — Engineering portfolio

React + TypeScript portfolio for AI/ML, software engineering and MLOps/DevOps. ArguLab is the flagship case study, supported by applied ML projects and professional experience at EY GDS and HAL.

[Portfolio](https://laabh-portfolio.netlify.app/) · [ArguLab](https://argulab.netlify.app/dashboard)

## Run locally

Use Node.js 22.12 or newer and npm. Run commands **inside this directory**, which contains `package.json` (the checkout is nested under the workspace folder).

```sh
npm ci
npm run dev
```

## Production and checks

```sh
npm run lint
npm run build
npm run preview
npm test
```

Build runs TypeScript validation, a client bundle, a temporary server-render bundle, and static rendering. Deploy **`dist` only**. No backend, API keys or environment variables are needed. `dist-ssr` is a build intermediate.

Playwright exercises desktop (1440px), tablet (768px), mobile (390px) and small mobile (320px), with axe accessibility checks, keyboard navigation, responsive overflow, case study interactions, resume downloads, metadata, direct routes, console errors and motion preferences. Tests use installed Microsoft Edge by default. For Playwright Chromium, install it with `npx playwright install chromium` and set `PLAYWRIGHT_CHANNEL=chromium`. `PLAYWRIGHT_BASE_URL` optionally targets an already running production preview and disables automatic preview startup.

Example in PowerShell with a preview already running on port 4174:

```powershell
$env:PLAYWRIGHT_BASE_URL = 'http://127.0.0.1:4174'
npm test
```

Format source with `npm run format`; check formatting with `npm run format:check`.

## Deployment

Netlify configuration is included: build `npm run build`, publish `dist`, Node 22. If importing the outer workspace directory, set Netlify's base directory to `laabh-portfolio`. The existing Vercel configuration also supports the generated static routes. This repository does not require a server-side rendering service.

The home page and `/projects/argulab` ship complete HTML, route-specific metadata and structured data. Legacy page URLs redirect to home sections; the old resume URL remains compatible. Unknown routes use `404.html`. Vite preview verifies the app; production redirect/status behavior is configured in `public/_redirects` and `vercel.json` and should be checked after deployment.

## Editing content and visuals

| Location                            | Purpose                                                |
| ----------------------------------- | ------------------------------------------------------ |
| `src/data/portfolio.ts`             | Identity, experience, projects, skills and learning    |
| `src/data/seo.ts`                   | Shared route metadata and structured data              |
| `src/styles.css`                    | Graphite / steel-blue glass system and breakpoints     |
| `src/components/`                   | Reusable navigation, sections and interactive diagrams |
| `src/pages/ProjectCaseStudy.tsx`    | Detailed ArguLab narrative                             |
| `scripts/prerender.mjs`             | Build-time HTML and sharing metadata                   |
| `public/sitemap.xml` / `robots.txt` | Search discovery                                       |
| `docs/IMPLEMENTATION.md`            | Audit, content provenance and decisions                |

Fonts are self-hosted Geist and Geist Mono. Motion respects reduced-motion settings; Lenis only runs on fine pointers without reduced motion. Base UI supplies accessible dialog and tab behavior. The custom system and workflow illustrations are SVG/HTML/CSS, with no WebGL, remote imagery or generated artwork.

Update the canonical domain in `src/data/seo.ts`, `public/sitemap.xml`, `public/robots.txt` and `src/data/portfolio.ts` if the site moves. Regenerate the social card as well.

## Resume and sharing card

The generated PDF and PNG are committed; Python is **not** required to run or deploy the site.

```sh
pip install reportlab pillow
python scripts/build_resume.py
python scripts/build_social.py
```

The resume script generates the current two-page PDF and its legacy filename. The social-card script uses Windows Segoe UI fonts; adapt `fontroot` when generating on another OS. Inspect regenerated assets before publishing.

Professional facts follow the supplied September 2026 brief and resume. Full-time EY duties are not inferred; internship work stays high-level. DVC, Kubernetes, KServe and AWS are labeled as training/practice. ArguLab's 47 unit/integration and 21 browser checks are **documented v3.0.1 project results**, not portfolio test counts. The voice project's 99.75% metric is identified as test-set accuracy.

Unverified legacy project descriptions are preserved in `docs/legacy-portfolio.js`, outside the published site. Repository history retains the original implementation.
