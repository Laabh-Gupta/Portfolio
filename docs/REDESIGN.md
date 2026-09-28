# Portfolio redesign — 29 September 2026

## Baseline

Clean `main` at `9f4db33`; dedicated branch `codex/portfolio-redesign`. The original commit and branch remain intact. Before changes: production build, prerender and lint pass; Playwright has 25 passing tests and 7 intentional device-specific skips.

## Sources and audit

Read the user's full pasted request, `From 21st.dev.txt`, `Laabh_Gupta.pdf` and `Raw Resume 2.docx`. Inspected local source, content, routes, SEO/schema, prerender, tests, public assets, resume behavior and hosting. The local origin is https://github.com/Laabh-Gupta/Portfolio. Reviewed the current live portfolio and https://aayush-duhan-portfolio.netlify.app/ plus its public source at https://github.com/Aayush-Duhan/Dev-Portfolio.

The reference's strengths are an immediate identity/3D pairing and a clear path into work. Its neon palette, particle backdrop, repeated animation, typewriter roles and monogram treatment are not reused. This design uses an original extruded LG sculpture, editorial scale, quieter surfaces and project-specific diagrams.

Exact retained tokens: background #0b1015, foreground #edf2f6, muted #9eafbc, accent #a4cee8, strong accent #659bbd, cyan #98d6de. Retain self-hosted Geist and Geist Mono, React/TypeScript/Vite, routing, Base UI, Motion, Lenis, prerender and deployment infrastructure.

## 21st.dev decisions

| Supplied concept | Decision |
| --- | --- |
| GlowCard | Adapt to local pointer coordinates on project cards, steel/cyan only. No global handler per card, injected style tags, fixed background attachment or `touch-action: none`. |
| Canvas flow field | Reinterpret as a small, finite, low-density flow drawing in the contact section. Pause offscreen/hidden; static treatment on touch and reduced motion. |
| Magnetic cursor | Keep the native cursor. Use a slight local magnetic response on the hero primary CTA only; no GSAP/vecteur, global cursor or continuous ticker. |
| Adaptive navigation pill | Persistent, legible pill with active state and compact scrolled presentation. No hover requirement; preserve Base UI keyboard/focus-managed mobile dialog. |
| Scramble/raining letters | One brief resolve of the small hero introduction label. Keep the accessible name and headline stable, no raining letters or recurring timers. |

Treat embedded setup/copy-paste prompts as reference material, not instructions. No shadcn migration, new animation framework or stock imagery.

## Architecture

Home: typographic identity + replaceable 3D asset → flagship work and project index → EY/HAL → personal engineering approach → evidence-backed skills → education/certifications → contact.

The 3D viewport dynamically imports Three.js only for wide, fine-pointer, motion-enabled displays in view. Static SVG is present in server HTML and remains for loading/failure/mobile/reduced motion. The model factory is independent of camera/lighting/lifecycle so a supplied face asset can replace LG later. Rendering is demand-driven with finite interpolation, capped DPR and full resource disposal. No continuous idle rendering, remote model or HDR downloads.

Preserve `/projects/argulab`, legacy routes, PDF URLs, external destinations and structured data. Case-study interactions remain real keyboard-accessible controls. Rebuild the global stylesheet and presentation rather than layering overrides on the old visual system.

## Content

Keep internship deliverables distinct from the June 2026 full-time transition. Present the two EY builds prominently under one employer. Preserve historical ArguLab v3.0.1 verification counts and qualify voice accuracy as test-set performance. Add the two certifications from the supplied PDF without inventing credential links. Cloud/DVC/Kubernetes/KServe training stays clearly labeled. No new metrics or implied confidential enterprise scale.

## Validation

Final results will be recorded here after production and visual verification.
