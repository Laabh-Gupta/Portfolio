# Visual polish — 3 October 2026

This pass keeps the monochrome portfolio, original LG, ArguLab story, and existing engineering foundation. The user's explicit delivery instruction is `main`; PR #1 had already merged the redesign before this pass began.

## Browser audit and research

Before edits, the production home, project index, experience, about, skills, contact, and ArguLab route were inspected in the browser. The hero had three competing focal points, several decorative labels, and repeated metadata. Skills presented the same journey as a lifecycle control, category tabs, and a final pipeline caption. Contact's most useful visual quality was its faint curved particle trails behind clear typography.

References were revisited directly, using Brave for the authenticated 21st session. Research informed reduction and proportions, not additional components.

| Reference                                                                                                      | Observation and decision                                                                                                                                                                                  |
| -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Portfolio Hero](https://21st.dev/@waleedkibhen/components/portfolio-hero)                                     | A large name owns the composition. Keep that confidence; give Laabh's name the first position instead of placing another headline above it. No borrowed portrait, lime, or additional entrance animation. |
| [Paper-shader portfolio hero](https://21st.dev/@moazamtrade/components/portfolio-hero-with-paper-shaders)      | Spare identity and career information balance a dominant right visual. Use the space and hierarchy; omit the magenta shader and its extra renderer.                                                       |
| [Path Drawing Portfolio Hero](https://21st.dev/@httpsdesign-layercomja/components/path-drawing-portfolio-hero) | A single typographic signature receives generous negative space. Its colored drawing animation would add competition here, so it is a composition reference only.                                         |
| [3D Adaptive Navigation](https://21st.dev/@rhllom/components/3d-adaptive-navigation-bar)                       | Inspected collapsed and expanded states. Preserve the compact interaction and keyboard support, with a thinner dark surface and smaller initial footprint.                                                |
| [Spotlight Card](https://21st.dev/@jahed/components/spotlight-card)                                            | Pointer-local border and surface falloff supply material depth. Preserve the layered interaction, lower the bloom and surface brightness, and keep the resting grid quiet.                                |
| [Project Showcase](https://21st.dev/@jatin-yadav05/components/project-showcase)                                | Fine rules and quiet secondary text make a supporting work index feel editorial. Preserve the existing accessible gallery and give the flagship more breathing room.                                      |
| [Magnetic Cursor](https://21st.dev/@jahed/components/magnetic-cursor)                                          | Cursor morphing is most useful at deliberate targets. Keep the existing limited CTA enhancement and its touch/reduced-motion exclusions.                                                                  |
| [Text Scramble](https://21st.dev/@ibelick/components/text-scramble)                                            | A finite text effect can be elegant alone, but the hero no longer needs an animated eyebrow in addition to the giant name. Remove that presentation.                                                      |
| [Origin UI arrow button](https://21st.dev/@originui/components/button/button-with-animated-arrow)              | Found through a purpose-specific minimal-button catalogue search. Small typography, restrained radius, and one directional cue suffice. Existing CTAs already support this; no new dependency.            |
| [Flow Field Background](https://21st.dev/@jahed/components/flow-field-background)                              | Inspected the live controls, curved trails, and full unlocked component source. The same sine/cosine field and friction-based movement underpin the shared atmosphere.                                    |
| [Linear](https://linear.app/)                                                                                  | Desktop and 390px views: a clear type-led introduction, long pauses, and slightly raised product surfaces. Apply a smaller type scale and more separation between chapters.                               |
| [Geist materials](https://vercel.com/geist/materials)                                                          | Subtle stroke, fill, radius, and shadow differences distinguish surfaces without large decorative gradients. Use quieter navigation and skill selection surfaces.                                         |
| [Aayush Duhan](https://aayush-duhan-portfolio.netlify.app/)                                                    | Revisited the identity-and-3D relationship. Preserve personal sculptural identity, while retaining Laabh's grayscale language and removing surrounding technical labels.                                  |

Full component source is gated by 21st's account quota. The flow-field source was available through the logged-in account and inspected; other references were inspected through their live previews and available usage code, with the previously supplied source file retained as the implementation reference. Copy-prompt access was attempted; no paid upgrade or access bypass was used. Responsive browser inspection was supplemented by the portfolio's own explicit Playwright viewport matrix.

## Final changes

- Name-first hero on the shared 1280px grid; clear role group, two-line positioning, primary action, and quiet EY/social metadata.
- Removed the extra headline, eyebrow, sculpture coordinates, sculpture caption, and scroll label. Mobile uses a deliberate stacked name and smaller LG.
- Refined the real 3D resting angle, studio reflection, and graphite side material. The renderer remains lazy, fine-pointer-only, and demand-driven; the SVG remains the touch/reduced-motion/failure presentation.
- Lighter navigation surface, quieter project glow, more flagship padding and separation from supporting work, and more space between chapters.
- One skill-family explorer retains all factual evidence and training qualifications. Removed duplicate lifecycle/pipeline presentations and decorative icon framing.
- Original routing, data, resume, SEO, structured data, prerendering, and hosting configuration retained.
- Explicit LF text checkout policy prevents Windows checkout line endings from failing the existing formatting check.

## Shared atmosphere

`FlowField.tsx` mounts once in the application shell. It reuses the contact vector field, with profiles for hero, projects, experience, about, skills, learning, contact, and case studies. Profiles vary opacity, density, scale, and field origin. Transparent trail decay and exclusion blending allow the same canvas to sit above both the dark canvas and the experience chapter's paper surface, below the content.

The canvas is viewport-sized with a 1.5 DPR cap and at most 380 particles. It draws at no more than 25fps in finite bursts, then stops. Pointer movement can wake a short burst. Hidden documents pause. Mobile and reduced-motion users receive a precomposed still with at most 90 particles. Route changes reuse the same canvas. Resize, mutation, pointer, visibility, and scroll listeners are cleaned up on unmount. No extra shader or rendering package was added.

## Verification and evidence

- Production build, TypeScript, ESLint, and Prettier pass.
- Full Playwright suite: **45 passed, 37 intentional device/matrix skips**. Existing WCAG axe, keyboard/focus, route, metadata, resume, project, case-study, reduced-motion, WebGL failure/context-loss, and idle GPU checks remain green.
- Added viewport evidence at **1366×768, 1440×900, 1920×1080, 768×1024, 390×844, 375×812, and 320×740**. Existing tests cover 1024px and narrow desktop hydration as well.
- New atmosphere check verifies one canvas across routes, section changes, idle pixel stability, and a visible still under reduced motion.
- Browser inspection prompted a second lighting pass after the initial screenshots. All six affected visual-effect checks passed again against the final build.
- Screenshots: [desktop](screenshots/hero-desktop.png), [mobile](screenshots/hero-mobile.png), [full page](screenshots/portfolio-desktop.png), and [viewport/section evidence](screenshots/polish/).

The optional Three.js scene still exceeds Vite's 500kB advisory threshold (565kB raw, 143kB gzip); it is separately loaded and excluded on touch/reduced-motion devices. No physical iOS device was used. Final delivery state is verified against GitHub and the hosted production site after push.
