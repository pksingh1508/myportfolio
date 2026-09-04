<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Portfolio project operating brief

This document is required context for every agent working in this repository. Read it completely before editing files. Then read `plan.md` for the product/design source of truth and `implementation.md` for the ordered build sequence.

## Mission

Build a simple, beautiful, animation-rich personal portfolio that presents the owner's strongest work with clarity and demonstrates advanced front-end craft through GSAP, Three.js, WebGPU, and progressive enhancement.

The experience is called **Orbital Archive** internally. Its memorable visual is an original spatial archive of project frames orbiting a central monolith. The archive begins in the hero, transforms through the selected-work story, and resolves into the personal mark near the contact finale. The rest of the page remains calm, typographic, and evidence-led.

This is not a clone of SpaceFS. The reference contributes principles—white-space discipline, typographic scale, a fixed restrained header, media transforming through pinned scroll, and a dramatic dark chapter. Do not reuse Space branding, Finder compositions, copy, photography, or exact layouts.

## Source-of-truth order

When instructions conflict, use this order:

1. The current user request.
2. This repository's required Next.js block at the top of this file and the current local Next.js 16 documentation.
3. `plan.md` for design, experience, architecture, accessibility, and performance intent.
4. `implementation.md` for sequencing and exit gates.
5. The relevant `.agents/skills/*/SKILL.md` and its required references.
6. Existing code conventions, once they have been intentionally established.

Do not silently change the product direction. If a request requires a meaningful divergence, update the source documents or clearly report the decision.

## Current repository state

- Framework: Next.js `16.3.4` App Router.
- UI runtime: React and React DOM `19.2.8`.
- Language: TypeScript in strict/no-emit mode.
- Styling: Tailwind CSS v4 plus global CSS.
- Package manager: pnpm `10.33.0`.
- Current application: create-next-app starter in `src/app`.
- Planned but not yet installed: `gsap`, `@gsap/react`, and `three`.

Never assume APIs or conventions from older Next.js releases. Before modifying framework code, read the relevant guide under `node_modules/next/dist/docs/` as required by the generated block above.

## Non-negotiable product requirements

- The first viewport must communicate the owner's name, role, specialization, and availability quickly.
- Selected work is the center of the experience. Visual effects must reveal evidence rather than obscure it.
- Personal/project claims must come from approved content. Never invent clients, employment, metrics, testimonials, education, awards, or links.
- Core content and links must work without JavaScript, WebGPU, hover, precise scrolling, or animation.
- Mobile, reduced motion, keyboard access, and renderer fallback are part of the feature, not end-stage polish.
- The page must remain responsive and readable at `360×800`, `390×844`, `768×1024`, `1280×720`, `1440×900`, and short laptop viewports.
- Every implementation step must build cleanly before the next step starts.

## Planned information architecture

Homepage order:

1. Fixed global navigation and skip link.
2. Identity hero with the Orbital Archive.
3. Quiet credibility/current-focus strip.
4. Selected-work dark scrollytelling chapter.
5. Capabilities / “How I build.”
6. About and working principles.
7. Experience timeline.
8. Experiments/playground when enough real material exists.
9. Contact finale and footer.

Project detail pages live at `/work/[slug]` and include context, constraints, contribution, approach, implementation, outcome, reflection, media, adjacent project navigation, and a contact action.

If a section lacks real content, hide it or mark it as incomplete in development. Do not manufacture content to preserve a layout.

## Visual system

### Palette

- Paper: `#F7F8FC`
- White: `#FFFFFF`
- Ink/night: `#090A0C`
- Graphite: `#6F737B`
- Hairline: `#DDE1E8`
- Signal violet: `#635BFF`
- Signal soft: `#B9B6FF`
- Raised night surface: `#15171B`

Signal violet is scarce. Use it for focus, active progress, live status, and the 3D emissive edge—not for broad gradients or arbitrary decoration.

### Typography

- Intended primary family: Instrument Sans through the current `next/font` API.
- Intended technical family: IBM Plex Mono.
- If a font is unavailable in the installed framework, select a deliberate open-source substitute and document it.
- Use fluid display sizes, tight headline leading, readable body leading, and maximum text line lengths around `60–72ch`.
- Use sentence case. Avoid repeated tracked uppercase eyebrows, decorative monospace, and single-word color/italic headline accents.

### Layout and shape

- Use a twelve-column desktop, six-column tablet, and four-column mobile mental grid.
- Main shell is approximately `min(100% - 2rem, 90rem)` with responsive gutters.
- Keep text left-aligned except for the final contact statement.
- Use large vertical rhythm and quiet hairline dividers.
- Pills are controls, not decorative containers. Project media frames may use `16–24px` radii. Do not apply one radius to everything.
- Avoid generic SaaS feature-card grids, decorative blobs, noisy gradients, excessive badges, and empty visual chrome.

## Architecture rules

### Next.js and React

- `src/app/page.tsx`, layouts, route pages, metadata, and primary content are Server Components by default.
- Add `"use client"` only at leaf interaction boundaries. Planned client islands include the mobile header interaction, hero intro, project scrollytelling controller, and Three.js scene.
- Pass small serializable props into client islands. Do not move the whole page to the client for animation convenience.
- Lazy-load Three.js and noncritical media. Reserve stable dimensions for every deferred visual.
- Use `next/image` for content images and `next/font` for font delivery.
- Generate project routes and metadata from typed static content for v1.

### Proposed code ownership

```text
src/app/             routes, layouts, global styles, metadata
src/components/ui/   small reusable accessible primitives
src/components/layout/ navigation/footer/shell structure
src/components/sections/ semantic homepage and case-study sections
src/components/motion/ client animation controllers and GSAP scopes
src/components/three/ renderer, scene graph, materials, poses, fallback
src/content/         verified profile and project data
src/lib/             shared motion/quality utilities with clear ownership
src/types/           portfolio content types
public/              optimized images, posters, models, textures, video, résumé
```

Avoid vague dumping grounds such as a giant `utils.ts`, `animations.ts`, or all-purpose client wrapper. A component owns its local animation unless multiple components genuinely share the behavior.

## Animation ownership and rules

Use one animation owner per property at a time.

- CSS owns frequent interaction states: hover, focus, press, color changes, menu icon, and simple disclosures.
- GSAP owns orchestrated timelines such as the hero entrance.
- ScrollTrigger owns the selected-work pinned sequence and its progress mapping.
- Three.js owns ambient scene motion and rendering.
- GSAP may animate named camera/group pose values for narrative transitions; the renderer consumes those values.
- Do not add Motion/framer-motion to v1 unless a new requirement specifically needs its layout/presence/spring model. Never install legacy `framer-motion`; the current package would be `motion`.

Rules:

- Essential content starts visible in server-rendered HTML.
- Animate DOM `transform` and `opacity`; do not animate `width`, `height`, `top`, or `left` for routine motion.
- Never use `transition: all`.
- Hero intro runs once and does not wait for scroll.
- Triggered reveals run once. Limit them to two to four meaningful moments outside the project sequence.
- Scrubbed motion uses scroll as the clock and `ease: "none"`. Do not add a duration/ease to scrubbed values.
- Do not combine `scrub` and `toggleActions` on one ScrollTrigger.
- Pin wrappers and animate children. Create triggers in document order and refresh after layout-affecting media/font changes.
- Never hijack native scroll, rewrite wheel deltas, or convert each wheel event into a slide.
- Gate hover motion behind `(hover: hover) and (pointer: fine)`.
- Reduced-motion mode removes hero assembly, ambient orbit, parallax, camera moves, and pinning while preserving state feedback.
- Clean up every GSAP context, ScrollTrigger, observer, listener, and timeline on unmount.

## Three.js/WebGPU contract

Use raw Three.js for the planned scene. The repository's `react-three-fiber` skill targets `@json-render/react-three-fiber` and is not the default architecture for this project.

### Scene

```text
Scene
├── PerspectiveCamera
├── ArchiveRoot
│   ├── CoreMonolith
│   ├── ProjectFrame[]
│   ├── OrbitLines
│   └── optional instanced dust
├── KeyLight
├── FillLight
└── RimLight
```

### Renderer

- Use `WebGPURenderer` from `three/webgpu` with `setAnimationLoop()`.
- The official renderer currently targets WebGPU and falls back to a WebGL 2 backend. Still provide a static poster if initialization fails.
- Use node/TSL-compatible materials on the WebGPURenderer path. Do not introduce legacy `ShaderMaterial`, `onBeforeCompile`, or `EffectComposer` without first verifying current renderer support.
- Dynamically import the 3D leaf component with SSR disabled.
- Keep the canvas supplementary to semantic HTML.

### Performance

- Cap device pixel ratio at `2` desktop and `1–1.5` mobile.
- Reuse geometries/materials and instance repeated particles.
- Prefer procedural geometry in v1; introduce GLB only if it materially improves the visual.
- Avoid shadows by default. Limit lights and costly transparent/transmission materials.
- Pause when off-screen or `document.hidden`.
- Dispose the animation loop, renderer, geometry, material, texture, observer, and event resources on unmount.
- Development targets: `<50` mobile draw calls, `<100` desktop draw calls, and `<100k` visible mobile triangles.
- Profile first. Adjust particles, material quality, pixel ratio, and texture size based on measurements.

## Accessibility and fallback contract

- Include a skip link and semantic `header`, `nav`, `main`, `section`, `article`, and `footer` landmarks.
- Preserve a logical heading order and one meaningful `h1` per page.
- All controls need visible focus, accessible names, correct state attributes, and practical `44px` touch targets.
- Mobile menu must support keyboard focus, escape dismissal, outside dismissal where appropriate, and focus return.
- Canvas must be marked decorative/supplementary as appropriate; duplicate all project identity and links in HTML.
- Do not encode active state by color alone.
- Respect `prefers-reduced-motion` in CSS, GSAP media contexts, ScrollTrigger setup, and Three.js loop behavior.
- Keep content visible if JavaScript, images, WebGPU, WebGL, or animation initialization fails.
- Never add autoplay audio. Video must be muted/inline when autoplaying, have a poster, and remain user-controllable.

## Content policy

- Canonical personal data lives in `src/content/profile.ts`.
- Canonical project data lives in `src/content/projects.ts`.
- Components render content; they do not own or duplicate professional facts.
- Missing data is omitted, not guessed.
- Every media record has intrinsic dimensions and meaningful alt text or an explicit decorative flag.
- External links use descriptive text. “Click here” is not acceptable.

## Skill routing

Skills are stored in `.agents/skills`. Read the complete relevant `SKILL.md` and any reference it marks as required before implementing that area.

| Work type | Required skill(s) | Notes |
| --- | --- | --- |
| Visual direction, typography, palette, composition | `frontend-design` | Use before creating or substantially reshaping a section. Self-critique against generic AI portfolio patterns. |
| UI transitions, menus, feedback, easing, timing | `ui-animation` | Use its decision framework first; CSS is the default for frequent interactions. |
| Scroll reveals, parallax, sticky story | `scroll-animations` | Use the gate; do not animate every section or hijack scroll. |
| GSAP pin/scrub/progress orchestration | `gsap-scrolltrigger` | Register once, scope/clean up in React, pin wrappers, use linear scroll mapping. |
| Scene/camera/renderer/lifecycle | `threejs-fundamentals` | Required when changing core scene setup or transforms. |
| WebGPU, materials, renderer integration, profiling | `threejs-webgl` | Read its optimization/material references for quality or performance changes. |
| Procedural/object/pose animation | `threejs-animation` | Use frame delta, named poses, and pause off-screen work. |
| Authored SVG logo/path animation | `svg-animations` | Use only if the personal mark is actually SVG-based. |
| Motion library layouts/gestures | `motion` | Not planned for v1; use only after documenting why CSS/GSAP cannot own the interaction. |
| JSON-driven R3F scene | `react-three-fiber` | Not planned; it is relevant only if the project explicitly adopts `@json-render/react-three-fiber`. |

Do not load every skill reflexively. Load the skill that owns the current decision so its rules remain specific and testable.

## Required work sequence

Follow `implementation.md` in order. The condensed sequence is:

1. Confirm real content.
2. Prove a clean Next.js baseline.
3. Add typed content and routes.
4. Establish design tokens and typography.
5. Finish the static responsive page.
6. Add accessible interaction states.
7. Establish and test GSAP cleanup.
8. Add the hero intro.
9. Prototype and profile Three.js/WebGPU in isolation.
10. Refine and integrate the archive.
11. Enhance selected work with ScrollTrigger.
12. Add only the remaining high-value motion.
13. Complete case studies and metadata.
14. Audit accessibility/fallbacks.
15. Profile performance.
16. Complete multi-browser visual QA.

An agent must not use future animation/3D work to compensate for an unfinished static page.

## Verification expectations

At the end of every step:

- Run `pnpm run build`.
- Inspect the diff and preserve unrelated user changes.
- Check for TypeScript errors, hydration warnings, browser console errors, and broken routes.
- Verify the changed area at mobile and desktop widths.

When motion changes:

- Test normal, fast, and reverse scroll.
- Test reduced motion.
- Resize across breakpoints and ensure old triggers/pin spacers are removed.
- Navigate away/back and ensure timelines do not duplicate.
- Search changed styles for `transition: all` and layout-property animation.

When Three.js changes:

- Test default backend, forced WebGL 2, and static-poster failure paths.
- Check renderer draw calls, triangles, memory, and cleanup after repeated mount/unmount.
- Test tab hiding and off-screen pause behavior.

Before launch:

- Run and inspect a production build.
- Target Lighthouse category scores around `90+` in the agreed environment.
- Target LCP `<2.5s`, CLS `<0.1`, and INP `<200ms` under representative conditions.
- Perform keyboard-only and manual screen-reader spot checks.
- Check all target viewports and current Chrome/Safari/Firefox/Edge classes.
- Verify every external link, résumé, email address, project claim, and preview image.

## Definition of done

The portfolio is done only when:

- It clearly communicates identity, work, capability, and contact information.
- Every published fact and link is verified.
- The static page is complete before enhancement.
- The Orbital Archive and selected-work sequence are original, purposeful, and performant.
- JavaScript-off, reduced-motion, mobile, keyboard, no-WebGPU, forced-WebGL, and renderer-failure paths remain usable.
- No build, type, hydration, console, accessibility, broken-link, or cleanup defect is knowingly left behind.
- The result reflects SpaceFS's restraint and pacing while remaining unmistakably this portfolio's own design.
