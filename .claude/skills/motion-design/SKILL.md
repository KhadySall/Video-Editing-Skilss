---
name: motion-design
description: Turn spoken ideas into purposeful Remotion motion graphics for educational and social video. Use for visual narratives, animated typography, comparisons, charts, cards, progress, transitions or improving amateur-looking motion.
---

# Motion design

Translate meaning into a visual device before choosing an animation. A contrast may need a comparison, a process may need a flow, a statistic may need a counter, and a warning may need a restrained callout.

- Establish one focal point per beat, clear hierarchy, stable margins and adequate holds.
- Start movement from the speaker's cadence or a narrative transition. Do not schedule changes merely to fill time.
- Drive every rendered animation with `useCurrentFrame()`, `interpolate()` or `spring()` and clamp interpolation.
- Use springs for organic landings and bezier easing for deliberate travel. Limit overshoot around text and factual graphics.
- Stagger related items by small frame offsets when this explains order. Simultaneous entrance is correct when items form one unit.
- Combine properties only when useful: position plus opacity often reads well; scale is optional.
- Animate exits when the next shot needs visual continuity. A hard cut is often stronger than a decorative transition.
- Use the restrained component library in `src/components/`. Extend it by meaning, not by visual novelty.
- Text and graphics stay legible during motion. Avoid random bounce, perpetual micro-motion, compulsory grain, decorative glow or unsupported fake data.
- Use sound selectively: an impact can support a major claim; a whoosh can bridge a spatial transition; repeated clicks can fatigue the viewer.

Always render frames around entrances, holds, transitions and exits. Fix spacing, overflow, z-order and motion state before delivery. See `references/visual-language.md`.
