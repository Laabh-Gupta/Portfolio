# Laabh Gupta — Engineering portfolio

A React + TypeScript portfolio with a graphite, cream and electric-lime visual identity. An interactive geometric 3D head, built from all seven supplied reference photographs, introduces Laabh’s AI/ML and software work. ArguLab leads the selected projects, followed by Voice Anti-Spoofing, TruthGuard and an interactive project index. Career stories cover EY GDS and HAL.

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
- `src/components/ParticlePortrait.tsx`: the universal 3D identity component, with Wireframe, Solid and Points views, pointer/drag/keyboard rotation, a one-pass scan and links into the portfolio. Canvas rendering settles at rest and pauses offscreen/in hidden tabs; reduced-motion users get a still view.
- `src/components/identity/raster.ts`: perspective projection, backface culling, depth-sorted triangle surfaces and directional lighting shared by the canvas rendering and geometric SVG fallback.
- `src/data/identity.ts`: 906 vertices, 1,796 triangles and 136 facial feature edges. All seven references contribute to the same pose-aligned face geometry; no photograph, pixel luminance, image mask or texture is embedded.
- `src/portfolio-refresh.css`: visual tokens, hero, navigation, skills and contact styles.
- `src/projects-refresh.css`: ArguLab flagship, supporting work and project index.
- `src/career-refresh.css`: employer details and cream About section.
- `src/pages/ProjectCaseStudy.tsx`: detailed ArguLab case study.
- `src/data/seo.ts`: route metadata and structured data.

The supplied 21st.dev references inform the glow cards, flow-field atmosphere, magnetic actions, adaptive navigation, introductory text scramble and particle effects. Native keyboard/touch behavior and reduced-motion preferences are preserved. Product artwork is labeled as illustration. No new dependencies were added.

ArguLab’s release evidence records v3.0.2 with 58 backend/integration tests, 21 browser tests and four additional release-tool tests. The case study distinguishes shipped saved-performance adaptive difficulty from the richer personalization-context rollout. The public repository contains product and engineering documentation; application source is private.

The current head is three-dimensional geometry rendered with a 2D canvas and an SVG fallback; it does not download a WebGL renderer or face-detection model. Its front facial structure aggregates 478 detected landmarks per reference. Fourteen iterations of robust generalized similarity Procrustes alignment normalize capture pose and scale around stable eye, nose and cheek anchors, with expression weighting around the mouth. Every reference contributes to the final face. The posterior cranium, ears, neck and eye/mouth closure are inferred geometry, so this is an interpreted identity study rather than a photogrammetric head scan. `identityMetadata` records reference contributions, alignment error, procedural parts and topology checks.

The original Three.js identity implementation, the earlier single-photo `src/data/portrait.ts` / `scripts/build_portrait.py` pipeline and design records in `docs/` remain historical references. The current hero and sharing card use `identity.ts`.

## Resume and sharing

`public/Laabh_Gupta_Resume.pdf` is the exact supplied resume. `public/Laabh_Gupta.pdf` is a compatibility alias. Replace both files together when updating the resume. The older `scripts/build_resume.py` remains historical and should not overwrite the supplied PDF.

`scripts/build_identity.py` reproducibly builds the shared geometry from a scratch landmark JSON file. It requires Python and NumPy; the source photographs and locally extracted landmark JSON are intentionally untracked. The default input is `tmp/identity-landmarks.json`, which must contain all seven `images` entries (`photo1` through `photo7`) and the detector’s `connections`. Each image entry supplies `width`, `height`, 478 normalized `landmarks` (`x`, `y`, `z`) and `matrices[0].data` (a 16-value capture-pose matrix). Connections contain the tessellation and named facial edge groups as `{start, end}` pairs. The script reads these measurements without loading image pixels.

```sh
python scripts/build_identity.py --input tmp/identity-landmarks.json --out src/data/identity.ts --report output/identity-normalization.json
python scripts/build_social.py
```

The geometry report includes all-seven contribution weights and mesh audits: four closed components, no boundary or non-manifold edges, consistent outward winding and no unused vertices. Keep the original photographs, extraction model and scratch measurements outside tracked assets.

`scripts/build_social.py` generates the 1200 × 630 sharing card directly from `identity.ts` using Pillow, geometric projection and a surface depth buffer. It renders silver triangular facets with lime facial features without reading the original photographs or the historical single-photo portrait. It uses local Segoe UI or DejaVu Sans fonts. Python is not required to run or deploy the site.

## Hosting

Netlify: build `npm run build`, publish `dist`, Node 22. If importing the outer workspace, set the base directory to `laabh-portfolio`. Vercel configuration and static redirects are also retained. `.openai/hosting.json` identifies the private Sites preview and serves the same `dist` build.

Keep the existing GitHub origin and deployment audience. Publish changes to the existing public portfolio only through the intended GitHub/hosting workflow. Never force-push or rewrite history.
