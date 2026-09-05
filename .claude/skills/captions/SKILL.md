---
name: captions
description: Design accurate mobile captions from timestamped transcripts. Use for subtitle timing, page grouping, highlighted words, line breaking, safe zones, SRT export or burned-in social captions.
---

# Captions

- Use the Remotion `Caption` data shape: `text`, `startMs`, `endMs`, `timestampMs`, `confidence`, optional `pageBreakAfter`.
- Caption from the edited timebase. Refuse source-time captions over a cut master.
- Keep pages short: normally 2-5 words, up to 28 characters, broken at punctuation, meaning boundaries or pauses over 450 ms.
- Preserve punctuation and casing that aid comprehension. Do not display transcription filler that the edit removed.
- Highlight the active word only when it improves following; use a color or weight change without shifting layout.
- At 1080x1920, keep critical caption text inside the project safe zone. Check the longest word at real render size.
- Avoid more than two lines. Do not cover faces, diagrams or platform controls. Move captions by scene if necessary.
- Review synchronization at normal speed and near cuts. Export an SRT for accessibility or platform upload even when captions are burned in.

The shared paginator lives in `src/utilities/timeline.ts`; the reusable renderer is `src/components/Caption.tsx`.
