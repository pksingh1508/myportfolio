# Personal Portfolio — Product and Experience Plan

## Hero revision — September 5, 2026

The owner has replaced the hero monolith/Three.js scene with a SpaceFS-inspired curved image carousel. This supersedes the older hero-specific 3D integration instructions below. Seven original, temporary SVG previews follow a slow continuous arc on the right of desktop copy and below mobile copy. CSS defines the arc transforms and opacity; a shared animation clock advances the paused CSS animations with smoothly damped native-scroll velocity (up to 5.5× idle speed). Card hover pauses the loop and scales an inner surface by 1.045; keyboard focus also pauses. The caption and playback button are removed at the owner’s request. Off-screen and hidden-tab suspension remain in place. Reduced motion and no JavaScript show a still composition. Image paths and dimensions live in `heroCarouselImages` in `src/constant/data.ts`; replace the decorative assets in `public/images/hero/` with approved project images later. Existing non-hero scenes remain separate from this revision.


## 1. Project intent

Build a highly crafted personal portfolio for a creative developer/engineer. The site should feel simple at first glance, then reveal technical depth through motion, spatial transitions, and one memorable Three.js/WebGPU experience. It must communicate who the owner is, what they build, how they think, and how to contact them without behaving like a visual-effects demo.

The homepage is the primary experience. Project detail pages add enough depth for hiring managers, collaborators, and potential clients to understand the work without requiring a separate CMS in the first release.

### Primary audiences

- Hiring managers and technical leaders who need fast evidence of capability.
- Founders and collaborators looking for a designer-engineer who can own polished product experiences.
- Other engineers and designers interested in the craft and implementation details.

### Primary user journeys

1. Land on the hero, understand the role and point of view in under ten seconds, then open a selected project.
2. Scan selected work, capabilities, and experience, then contact or download the résumé.
3. Explore the interactive 3D object and motion details without losing access to the same information in normal HTML.

### Success criteria

- The first viewport states the person's name, role, specialization, and current availability.
- The best three to five projects are reachable within one meaningful scroll.
- Every project has a clear problem, contribution, outcome, and technology summary.
- The experience remains complete with JavaScript disabled, reduced motion enabled, or WebGPU unavailable.
- Mobile is a first-class composition, not a shrunken desktop version.
- Motion reinforces hierarchy and narrative; it never delays access to content.

## 2. Reference study: SpaceFS

Reference reviewed on 2026-09-04: [spacefs.com](https://spacefs.com/).

This is a reference for art direction, pacing, and motion grammar. It is not a template to copy. Finder mockups, Space branding, copy, photography, and exact compositions must not be reused.

### Observed visual language

- **Overall theme:** extremely clean, product-led minimalism. Large areas of white make a few cinematic visual sequences feel more important. A long near-black interlude creates a dramatic change of pace.
- **Typography:** `Google Sans` for display and body text with `Google Sans Code` available for technical UI. The live desktop hero measured at `68px`, weight `400`, approximately `1.06` line height, and `-1.7px` tracking. Supporting text is compact, quiet, and generously spaced.
- **Core light colors:** white `#FFFFFF`, ink `#0A0A0A`, muted gray `#737373`, soft surface `#F8F8F8`, and hairline borders around `#E5E5E5` / `#E5E7EB`.
- **Dark sequence colors:** background around `#0A0A0A`, raised media surface around `#171717`, primary text `#FAFAFA`, and secondary text `#A3A3A3`.
- **System accent:** macOS-style blue appears in the product mockups around `rgba(10, 132, 255, 0.8)` but is not used as broad decorative branding.
- **Layout:** fixed, minimal navigation; left-aligned hero copy; huge negative space; rounded pill controls; oversized product-media compositions; content widths up to roughly `1240–1440px`; minimal borders and shadows.
- **Corner language:** pill buttons for controls and approximately `14–20px` radius for media windows. Corners encode component type rather than applying one radius everywhere.

### Observed motion language

- A restrained fixed navigation sits over the page with a masked blur/saturation backdrop.
- The hero uses a loose stack of photographic cards with soft perspective, rotation, depth, and edge fades.
- A roughly `420svh` scroll sequence transforms the hero media into a large, centered desktop-window demonstration while the viewport remains visually anchored.
- A later dark chapter uses a sticky full-viewport layout over a long scroll range. Copy changes on the left, application scenes change on the right, and a segmented progress line communicates position.
- Small content reveals use about `24px` of vertical displacement, `0.7s` duration, and a custom ease near `cubic-bezier(0.22, 0.68, 0.35, 1)`.
- Micro-interactions use short `150–300ms` transitions; looping states are limited to functional elements such as streaming/progress indicators.
- The live site does not expose GSAP or Three.js globals. Its effect comes from native layout, CSS animation, and scroll-linked JavaScript. Our site will reproduce the quality of pacing with a different implementation and original visual concept.

### Lessons to carry forward

- Use contrast in density: quiet reading sections make the immersive chapter more memorable.
- Treat scroll as a narrative clock, not a navigation replacement.
- Keep the page structurally normal around the pinned sequence.
- Use real portfolio artifacts inside the motion system, so spectacle also communicates work.
- Avoid decorative gradients, arbitrary floating blobs, generic feature cards, and motion on every heading.

## 3. Original design direction: “Orbital Archive”

The portfolio is imagined as a living archive of work. Projects are represented by thin spatial frames orbiting a precise central object. The frame stack begins as the hero's signature visual and later resolves into a project stage during the selected-work chapter. This borrows SpaceFS's transformation-based storytelling, but the object, materials, copy, geometry, and layout are original.

### Design principles

1. **One spectacular system:** spend the visual boldness on the Orbital Archive. Keep the surrounding interface typographic and calm.
2. **Evidence before claims:** project outcomes, responsibilities, and artifacts carry more weight than skill badges.
3. **Technical warmth:** precise grids and engineered motion are softened by human copy, photography, and slightly tactile materials.
4. **Motion with a job:** every animation must provide feedback, orientation, continuity, or one deliberate moment of delight.
5. **Progressive enhancement:** meaningful HTML is always present. 3D and scroll choreography enhance it.

### Color tokens

The reference's near-monochrome discipline is retained, but the portfolio gains a distinctive cool-violet signal color.

| Token | Value | Role |
| --- | --- | --- |
| `--color-paper` | `#F7F8FC` | Main cool-white page canvas |
| `--color-white` | `#FFFFFF` | Cards, elevated media, inverted text |
| `--color-ink` | `#090A0C` | Primary copy and dark chapter |
| `--color-graphite` | `#6F737B` | Supporting copy and metadata |
| `--color-line` | `#DDE1E8` | Dividers, outlines, focus-neutral UI |
| `--color-signal` | `#635BFF` | Sparse interaction and 3D energy accent |
| `--color-signal-soft` | `#B9B6FF` | Iridescent edges and selected states |
| `--color-night-surface` | `#15171B` | Raised media in the dark project chapter |

Rules:

- Signal color appears on active navigation, focus rings, live status, project progress, and the 3D object's emissive edge only.
- Body text must meet WCAG AA contrast. Muted text is never used below the required contrast for its size.
- Avoid full-page gradients. Controlled 3D lighting may create natural gradients inside the canvas.

### Typography

- **Primary:** `Instrument Sans`, self-hosted through `next/font/google` if available in the installed Next.js version. It provides a clean but less default-feeling humanist voice for display and body copy.
- **Technical accent:** `IBM Plex Mono` for project metadata, coordinates, dates, and small status readouts.
- **Fallback:** system sans/mono stacks if either family cannot be loaded.
- Display scale uses fluid `clamp()` values. Desktop hero target: `clamp(3.5rem, 7vw, 7.5rem)` with tight `0.92–0.98` line height. Mobile hero target: `clamp(2.8rem, 13vw, 4.75rem)`.
- Body copy stays within roughly `60–72ch`, with `1.55–1.7` line height.
- Use sentence case. Do not repeat uppercase eyebrow labels above every section.

### Layout system

- Twelve-column desktop grid, six-column tablet grid, and four-column mobile grid.
- Content shell: Tailwind `max-w-7xl`, implemented as `min(100% - 2rem, 80rem)`, with larger gutters at wider breakpoints.
- Text is predominantly left-aligned. Centering is reserved for the final contact statement.
- Sections use generous vertical rhythm, typically `clamp(6rem, 12vw, 12rem)`.
- Hairline dividers encode changes in information; cards are used only when a real contained object exists.
- Desktop project storytelling uses a split composition. Mobile returns to a linear document with inline media.

### Shape, material, and image language

- Pills are reserved for true controls: navigation menu, availability status, and primary CTA.
- Project frames use `16–24px` radii depending on size; text regions generally have no container radius.
- Shadows are wide, faint, and colored from the environment rather than standard gray drop shadows.
- Photography and project captures should share restrained treatment: natural color, no fake device frames unless the project genuinely needs one.
- The 3D archive uses smoked glass, satin graphite, and a narrow violet emissive edge. No chrome blob, generic globe, or floating astronaut.

## 4. Information architecture and page sections

### A. Global navigation

- Compact personal mark/name at left.
- Current section indicator or local-time/availability readout in the middle on large screens.
- Work, About, and Contact anchors plus a résumé link on desktop.
- Mobile uses an accessible disclosure menu anchored to the trigger.
- Header stays fixed and gains a soft masked backdrop only after the page begins scrolling.

### B. Hero — identity plus Orbital Archive

- Plain-language headline: name and specific role, followed by a concise value statement.
- One short supporting sentence and two actions: “View selected work” and “Contact me.”
- Availability/status line with location and local time.
- The Orbital Archive occupies the right half on desktop and the lower half on mobile.
- Intro sequence: copy settles in first, then the archive assembles from three project frames. Total orchestration under approximately `1.2s`; content is visible without animation.
- Pointer movement adds subtle camera parallax with a small maximum angle. Touch devices use slow procedural drift, not pointer emulation.

### C. Credibility strip

- A single quiet row for current focus, years of experience, or selected clients/companies.
- Use only verified facts. If data is unavailable, hide the item rather than publish filler.
- Minimal marquee is optional only when there are enough real logos; otherwise use a static row.

### D. Selected work — dark scrollytelling chapter

- Three to five projects, ordered by strongest evidence rather than recency alone.
- Desktop/tablet: a sticky stage spanning no more than approximately `3` viewport heights per grouped chapter. The left column updates project title, role, year, short result, and link. The right stage transforms the archive frame into the active project's media composition.
- A segmented progress rail shows which project is active.
- Scrolling backward reverses the same sequence; continuing normally exits the chapter.
- Mobile/reduced-motion: normal stacked project articles with an image, summary, metadata, and link; no pinning.
- Each project needs: slug, title, category, year, summary, problem, contribution, outcome, stack, media, accent, and optional live/source links.

### E. Capabilities — “How I build”

- Three concise capabilities: product engineering, interactive front-end, and systems/quality (rename to match the owner's real work).
- Use a ruled editorial layout, not identical rounded cards.
- Each capability pairs a plain-language statement with a short tool/discipline list.
- One coordinated reveal is allowed for the group; individual rows respond with subtle hover/focus feedback.

### F. About and working principles

- A candid portrait or workspace artifact, a short biography, and two to four operating principles.
- Biography explains trajectory, current focus, and the kind of problems the owner wants next.
- Portrait receives very subtle depth parallax on fine pointers only.
- Résumé download and social links are present as normal links.

### G. Experience / selected timeline

- Compact chronological list with organization, role, dates, and one concrete contribution.
- Semantic list markup; no decorative numbering unless chronology requires it.
- On hover/focus, the active row gains the signal line and adjacent media/detail may update.

### H. Experiments / playground

- Optional section for WebGPU, shaders, prototypes, or open-source work.
- Use a two-column lab index with live, lightweight previews only when performance allows.
- Previews pause off-screen and have static poster fallbacks.

### I. Contact finale

- Centered, large invitation tailored to the desired opportunities.
- Primary email action, secondary social links, availability state, and local time.
- Rare delight moment: the archive resolves into the personal mark, then becomes still.
- Footer includes copyright, current stack note, and accessibility/reduced-motion respect.

### J. Project detail route (`/work/[slug]`)

- Project hero with title, result, role, year, and lead media.
- Context, constraints, approach, implementation, outcome, and reflection.
- Media gallery uses optimized images/video posters.
- Previous/next project navigation and contact CTA.
- Use static generation from the typed project dataset for v1.

## 5. Motion system

### Ownership by technology

- **CSS transitions:** buttons, links, focus/hover/pressed states, nav backdrop, menu icon, and simple disclosure transitions.
- **Motion for React:** the one-time hero orchestration, poster-to-canvas presence handoff, and a deliberately small number of one-shot section reveals. Motion is used at leaf client boundaries and respects reduced motion.
- **GSAP ScrollTrigger:** the pinned project chapter, progress rail, and archive-to-project transformations where a single imperative scroll timeline is the clearer owner.
- **Three.js animation loop:** ambient object drift, material time uniforms, and damped pointer response.
- **GSAP-to-Three bridge:** GSAP animates camera/group values for discrete or scroll-linked narrative poses; the Three.js loop renders the interpolated state.
- **Motion is intentionally adopted for v1:** the owner explicitly requested it. It owns React-native presence and entrance choreography; CSS continues to own frequent interaction states and GSAP continues to own the existing pinned scroll sequence, preventing competing animation owners.

### Motion tokens

| Use | Duration / behavior | Ease |
| --- | --- | --- |
| Press | `120ms` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` |
| Hover transform | `140ms` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Menu/dialog move | `240–320ms` | `cubic-bezier(0.25, 1, 0.5, 1)` |
| Marketing reveal | `500–700ms` | `cubic-bezier(0.19, 1, 0.22, 1)` |
| Hero sequence | up to `1200ms` total | GSAP `power3.out`-family curve |
| Scrubbed scroll | scroll is the clock | `ease: "none"`, numeric scrub only if tested |
| Ambient 3D | frame-delta based | sine/damped interpolation |

### Choreography rules

- Hero content never waits for scroll and never begins hidden in the server-rendered HTML.
- Reveal only two to four key moments across the page. Do not attach a fade-up to every section.
- Triggered reveals run once. Scrubbed animations reverse naturally.
- Never combine `scrub` and `toggleActions` on the same ScrollTrigger.
- Pin a wrapper and animate its children; never animate the pinned element itself.
- Create ScrollTriggers in document order and call `ScrollTrigger.refresh()` after fonts/media change layout.
- Never hijack wheel/touch scrolling. Native scrolling remains authoritative.
- Animate `transform` and `opacity` in the DOM. Avoid layout-property animation and `transition: all`.
- Hover-only motion is gated behind `(hover: hover) and (pointer: fine)`.

### Reduced-motion version

- Skip the hero assembly, pointer parallax, ambient orbit, camera moves, and pinned project sequence.
- Render a static archive poster or still Three.js frame only if it costs little; otherwise use an optimized image.
- Show projects in their final readable positions with no opacity gating.
- Preserve essential menu/disclosure state feedback with near-instant transitions.

## 6. Three.js and WebGPU plan

### Scene concept

The scene contains one `ArchiveRoot` group with three to five reusable project frames orbiting a small central monolith. Each frame is a shallow rounded plane with a project-color edge and optional optimized image texture. Thin line geometry traces orbital paths only when it improves depth perception.

### Scene graph

```text
Scene
├── PerspectiveCamera
├── ArchiveRoot
│   ├── CoreMonolith
│   ├── ProjectFrame[0..n]
│   ├── OrbitLines
│   └── DustInstances (desktop/high quality only)
├── KeyLight
├── FillLight
└── RimLight
```

### Renderer strategy

- Use `WebGPURenderer` from `three/webgpu` and its `setAnimationLoop()` lifecycle. Current official Three.js guidance says it selects WebGPU when available and falls back to a WebGL 2 backend.
- Keep materials compatible with the renderer's node/TSL system; do not depend on legacy `ShaderMaterial`, `onBeforeCompile`, or `EffectComposer` in this path.
- If renderer initialization fails entirely, replace the canvas with a pre-generated poster without affecting layout or content.
- Dynamically import the whole 3D client island with SSR disabled so the static portfolio and SEO content stay server-rendered.

### Camera and interaction

- Perspective camera around `40–50°` FOV with tight near/far planes.
- Pointer input maps to a small target rotation; frame-delta damping moves the group without laggy CSS easing.
- ScrollTrigger maps project chapter progress to named scene poses rather than continuously inventing values throughout components.
- Raycasting is optional. If added, frame focus/selection must also be available through keyboard-accessible DOM controls.

### Materials and lighting

- Prefer shared `MeshStandardNodeMaterial`-compatible materials.
- Core: matte graphite, medium roughness, no costly transmission.
- Frames: low-poly satin surfaces with a restrained signal-colored emissive edge.
- Glass/transmission is reserved for one hero surface and removed on mobile/low quality.
- Use one key, one fill, and one rim light; shadows should be avoided unless profiling proves them valuable.
- Tone mapping and color-space output must be explicitly configured and visually checked against CSS colors.

### Performance budget

- Desktop target: stable `60fps`; mobile target: stable `30–60fps` without thermal runaway.
- Cap renderer pixel ratio at `2` desktop and `1–1.5` mobile.
- Target fewer than `50` draw calls on mobile and fewer than `100` on desktop.
- Target fewer than `100k` visible triangles on mobile; the intended scene should be far below this.
- Reuse geometry/materials; use `InstancedMesh` for dust/particles.
- Pause the render loop when the canvas is off-screen or `document.hidden`.
- Disable particles, transmission, post-processing, and high sample counts on constrained devices.
- Dispose geometry, materials, textures, observers, listeners, GSAP contexts, and renderer resources on unmount.

## 7. Technical architecture

### Stack

- Next.js `16.3.4` App Router, React `19.2.8`, TypeScript strict mode.
- Tailwind CSS v4 for layout utilities plus CSS custom properties in `globals.css` for the design system.
- GSAP, ScrollTrigger, and `@gsap/react` for choreographed motion.
- Three.js WebGPURenderer for the hero/project scene.
- `next/font` for self-hosted font delivery and `next/image` for portfolio imagery.

### Server/client boundary

- Keep `src/app/page.tsx`, layouts, metadata, and content rendering as Server Components.
- Use small explicit client islands for `SiteHeader`, `HeroIntro`, `ProjectStory`, and `ArchiveScene` only.
- Avoid placing `"use client"` high in the tree. Serializable data flows into client islands as small typed props.
- Lazy-load the 3D scene and any project video only when near the viewport or after the critical hero text is rendered.

### Proposed file structure

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── not-found.tsx
│   ├── opengraph-image.tsx
│   ├── robots.ts
│   ├── sitemap.ts
│   └── work/[slug]/page.tsx
├── components/
│   ├── layout/
│   ├── sections/
│   ├── motion/
│   ├── three/
│   └── ui/
├── constant/
│   └── data.ts
├── lib/
│   ├── motion.ts
│   ├── three-quality.ts
│   └── utils.ts
└── types/
    └── portfolio.ts
public/
├── images/
├── models/
├── textures/
├── video/
└── resume/
```

### Content model

- All personal, professional, project, education, navigation, and contact facts live in `src/constant/data.ts`.
- `src/constant/data.ts` exports the canonical typed `portfolioData` object plus convenient named section exports for frontend use.
- No invented clients, metrics, testimonials, links, or employment facts. Missing values are omitted in UI.
- Media entries require intrinsic dimensions, meaningful alt text or an explicit decorative flag, and an optional poster for video.

### SEO and metadata

- Replace starter metadata with a specific title, description, metadata base, Open Graph/Twitter values, and canonical URL once the production domain is known.
- Generate static project metadata from the content model.
- Add `sitemap.ts`, `robots.ts`, favicon/app icon, and a branded Open Graph image.
- Use semantic landmarks, one `h1` per page, and meaningful project link names.

## 8. Responsive behavior

- **Desktop (`>= 1024px`):** split hero, full 3D archive, fixed header, sticky selected-work stage.
- **Tablet (`768–1023px`):** smaller scene, shorter pinned range, simplified material quality, readable two-column project layout.
- **Mobile (`< 768px`):** linear hero with scene below copy, static/low-motion archive, normal stacked projects, no long pin, no pointer parallax, reduced particle count.
- **Short viewports:** disable or shorten pinning where the sticky composition would clip important text.
- Test at `360×800`, `390×844`, `768×1024`, `1280×720`, `1440×900`, and a short laptop viewport.

## 9. Accessibility and resilience

- Provide a skip link, correct landmarks, logical heading order, visible focus, and a working keyboard menu.
- Target WCAG 2.2 AA color contrast and a minimum practical touch target of `44px`.
- Canvas is decorative or supplementary: label it appropriately and duplicate project meaning in HTML.
- Never require hover, precise scrolling, drag, WebGPU, or animation to reach a project or contact action.
- Respect `prefers-reduced-motion` in CSS, GSAP (`matchMedia`), ScrollTrigger, and the renderer loop.
- Handle forced colors/high contrast where possible and never encode project state by color alone.
- Avoid autoplaying audio. Video is muted, inline, user-controllable, and uses a poster.
- If JavaScript fails, content remains visible and links remain functional.

## 10. Performance and quality targets

- Aim for Lighthouse Performance, Accessibility, Best Practices, and SEO scores of `90+` on representative production builds.
- Target LCP under `2.5s`, CLS under `0.1`, and INP under `200ms` on a representative mid-range mobile profile.
- Do not make the WebGPU scene the LCP candidate; hero text renders immediately and the scene loads progressively.
- Keep initial client JavaScript intentionally small; inspect the bundle after adding GSAP and Three.js.
- Optimize images through `next/image`, provide `sizes`, and reserve dimensions.
- Compress any GLB using Draco/Meshopt only if a custom model is introduced. Prefer procedural geometry for v1.
- Use KTX2/Basis only if textures become the measured bottleneck.

## 11. Verification strategy

- Every implementation phase ends with `pnpm run build`; do not stack errors across phases.
- Use browser screenshots at the target viewports after every major visual phase.
- Test keyboard-only navigation, focus order, reduced motion, mobile touch, and no-WebGPU fallback.
- Inspect for console errors, hydration warnings, duplicate animation ownership, stale ScrollTriggers, and undisposed renderer resources.
- Profile the dark project chapter and 3D scene in DevTools. Optimize measured bottlenecks rather than removing quality blindly.
- Final review must compare the output to this document, not to the SpaceFS page pixel for pixel.

## 12. Content required before launch

- Full name and preferred role/title.
- Short and long biography.
- Location/timezone and availability statement.
- Three to five projects with verified outcomes, responsibilities, dates, stack, links, and approved media.
- Employment/education timeline if included.
- Portrait or approved personal image.
- Email, social links, résumé file, production domain, analytics choice, and privacy requirements.

The site may be built with clearly marked local placeholder data, but it is not launch-ready until every item above is reviewed by the owner.
