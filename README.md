# video-editing-skills

A speech-first Claude Code workspace for professional vertical social edits. It combines editorial planning, local transcription, conservative speech cleanup, reusable Remotion motion graphics, styled captions, original sound design, FFmpeg post-production and a mandatory render-review-fix loop.

The default deliverable is 1080x1920 H.264/AAC MP4 for TikTok, Instagram Reels, LinkedIn and YouTube Shorts. The system is brand-agnostic.

## What is included

- Project-level Claude skills under `.claude/skills/`, led by `video-editor`
- Official Remotion Agent Skills installer pinned to the audited revision
- Typed transcript and edit-list contracts with timestamp remapping
- Safe FFmpeg wrappers for probing, audio extraction, pause candidates, speech cuts, two-pass loudness normalization and QC
- Reusable captions, progress, counters, comparisons, cards, checklists, callouts and transitions
- An original, locally generated sound kit: soft click, low impact, short whoosh, success chime and music bed
- A 14.4-second vertical demonstration with audio, timed captions and technical QC

## Install

Install Node.js 22 or 24 and FFmpeg 6 or newer (`ffmpeg` and `ffprobe` must be on `PATH`). Remotion's license is free for individuals, nonprofits, evaluation and for-profit organizations with up to three employees; larger for-profit organizations need a Remotion company license. Read `THIRD_PARTY_NOTICES.md`.

```text
npm install
npm run skills:install
npm run doctor
npm test
npm run typecheck
```

`skills:install` retrieves the official Remotion skill at the audited commit. It is installed locally and ignored by Git because the source repository does not carry a standalone redistribution license. This workspace already has that local installation.

For transcription, create an optional Python environment and install the local engine:

```text
python -m venv .venv
.venv\Scripts\python -m pip install -r requirements-transcription.txt
```

On macOS/Linux, activate with `source .venv/bin/activate`. See `docs/INSTALLATION.md` and `docs/TRANSCRIPTION.md`.

## Open in Claude Code

If Claude Code is not installed on Windows, run `winget install Anthropic.ClaudeCode`. Then open PowerShell:

```powershell
cd "C:\Users\sarah\OneDrive - IPSA\Documents\ChatGPT\AI Capcut"
claude
```

Accept workspace trust, then run `/skills` and confirm `video-editor`, `speech-editing`, `captions`, `motion-design`, `ffmpeg-post-production`, `video-quality-control` and `remotion-best-practices` are visible. If the skill directory was created after Claude started, restart Claude once.

## Add and edit a real video

Copy a source file without renaming or modifying it, for example:

```text
input/career-advice-01.mp4
```

Give Claude this first prompt:

```text
Edit input/career-advice-01.mp4 as a professional vertical social video.

Analyze the speech first and create a timestamped transcript with word timings. Remove only confirmed dead air, mistakes or repeated takes while preserving natural rhythm. Create and save an editorial plan before changing the media. Build restrained motion graphics that explain the ideas, use professional captions, and add music or sound effects only where they support a narrative beat. Render at 1080x1920, normalize the final mix for speech-led social delivery, inspect representative frames and watch the complete render with sound. Fix every visual, timing or audio problem you find and repeat QC before delivery. Keep the source untouched and save the final file to output/career-advice-01-final.mp4.
```

For a revision, name the evidence and desired change: “At 00:14 the caption covers the diagram. Move it above the card, keep its timing, render `v2`, and repeat visual and audio QC.” Claude should never overwrite the prior render.

## Commands

```text
npm run studio
npm run media -- inspect input/video.mp4 projects/name/source-probe.json
npm run media -- silence input/video.mp4 projects/name/silence-candidates.json
npm run media -- cut input/video.mp4 projects/name/edit-plan.json output/name-clean.mp4
npm run transcript -- validate transcripts/name-source.json
npm run transcript -- remap transcripts/name-source.json projects/name/edit-plan.json transcripts/name-edited.json
npm run transcript -- srt transcripts/name-edited.json output/name.srt
npm run media -- normalize output/name-master.mp4 output/name-final.mp4
npm run media -- qc output/name-final.mp4 output/name-qc
npm run demo
```

Each output command refuses to overwrite existing files. Use revision filenames such as `v2`.

## Media files and Git

Raw media, generated assets, renders, caches and frame sequences are ignored. Commit edit plans, code, transcripts only when privacy permits, and documentation. Use Git LFS only when the team deliberately versions large, reusable licensed assets; do not use it for temporary renders or raw client media.

Start with `docs/WORKFLOW.md`. The external audit and license decisions are in `docs/SOURCE_AUDIT.md`.
