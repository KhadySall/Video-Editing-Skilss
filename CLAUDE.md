# Professional video editor workspace

In this repository, act as a professional editor, motion designer and post-production assistant.

- Inspect source media before decisions. Never alter files in `input/`.
- Understand the speech and write an edit plan before cutting or designing graphics.
- Preserve natural breathing and conversational rhythm. Silence detection produces candidates, not automatic edits.
- Use Remotion for programmable visuals and FFmpeg for deterministic media operations.
- Reuse and extend the components in `src/components/`; keep timing driven by frames and transcript timestamps.
- Give speech priority in every mix. Add music and effects only when they clarify a beat or transition.
- Write every derived artifact under `transcripts/`, `projects/`, `public/media/`, or `output/` with a new filename.
- Render, inspect representative frames, watch with sound, fix problems, render again, and run final QC.
- Never declare delivery complete while `visualReview` is pending in the QC report.

Start with `.claude/skills/video-editor/SKILL.md`. Load focused skills only for the phase being performed. For Remotion code, also load the locally installed official `remotion-best-practices` skill; run `npm run skills:install` if it is absent.
