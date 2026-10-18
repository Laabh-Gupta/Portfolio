# Laabh Gupta — Engineering portfolio

A React + TypeScript portfolio with a graphite, cream and electric-lime visual identity. A personal illustrated avatar floats in the hero, then shrinks into a corner as visitors scroll through Laabh’s AI/ML and software work. ArguLab leads the selected projects, followed by Voice Anti-Spoofing, TruthGuard and an interactive project index. Career stories cover EY GDS and HAL.

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
- `src/components/FloatingAvatar.tsx`: stable hero slot and one travelling visual in a body portal. Measured scroll positions shrink the avatar into a top-right badge; its Back to top button clears stale route fragments and restores heading focus.
- `src/avatar.css`: floating animation, hero glow, corner badge and reduced-motion styling. Motion pauses in hidden tabs, and the avatar is hidden/inert while a dialog is open.
- `public/images/laabh-avatar.png`: transparent personal cartoon illustration generated with the built-in image-generation tool, using selected supplied photos as identity references. The original photographs are untracked.
- `src/portfolio-refresh.css`: visual tokens, hero, navigation, skills and contact styles.
- `src/projects-refresh.css`: ArguLab flagship, supporting work and project index.
- `src/career-refresh.css`: employer details and cream About section.
- `src/pages/ProjectCaseStudy.tsx`: detailed ArguLab case study.
- `src/data/seo.ts`: route metadata and structured data.

The supplied 21st.dev references inform the glow cards, flow-field atmosphere, magnetic actions, adaptive navigation, introductory text scramble and particle effects. Native keyboard/touch behavior and reduced-motion preferences are preserved. Product artwork is labeled as illustration. No new dependencies were added.

ArguLab’s release evidence records v3.0.2 with 58 backend/integration tests, 21 browser tests and four additional release-tool tests. The case study distinguishes shipped saved-performance adaptive difficulty from the richer personalization-context rollout. The public repository contains product and engineering documentation; application source is private.

The current hero loads an illustrated PNG; it does not download a WebGL renderer or face-detection model. CSS handles the gentle float, while passive scroll events schedule one animation frame to update translation and scale. The hero slot remains reserved to prevent layout jumps. Reduced-motion preferences disable floating and replace the travel with an immediate position change.

The Three.js, single-photo `portrait.ts` and seven-reference `identity.ts` geometry experiments remain historical references, together with their build scripts and design records in `docs/`. They are not imported by the current hero.

## Resume and sharing

`public/Laabh_Gupta_Resume.pdf` is the exact supplied resume. `public/Laabh_Gupta.pdf` is a compatibility alias. Replace both files together when updating the resume. The older `scripts/build_resume.py` remains historical and should not overwrite the supplied PDF.

The historical `scripts/build_identity.py` builds the earlier geometry from a scratch landmark JSON file using Python and NumPy. That input has seven `images` entries (`photo1` through `photo7`) and detector `connections`; each image supplies dimensions, 478 normalized xyz landmarks and a capture-pose matrix. Source photos and scratch measurements remain untracked. This pipeline does not generate the current illustrated avatar.

```sh
python scripts/build_identity.py --input tmp/identity-landmarks.json --out src/data/identity.ts --report output/identity-normalization.json
python scripts/build_social.py
```

The geometry report includes all-seven contribution weights and mesh audits: four closed components, no boundary or non-manifold edges, consistent outward winding and no unused vertices. Keep the original photographs, extraction model and scratch measurements outside tracked assets.

`scripts/build_social.py` generates the 1200 × 630 sharing card directly from `identity.ts` using Pillow, geometric projection and a surface depth buffer. It renders silver triangular facets with lime facial features without reading the original photographs or the historical single-photo portrait. It uses local Segoe UI or DejaVu Sans fonts. Python is not required to run or deploy the site.

## Hosting

Netlify: build `npm run build`, publish `dist`, Node 22. If importing the outer workspace, set the base directory to `laabh-portfolio`. Vercel configuration and static redirects are also retained. `.openai/hosting.json` identifies the private Sites preview and serves the same `dist` build.

Keep the existing GitHub origin and deployment audience. Publish changes to the existing public portfolio only through the intended GitHub/hosting workflow. Never force-push or rewrite history.
