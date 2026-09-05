# Personal Portfolio — Incremental Implementation Guide

## Hero revision — September 5, 2026

The owner has replaced the hero monolith/Three.js scene with a SpaceFS-inspired curved image carousel. This supersedes the older hero-specific 3D integration instructions below. Seven original, temporary SVG previews follow a slow continuous arc on the right of desktop copy and below mobile copy. CSS defines the arc transforms and opacity; a shared animation clock advances the paused CSS animations with native-scroll momentum: each pixel adds a bounded impulse, which decays exponentially (1.6/s), with a 75ms smoothing response and a 45× idle ceiling. Card hover pauses the loop and scales an inner surface by 1.045; keyboard focus also pauses. The caption and playback button are removed at the owner’s request. Fresh page loads use a staged text rise (24px), a restrained header entrance, and staggered card assembly from 450ms with a brief launch impulse. This September 5 reference-driven revision supersedes the older 1.2s entrance budget and session-only playback: the full opening settles in about 1.75s, with no blocking loader. Off-screen and hidden-tab suspension remain in place. Reduced motion and no JavaScript show a still composition. Image paths and dimensions live in `heroCarouselImages` in `src/constant/data.ts`; replace the decorative assets in `public/images/hero/` with approved project images later. Existing non-hero scenes remain separate from this revision.


Contact revision: the owner has removed the contact Three.js scene. The finale contains contact copy and actions only; its dedicated scene wrapper, poster, and styling are removed. This supersedes the older contact archive-to-mark requirements. Shared archive tooling remains available for the development specimen.

## Execution contract

This file is the build order. Complete one step, satisfy its exit gate, and commit or checkpoint the working state before starting the next step. A later step may refine earlier visuals, but it must not be used to postpone a broken build, inaccessible content, or missing fallback.

For every step:

1. Read `AGENTS.md`, `plan.md`, and the listed skill file(s).
2. Read the relevant Next.js 16 guide in `node_modules/next/dist/docs/` before changing framework code.
3. Inspect the current working tree and preserve unrelated user changes.
4. Implement only the step's bounded scope.
5. Run the step's checks and `pnpm run build`.
6. Do not proceed until the exit gate is true.

Use `frontend-design`, `ui-animation`, `scroll-animations`, `gsap-scrolltrigger`, `threejs-fundamentals`, `threejs-webgl`, and `threejs-animation` from `.agents/skills/` at the points named below. The local `react-three-fiber` skill is specialized for `@json-render/react-three-fiber`; it is not part of the planned raw Three.js/WebGPURenderer architecture. The `motion` skill is intentionally deferred because CSS and GSAP already own the v1 motion system.

## Step 0 — Confirm identity, content, and scope

**Skills:** `frontend-design`

**Work**

- Gather the owner's name, role, one-sentence positioning, location/timezone, email, social links, résumé, portrait, and availability.
- Select three to five projects using evidence quality: clear problem, individual contribution, outcome, and strong media.
- Decide which project links can be public and which require a case-study-only presentation.
- Confirm whether experience, experiments, and project detail routes are included in v1.
- Put any missing factual fields into a visible content checklist. Never invent professional facts.

**Checks**

- Every planned section has real content or an explicit “omit until supplied” decision.
- Each selected project has at least a title, summary, role, year, outcome, stack, and one usable visual.

**Exit gate:** the content inventory is approved enough to build without anonymous lorem ipsum.

## Step 1 — Establish the clean technical baseline

**Skills:** none beyond repository instructions; read the installed Next.js 16 documentation first.

**Next.js reading**

- `01-app/01-getting-started/02-project-structure.md`
- `01-app/01-getting-started/05-server-and-client-components.md`
- `01-app/02-guides/production-checklist.md`

**Work**

- Record the current build result and browser console state before changing UI.
- Remove starter-only assets and markup only after confirming they are unused.
- Create the folders described in `plan.md` without adding premature abstractions.
- Keep `src/app/page.tsx` and route pages as Server Components.
- Add project scripts for lint/type checking only if the installed toolchain supports them; do not assume an older Next.js ESLint command.

**Checks**

- `pnpm run build`
- No hydration warnings or browser console errors on `/`.
- Git diff contains only intended baseline changes.

**Exit gate:** the empty portfolio shell builds cleanly and still renders a semantic page.

## Step 2 — Create typed content and route foundations

**Skills:** `frontend-design` for content hierarchy and copy restraint.

**Work**

- Create `src/types/portfolio.ts` with `Profile`, `Project`, `ProjectMedia`, `ExperienceItem`, and `SocialLink` types.
- Maintain the canonical typed portfolio content in `src/constant/data.ts`.
- Validate unique slugs and require accessible media metadata.
- Add `src/app/work/[slug]/page.tsx` with static params and a plain semantic case-study layout.
- Add a useful `not-found.tsx` for invalid project slugs.
- Keep personal data server-side unless a client island genuinely needs a small serializable subset.

**Checks**

- Every project detail route builds from the data model.
- Invalid slugs render the 404 state.
- There are no duplicated project facts hardcoded across components.

**Exit gate:** the full information architecture works as unstyled, accessible HTML.

## Step 3 — Build the visual foundation and token system

**Skills:** `frontend-design`

**Next.js reading**

- `01-app/01-getting-started/11-css.md`
- `01-app/01-getting-started/13-fonts.md`

**Work**

- Replace starter tokens in `globals.css` with the color, typography, spacing, grid, radii, z-index, and motion tokens from `plan.md`.
- Load Instrument Sans and IBM Plex Mono through the current `next/font` API. If Instrument Sans is unavailable, choose the closest deliberate open-source humanist sans and document the substitution.
- Add base styles for selection, focus, body copy, links, buttons, skip link, and reduced motion.
- Create a reusable content shell and ruled-divider primitives. Do not create a generic card component for unrelated surfaces.
- Implement a development-only type and spacing specimen route or component if it materially speeds visual calibration; remove it before launch if it becomes routable clutter.

**Checks**

- Contrast check for every foreground/background token pair.
- Font loading produces no visible layout shift in a production build.
- Verify at mobile, tablet, desktop, and short-laptop viewports.
- `pnpm run build`

**Exit gate:** a static typography/layout specimen matches the “Orbital Archive” direction before section work begins.

## Step 4 — Implement the static page composition

**Skills:** `frontend-design`

**Work**

- Build semantic static versions of the header, hero, credibility strip, selected work, capabilities, about, experience, experiments (if included), contact, and footer.
- Use real content from the typed model.
- Add anchor targets with scroll margins and clear link names.
- Build desktop and mobile layouts together; do not defer mobile to the end.
- Render the selected-work section as normal stacked articles at this stage. It becomes a progressive-enhanced scrollytelling section later.
- Use `next/image` with correct width/height, `sizes`, priority only for the actual LCP image, and meaningful alt text.

**Checks**

- Disable JavaScript: all identity, work, about, and contact content remains available.
- Navigate the page using keyboard only.
- Inspect all target viewports for overflow and line-length problems.
- `pnpm run build`

**Exit gate:** the portfolio is content-complete, responsive, and presentable with zero animation and zero canvas.

## Step 5 — Add the navigation and interaction-state motion

**Skills:** `ui-animation`; load its component-pattern and decision-framework references as required.

**Work**

- Build a small client-side mobile menu with correct focus handling, escape dismissal, and `aria-expanded`/`aria-controls` state.
- Add the fixed header's masked backdrop transition after scroll begins.
- Add explicit hover, focus-visible, and pressed states to interactive elements.
- Use CSS transitions for these frequent interactions. Never use `transition: all`.
- Gate hover motion behind fine-pointer media queries and add `touch-action: manipulation` to tappable controls.
- Ensure open and close motion are paired and originate from the menu trigger.

**Checks**

- Rapidly toggle the mobile menu; transitions retarget without snapping.
- Tab order stays logical and focus returns to the trigger on close.
- Hover styles do not get stuck on touch emulation.
- Search the diff for `transition: all` and unintended layout-property animation.
- `pnpm run build`

**Exit gate:** all interaction states are accessible and feel immediate before decorative motion is introduced.

## Step 6 — Install and isolate the animation runtime

**Skills:** `gsap-scrolltrigger`, `ui-animation`

**Work**

- Add `gsap` and `@gsap/react` using pnpm.
- Create one client-only registration module for GSAP plugins.
- Create reusable hooks/utilities only for repeated behavior: reduced-motion query, GSAP media context, and scoped cleanup.
- Use `useGSAP()` or a scoped `gsap.context()` in every React component that creates GSAP work.
- Define development marker behavior that cannot ship enabled in production.
- Do not add a smooth-scroll library. Native scroll remains the source of truth.

**Checks**

- Route navigation/unmount leaves no duplicate timelines or ScrollTriggers.
- Bundle inspection confirms GSAP is loaded only by pages/components that need it.
- `pnpm run build`

**Exit gate:** a tiny test timeline mounts, cleans up, and respects reduced motion without changing production composition.

## Step 7 — Choreograph the hero intro

**Skills:** `ui-animation`, `frontend-design`, `motion`.

**Work**

- Animate an existing, visible server-rendered hero into its resting pose with Motion for React; never ship HTML with essential content permanently at `opacity: 0`.
- Sequence name/role, supporting copy, CTAs, status, and a placeholder archive poster in hierarchy order.
- Keep total first-load choreography at or below approximately `1.2s` and make it run once per visit/session as decided.
- Use transform/opacity only. Avoid animating keyboard-initiated focus movement.
- Reduced-motion mode skips directly to the final pose.

**Checks**

- Simulate slow JavaScript and failed JavaScript; hero content remains readable.
- Test refresh, back/forward cache, and route return for duplicate intros.
- Slow animations in DevTools to inspect transform origin and sequencing.
- `pnpm run build`

**Exit gate:** the hero has one polished opening moment with no content flash or accessibility regression.

## Step 8 — Build the Three.js/WebGPU prototype in isolation

**Skills:** `threejs-fundamentals`, `threejs-webgl`, `threejs-animation`; read the WebGL/WebGPU optimization checklist and relevant material guide.

**Next.js reading**

- `01-app/02-guides/lazy-loading.md`
- `01-app/02-guides/server-and-client-boundary.md`

**Work**

- Add `three` using pnpm and verify the installed version's local API/types before coding.
- Build `ArchiveScene` as a leaf client component dynamically imported with SSR disabled.
- Initialize `WebGPURenderer` from `three/webgpu`; use `setAnimationLoop()` because initialization is asynchronous.
- Create the scene graph from `plan.md` with procedural geometry first—no external GLB until the art direction proves it is needed.
- Add explicit camera resize handling, pixel-ratio tiers, color space, tone mapping, and quality settings.
- Add an `IntersectionObserver` and visibility listener to pause off-screen/hidden rendering.
- Add teardown for the loop, renderer, geometries, materials, textures, listeners, and observers.
- Produce a static poster fallback with the same aspect ratio.

**Checks**

- Force WebGL 2 through the renderer option and verify the fallback path.
- Simulate complete renderer failure and verify the static poster plus HTML content.
- Inspect `renderer.info` for draw calls, triangles, geometry, and texture counts.
- Resize repeatedly and mount/unmount repeatedly while watching memory.
- `pnpm run build`

**Exit gate:** the isolated archive scene is stable, disposable, responsive, and useful before it is connected to page scroll.

## Step 9 — Refine the 3D art direction and interaction

**Skills:** `threejs-webgl`, `threejs-animation`, `ui-animation`

**Work**

- Implement the smoked-glass/satin-graphite/violet-edge material system with renderer-compatible nodes/TSL where needed.
- Reuse project-frame geometry and shared materials. Instance particles if the desktop quality tier keeps them.
- Add frame-delta ambient motion and damped pointer response with strict angle limits.
- Make touch behavior a slow ambient drift rather than fake cursor tracking.
- Add named scene poses: `hero`, one pose per project, and `final-mark`.
- If project image textures are used, resize/compress them and set correct color spaces.

**Checks**

- Profile desktop and a throttled mobile class; remove effects that miss the frame budget.
- Confirm the canvas does not capture scroll or keyboard focus unless an accessible interaction explicitly requires it.
- Confirm project meaning remains in adjacent HTML.
- `pnpm run build`

**Exit gate:** the archive is visually distinctive at all quality tiers and meets the scene performance budget.

## Step 10 — Integrate the 3D hero without harming LCP

**Skills:** `threejs-webgl`, `ui-animation`, `frontend-design`

**Work**

- Place the dynamic scene into the hero's reserved media slot.
- Render the static poster immediately, then crossfade to the first successful canvas frame.
- Defer nonessential textures and high-quality features until after critical text is interactive.
- Keep hero copy and primary actions above the canvas in reading and stacking order.
- Calibrate pointer parallax so it adds depth without competing with reading.

**Checks**

- Measure LCP/CLS with scene enabled and disabled.
- Test slow network/CPU and confirm the poster never collapses or flashes blank.
- Verify the canvas at every target viewport and device orientation.
- `pnpm run build`

**Exit gate:** the signature visual enhances the hero while the page remains fast and stable.

## Step 11 — Build the selected-work scrollytelling chapter

**Skills:** `gsap-scrolltrigger`, `scroll-animations`, `ui-animation`, `threejs-animation`

**Work**

- Preserve the static project article DOM as the source of content.
- Enhance desktop/tablet into a sticky split stage using GSAP `matchMedia()`.
- Create one top-level ScrollTrigger timeline in document order. Pin the stage wrapper and animate child content only.
- Map monotonic scroll progress to project-copy states, progress-rail segments, media transitions, and named Three.js poses.
- Use `ease: "none"` for scroll-driven progress. Do not add durations to scrubbed motion or combine scrub with `toggleActions`.
- Keep the total pinned length proportionate and skippable; target at most approximately `2–3` viewport heights for the grouped story unless real content proves a longer range necessary.
- On mobile, short viewports, reduced motion, or failed scene initialization, render the normal stacked project list with no pin.
- Refresh ScrollTrigger after fonts and project media settle.

**Checks**

- Scroll slowly, quickly, backward, and with trackpad momentum. State remains monotonic and deterministic.
- Resize across the desktop/mobile breakpoint; all old triggers and pin spacers are removed.
- Navigate away and back; no duplicate pins or triggers appear.
- Verify keyboard users can reach every project link while the stage is active.
- `pnpm run build`

**Exit gate:** selected work tells a coherent story with or without ScrollTrigger and 3D.

## Step 12 — Add the remaining high-value motion moments

**Skills:** `scroll-animations`, `ui-animation`; use `svg-animations` only if the final personal mark is an authored SVG.

**Work**

- Apply the scroll-animation gate to every candidate: purpose, frequency, and whether it explains or emphasizes something specific.
- Add only two to four one-shot reveals outside the project chapter.
- Use `10–16px` displacement, `400–600ms` duration, strong ease-out, early triggers, and hierarchy-based stagger.
- Add subtle fine-pointer image parallax at no more than approximately `15%` differential.
- Choreograph the rare contact-finale archive-to-mark resolution.
- Pause all looping/ambient effects when off-screen.

**Deliberately reject**

- Per-section fade-up repetition.
- Body-text parallax.
- Scroll-jacking or wheel-step slides.
- Animated keyboard navigation.
- Decorative looping motion beside long-form text.

**Checks**

- Review the whole page and remove at least one redundant effect if motion competes for attention.
- Confirm every trigger runs once unless it is explicitly scrubbed.
- Confirm reduced-motion mode shows final states instantly.
- `pnpm run build`

**Exit gate:** motion feels abundant because it is coherent and spatial, not because every element moves.

## Step 13 — Complete project detail pages and media

**Skills:** `frontend-design`, `ui-animation` for any essential gallery transition.

**Work**

- Build context, constraints, contribution, approach, implementation, outcome, and reflection sections from the typed data.
- Create reusable figure/video components with captions, intrinsic sizing, posters, controls, and lazy loading.
- Add next/previous project navigation and a contact CTA.
- Keep case-study motion quieter than the homepage so reading remains primary.
- Generate route metadata from each project.

**Checks**

- Direct-load every project route and navigate among them.
- Test video controls and galleries using keyboard and touch.
- Verify no private or placeholder content ships.
- `pnpm run build`

**Exit gate:** every selected project has a launch-quality, shareable detail page.

## Step 14 — Metadata, social preview, and discoverability

**Skills:** `frontend-design` for the Open Graph composition.

**Next.js reading**

- `01-app/01-getting-started/14-metadata-and-og-images.md`

**Work**

- Replace starter title/description and set the canonical metadata base when the domain is known.
- Add Open Graph/Twitter images, `sitemap.ts`, `robots.ts`, icons, and canonical URLs.
- Add structured data only where it is accurate and helpful.
- Ensure project pages have unique titles, descriptions, and preview media.

**Checks**

- Inspect rendered metadata for `/` and every `/work/[slug]` route.
- Validate social previews and structured data with appropriate validators.
- `pnpm run build`

**Exit gate:** every public page has accurate, unique metadata and a polished social preview.

## Step 15 — Accessibility, resilience, and reduced-motion audit

**Skills:** `ui-animation`, `scroll-animations`, `threejs-webgl`

**Work**

- Audit landmarks, headings, accessible names, alt text, focus visibility, contrast, touch targets, menu behavior, and reading order.
- Test `prefers-reduced-motion`, forced colors/high contrast, JavaScript disabled, image failures, WebGPU disabled, WebGL forced, and renderer initialization failure.
- Confirm the canvas is supplementary and never the only representation of project information.
- Add accessible error/not-found states and remove animation from repeated keyboard-driven actions.

**Checks**

- Keyboard-only end-to-end pass.
- Automated accessibility scan plus manual screen-reader spot check.
- No content is stuck hidden after a script or media failure.
- `pnpm run build`

**Exit gate:** the complete experience remains understandable and operable across all fallback modes.

## Step 16 — Performance profiling and optimization

**Skills:** `threejs-webgl`, `threejs-fundamentals`, `gsap-scrolltrigger`, `ui-animation`

**Work**

- Profile a production build, not the development server.
- Measure Core Web Vitals, bundle composition, long tasks, animation frames, GPU/render stats, and memory across repeated navigation.
- Confirm Three.js and GSAP are lazy and limited to intended client islands.
- Tune pixel ratio, geometry, textures, lights, transmission, particles, and render-loop pause policy based on measured bottlenecks.
- Remove permanent `will-change`, development markers, stats panels, console logging, unused packages, and unused assets.
- Compress images/models/video and verify cache behavior.

**Targets**

- Lighthouse category scores around `90+` in the agreed test environment.
- LCP `< 2.5s`, CLS `< 0.1`, INP `< 200ms` under representative conditions.
- Stable desktop `60fps`; stable mobile `30–60fps` with no continuous rendering while off-screen.
- Three.js targets from `plan.md`: mobile `<50` draw calls and `<100k` visible triangles; desktop `<100` draw calls.

**Checks**

- `pnpm run build`
- Run the production server and repeat measurements after optimization.
- Compare before/after profiles to prove improvement.

**Exit gate:** the visual ambition fits the agreed performance budget with measured evidence.

## Step 17 — Final visual QA and launch readiness

**Skills:** `frontend-design`, `ui-animation`, `gsap-scrolltrigger`, `threejs-webgl`

**Work**

- Capture screenshots at every target viewport and compare hierarchy, rhythm, typography, cropping, and dark/light transitions against `plan.md`.
- Review at normal speed and 10% animation speed; inspect first load, fast scroll, reverse scroll, resize, tab hiding, and route transitions.
- Test current stable Chrome, Safari, Firefox, and Edge classes; verify WebGPU/WebGL/poster behavior in at least two renderer paths.
- Replace every placeholder, broken link, fake metric, and draft asset.
- Proofread all copy and verify email, résumé, social, source, and live-project destinations.
- Run final build and keep the working tree understandable for handoff.

**Exit gate / definition of done**

- All requested content and routes are live-quality.
- No build, type, hydration, console, accessibility, or broken-link errors remain.
- Mobile, reduced motion, keyboard, and no-WebGPU paths are complete.
- Motion and 3D support the portfolio narrative and cleanly dispose on unmount.
- The final page is recognizably inspired by SpaceFS's restraint and pacing but is visually and conceptually original.
