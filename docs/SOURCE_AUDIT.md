# Source audit

Audited on 2026-09-05. External code was treated as untrusted and no third-party script was executed.

## remotion-dev/skills

Revision `f54682712abc4a68cdc7c41513bd3b3298829873`, package version 4.0.521. Architecture: a router skill plus focused create, markup, captions, render, Studio, multimedia, docs, interactivity, maps, SaaS and upgrade skills with references and examples.

Retained through the unchanged local installer: frame-driven animation, clamped interpolation, `Sequence`, composition metadata, `staticFile`, media components, JSON captions, transition duration arithmetic, still rendering and the Studio/render workflow. This is the primary Remotion implementation authority.

The standalone repository has no license file. Its content is therefore fetched locally at the audited commit and excluded from this project's Git history. We did not copy its prose into our distributable skills. The Remotion software itself uses Remotion's current source-available license; users must confirm eligibility.

## remotion-dev/remotion and official documentation

The current Agent Skills, caption, media, render and license documentation was checked. Retained: current 4.0.521 package alignment, official package boundaries and the instruction to use matched Remotion package versions. We did not clone the large monorepo because the canonical skill package and official API docs covered the implementation surface needed here.

## haidrrrry/claude-remotion-skill

Revision `1dcbe5e3fc6cf970bd10d3cc05f0a8a5d19d0383`, MIT. Architecture: one motion-graphics skill, design and component references, a theme, demo compositions and deterministic audio generators.

Retained as principles and independently implemented components: visual verification, purposeful easing, stagger where order matters, shared design tokens, synthetic sound generation, frame samples and a render-fix-render loop. Rejected as universal rules: mandatory five-layer scenes, motion every 90 frames, animation of every still, compulsory grain, sound effects on every hit, and a ban on all linear timing. Those conflict with restrained editorial judgment and accessibility.

## bryanwhl/ffmpeg-video-editor

Revision `d5c3ee6e9896fdabccd4e8b5d68149252bbb682c`, MIT. Architecture: one broad skill, shell helpers, codec/filter/transition/hardware references and preset JSON.

Retained in independent cross-platform Node wrappers: probe-first work, explicit stream mapping, trim/reset/concat, H.264 yuv420p social output, frame extraction, two-pass EBU R128 normalization, decode validation and tested hardware-encoder guidance. Rejected: shell-only helpers, blind in-place overwrite patterns, commands that omit explicit codec/mapping decisions, and large effect catalogs in the default workflow.

## jordantobyll/video-editing-skills

Revision `4556bdf5d7505337045fb3ac528822259412ede2`. Architecture: talking-head VAD scripts plus a drone-oriented 3D transition package. No license file was present, so no code or prose was copied.

Retained only as independently implemented concepts: 16 kHz speech analysis, merging close speech regions, padded keep intervals, one-pass trim/concat and transcript time remapping. Rejected: `torch.hub.load(..., trust_repo=True)`, automatic model code execution, macOS-only `hevc_videotoolbox` defaults, forced 30 fps, affiliate/network content in the general editor, generic swivel teasers and automatic silence deletion. This project produces review candidates and requires reasons for approved intervals.

## iflow-mcp/wilwaldon-claude-code-video-toolkit

Revision `a6e9e5225d85585472666598297f47d9584f9a97`. The repository is a curated README rather than an implementation. It claims MIT in the README but has no license file in the checkout, so it was used only as a coverage checklist.

Retained: project lifecycle, resumable project records, awareness of screen recording and specialized Manim use. Rejected from the core: YouTube downloading, unrelated SaaS ecosystems, brand profiles, automatic screen recording and math-animation dependencies. They add operational and rights complexity without improving the primary talking-head workflow.

## Selected stack

Required: Node 22/24, React 19.2, TypeScript 5.9, Remotion 4.0.521, FFmpeg/ffprobe 6+, Inter and Lucide. Optional: Python 3.10-3.12 plus faster-whisper 1.2.1. Every runtime dependency has a direct role in editing, rendering, visual language, typography or local transcription.
