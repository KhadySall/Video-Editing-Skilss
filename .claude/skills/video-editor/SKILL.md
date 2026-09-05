---
name: video-editor
description: Orchestrate complete speech-first professional video edits from raw media through editorial analysis, captions, motion graphics, audio post, rendering, visual inspection, correction and delivery. Use for any request to edit, polish, subtitle, animate or deliver a social video.
---

# Video editor

Treat editing as editorial judgment supported by tools. Story, speech clarity and viewer comprehension lead; effects follow.

## Required workflow

1. **Inspect.** Run `npm run doctor`, then `npm run media -- inspect <input> projects/<name>/source-probe.json`. Record streams, duration, frame rate, rotation, color and audio facts. Keep the source untouched.
2. **Transcribe.** Extract 16 kHz mono audio if useful, then follow `speech-editing`. Produce word timestamps in the shared transcript schema. Validate them.
3. **Understand.** Read the transcript. Identify hook, thesis, evidence, examples, contrasts, lists, transitions, warnings, payoff and CTA. Note uncertainty instead of inventing meaning.
4. **Plan.** Create `projects/<name>/edit-plan.json`. For each beat record source range, purpose, caption intent, visual treatment, audio cue and reason. Prefer meaningful visual changes over fixed intervals.
5. **Clean speech.** Detect candidate pauses and review waveform, transcript and listening context. Retain natural pauses. Approve every cut in a keep-list before running the cut command.
6. **Remap.** After cutting, remap source timestamps exactly once with `npm run transcript -- remap ...`. If a boundary crosses a word, move it or re-transcribe the edited media.
7. **Compose.** Load official `remotion-best-practices` and `motion-design`. Use source footage as the base when present; create visuals around audio-only or black footage. Build meaning from type, diagrams, comparisons and data.
8. **Caption.** Load `captions`. Generate pages from the edited transcript, then review wording, line breaks, reading speed and safe-zone placement.
9. **Audio.** Load `ffmpeg-post-production`. Clean only audible problems, mix for speech intelligibility, and place restrained effects 1-3 frames before visual impacts when perceptually appropriate.
10. **Render.** Render a review file. Do not normalize a source file in place.
11. **Inspect and fix.** Load `video-quality-control`. Extract beginning, quartile, transition and ending frames. Watch the full video with sound. Correct visual, editorial, timing and audio issues, then re-render.
12. **Final QC and delivery.** Normalize the approved master, run QC on the resulting MP4, complete the visual-review field, and deliver a separate final filename under `output/`.

## Hard gates

- No edit plan before transcript review.
- No automated deletion based only on amplitude or VAD.
- No word-timed graphics derived from an unremapped source transcript after cuts.
- No unsupported statistics or fake UI claims.
- No final delivery without a rendered MP4, technical QC and human-visible frame inspection.

Use `projects/template/` as the contract between phases. Update status and decisions so another session can resume safely.
