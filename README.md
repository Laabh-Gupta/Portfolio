# Laabh Gupta — Engineering portfolio

A React + TypeScript portfolio with a graphite, cream and electric-lime visual identity. A photo-derived particle portrait introduces Laabh’s AI/ML and software work. ArguLab leads the selected projects, followed by Voice Anti-Spoofing, TruthGuard and an interactive project index. Career stories cover EY GDS and HAL.

[Portfolio](https://laabh-portfolio.netlify.app/) · [ArguLab](https://argulab.netlify.app/dashboard)

## Run locally

Use Node.js 22.12 or newer from this directory:

```sh
npm ci
npm run dev
```

## Build and verification

```sh
npm run typecheck
npm run build
npm run preview
npm test
```

The production build prerenders home, `/projects/argulab` and the 404 page. Playwright uses installed Microsoft Edge by default and checks responsive layouts, keyboard navigation, accessible dialogs/tabs, project filters, deep links, resume downloads, metadata, motion preferences and axe accessibility. Set `PLAYWRIGHT_BASE_URL` to test a running preview.

## Content and design

- `src/data/portfolio.ts`: profile, career facts, projects, skills and certifications.
- `src/components/ParticlePortrait.tsx`: an interactive particle portrait with cursor tilt, local point response and a keyboard-accessible wireframe toggle. Canvas rendering settles at rest and pauses offscreen/in hidden tabs; reduced-motion users get a still portrait.
- `src/data/portrait.ts`: numeric geometry derived locally from the supplied frontal photograph, with 4,693 points and measured facial relief. No original photograph is included in runtime assets.
- `src/portfolio-refresh.css`: visual tokens, hero, navigation, skills and contact styles.
- `src/projects-refresh.css`: ArguLab flagship, supporting work and project index.
- `src/career-refresh.css`: employer details and cream About section.
- `src/pages/ProjectCaseStudy.tsx`: detailed ArguLab case study.
- `src/data/seo.ts`: route metadata and structured data.

The supplied 21st.dev references inform the glow cards, flow-field atmosphere, magnetic actions, adaptive navigation, introductory text scramble and particle effects. Native keyboard/touch behavior and reduced-motion preferences are preserved. Product artwork is labeled as illustration. No new dependencies were added.

ArguLab’s release evidence records v3.0.2 with 58 backend/integration tests, 21 browser tests and four additional release-tool tests. The case study distinguishes shipped saved-performance adaptive difficulty from the richer personalization-context rollout. The public repository contains product and engineering documentation; application source is private.

The original Three.js identity implementation and earlier design records in `docs/` remain historical references. The current portrait uses a 2D canvas with an SVG fallback and does not download a WebGL renderer or face-detection model. Depth is estimated facial relief suited to limited rotation, rather than a full-head scan.

## Resume and sharing

`public/Laabh_Gupta_Resume.pdf` is the exact supplied resume. `public/Laabh_Gupta.pdf` is a compatibility alias. Replace both files together when updating the resume. The older `scripts/build_resume.py` remains historical and should not overwrite the supplied PDF.

`scripts/build_portrait.py` can regenerate the geometry from a local photograph and locally extracted MediaPipe landmarks. The reference images, extraction model and scratch landmark files stay outside tracked assets.

`scripts/build_social.py` generates the 1200 × 630 sharing card using Pillow. Fonts and all runtime assets are local; Python is not required to run or deploy the site.

## Hosting

Netlify: build `npm run build`, publish `dist`, Node 22. If importing the outer workspace, set the base directory to `laabh-portfolio`. Vercel configuration and static redirects are also retained. `.openai/hosting.json` identifies the private Sites preview and serves the same `dist` build.

Keep the existing GitHub origin and deployment audience. Publish changes to the existing public portfolio only through the intended GitHub/hosting workflow. Never force-push or rewrite history.
