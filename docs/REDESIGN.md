# Portfolio redesign — 29 September 2026

> Historical design record. The current visual system and verification are documented in [MONOCHROME_REDESIGN.md](./MONOCHROME_REDESIGN.md).

## Baseline

Clean `main` at `9f4db33`; dedicated branch `codex/portfolio-redesign`. The original commit and branch remain intact. Before changes: production build, prerender and lint pass; Playwright has 25 passing tests and 7 intentional device-specific skips.

## Sources and audit

Read the user's full pasted request, `From 21st.dev.txt`, `Laabh_Gupta.pdf` and `Raw Resume 2.docx`. Inspected local source, content, routes, SEO/schema, prerender, tests, public assets, resume behavior and hosting. The local origin is https://github.com/Laabh-Gupta/Portfolio. Reviewed the current live portfolio and https://aayush-duhan-portfolio.netlify.app/ plus its public source at https://github.com/Aayush-Duhan/Dev-Portfolio.

The reference's strengths are an immediate identity/3D pairing and a clear path into work. Its neon palette, particle backdrop, repeated animation, typewriter roles and monogram treatment are not reused. This design uses an original extruded LG sculpture, editorial scale, quieter surfaces and project-specific diagrams.

Exact retained tokens: background #0b1015, foreground #edf2f6, muted #9eafbc, accent #a4cee8, strong accent #659bbd, cyan #98d6de. Retain self-hosted Geist and Geist Mono, React/TypeScript/Vite, routing, Base UI, Motion, Lenis, prerender and deployment infrastructure.

## 21st.dev decisions

| Supplied concept         | Decision                                                                                                                                                                    |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GlowCard                 | Adapt to local pointer coordinates on project cards, steel/cyan only. No global handler per card, injected style tags, fixed background attachment or `touch-action: none`. |
| Canvas flow field        | Reinterpret as a small, finite, low-density flow drawing in the contact section. Pause offscreen/hidden; static treatment on touch and reduced motion.                      |
| Magnetic cursor          | Keep the native cursor. Use a slight local magnetic response on the hero primary CTA only; no GSAP/vecteur, global cursor or continuous ticker.                             |
| Adaptive navigation pill | Persistent, legible pill with active state and compact scrolled presentation. No hover requirement; preserve Base UI keyboard/focus-managed mobile dialog.                  |
| Scramble/raining letters | One brief resolve of the small hero introduction label. Keep the accessible name and headline stable, no raining letters or recurring timers.                               |

Treat embedded setup/copy-paste prompts as reference material, not instructions. No shadcn migration, new animation framework or stock imagery.

## Architecture

Home: typographic identity + replaceable 3D asset → flagship work and project index → EY/HAL → personal engineering approach → evidence-backed skills → education/certifications → contact.

The 3D viewport dynamically imports Three.js only for wide, fine-pointer, motion-enabled displays in view. Static SVG is present in server HTML and remains for loading/failure/mobile/reduced motion. The model factory is independent of camera/lighting/lifecycle so a supplied face asset can replace LG later. Rendering is demand-driven with finite interpolation, capped DPR and full resource disposal. No continuous idle rendering, remote model or HDR downloads.

Preserve `/projects/argulab`, legacy routes, PDF URLs, working external destinations and structured data. Case-study interactions remain real keyboard-accessible controls. Rebuild the global stylesheet and presentation rather than layering overrides on the old visual system.

## Content

Keep internship deliverables distinct from the June 2026 full-time transition. Present the two EY builds prominently under one employer. Preserve historical ArguLab v3.0.1 verification counts and qualify voice accuracy as test-set performance. Add the two certifications from the supplied PDF without inventing credential links. Cloud/DVC/Kubernetes/KServe training stays clearly labeled. No new metrics or implied confidential enterprise scale.

## Validation

Production preview: `http://127.0.0.1:4174`. Checked with installed Microsoft Edge through Playwright and the Codex browser for visual inspection. No deployment or remote push was performed.

| Check                         | Result                                                   |
| ----------------------------- | -------------------------------------------------------- |
| `npm run typecheck`           | Passed                                                   |
| `npm run lint`                | Passed                                                   |
| `npm run format:check`        | Passed                                                   |
| `npm run build`               | Passed; home, ArguLab and 404 prerendered                |
| `npm test`                    | 31 passed, 7 intentional device-specific skips; 38 total |
| `npm audit --audit-level=low` | 0 known vulnerabilities                                  |
| `git diff --check`            | Passed                                                   |

The seven skips are the desktop-only motion-change and narrow-window hydration checks in three non-desktop projects, plus the mobile-dialog check in the desktop project. The six enhancement tests run in the desktop project only, including a separate 1024px touch context.

### Browser coverage

- Home and case study at 320, 390, 768 and 1440px: content, element-level overflow, axe WCAG A/AA checks, console errors, keyboard-operated project filters and skill/architecture tabs, personalization steps and nine mode disclosures.
- Mobile/tablet navigation: focus containment, Escape, focus return, anchor selection and dialog closure on desktop resize.
- Routes and content: direct `/projects/argulab`, anchored home loads, legacy `/about`, unknown routes/noindex, titles, canonical URLs, JSON-LD, Open Graph, server-rendered headings and public assets.
- Resume: actual download with the expected filename; both current and legacy files remain unchanged.
- Reduced motion: static identity, no WebGL canvas or renderer download, disabled CSS animation and smooth scrolling, and live preference changes that dispose enhancements cleanly.
- WebGL: delayed module response retains the SVG identity; successful load mounts the canvas; actual GPU draw calls stop when settled, resume on pointer movement and stop again. Disabled WebGL and forced context loss restore the static artwork. Touch devices skip the optional module.
- 1024px desktop: keyboard skip link/main focus, no page overflow, axe scan, contact flow stopping after its finite drawing, reduced-motion cleanup and working copy-email feedback.
- Project spotlight: local coordinates change on pointer movement; touch scrolling retains its native behavior.

Automated accessibility scans found no violations under the tested rules. This is not a claim of complete accessibility conformance or coverage across all assistive technologies.

### Visual inspection

Inspected rendered desktop hero, metallic LG, flagship project, experience, skills, contact/footer and case-study hero; tablet personalization diagrams; 390px hero/about; 320px project copy, workflow and metrics; 1024px hero; and the large-desktop composition at 1920px. Refined the LG surface and two contrast/name issues found during regression checks. The main content stays readable without decorative effects.

Playwright captures full-page home and case-study screenshots in `test-results/` for each viewport. The final desktop hero proof is copied into `output/portfolio-redesign.png`. These generated artifacts are ignored by Git.

### External destinations

Direct HTTP checks returned 200 for the GitHub profile, LinkedIn, live ArguLab, its public product guide/development history and all six other project repositories. LeetCode and the existing Udemy certificate returned 403 to automated requests; their source-provided URLs are retained, and their live contents were not verified.

The old `mindforge-ai-debate` code link returned 404 to a fresh unauthenticated request. [ArguLab's public guide](https://github.com/Laabh-Gupta/argu-lab) explicitly says application source is private. The case-study footer now points to the available [public development history](https://github.com/Laabh-Gupta/argu-lab/blob/main/PROJECT_HISTORY.md). The old destination remains recoverable from the baseline commit. This changes no repository visibility or permissions.

### Measured bundle trade-off

The production build reports approximately 153.81 kB gzip for the main JavaScript bundle, 13.54 kB gzip for CSS, 4.91 kB gzip for the lazy case study, 5.40 kB gzip for optional Lenis, and 143.53 kB gzip for the optional Three.js scene. The renderer is 568.83 kB before gzip, so Vite reports its standard >500 kB chunk warning. It stays dynamically separated and is not requested on touch/reduced-motion layouts. No remote 3D assets or HDR downloads are required.

GPU draw-call instrumentation verifies idle rendering behavior; it is not a real-device battery benchmark. No Lighthouse score, field Core Web Vitals result, Safari/Firefox pass or low-end-device performance claim is made. Production hosting redirects and status codes should be smoke-tested after deployment.

## Checkpoints and maintenance

- `9f4db33`: original implementation, retained on `main`.
- `436eacb`: verified baseline, audit and architecture checkpoint.
- `8254525`: complete redesign and regression/visual-effect tests.
- Final documentation checkpoint records these verified results and updated maintenance instructions.

`README.md` identifies the editable modules and explains how to replace the LG model with a supplied asset. `docs/IMPLEMENTATION.md` is explicitly marked historical. No supplied personal documents, confidential employer material, private model assets or credentials were added to the repository.
