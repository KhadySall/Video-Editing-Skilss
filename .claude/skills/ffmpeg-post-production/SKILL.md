---
name: ffmpeg-post-production
description: Use FFmpeg and ffprobe for deterministic media inspection, exact trims, concatenation, encoding, scaling, subtitle delivery, audio mixing, loudness normalization and social export.
---

# FFmpeg post-production

Use the cross-platform Node wrappers in `scripts/` before writing ad hoc shell commands. They pass arguments without a command shell, validate structured edit data, refuse existing outputs and protect `input/`.

```text
npm run media -- inspect input/video.mp4 projects/name/source-probe.json
npm run media -- extract-audio input/video.mp4 transcripts/name-16k.wav
npm run media -- silence input/video.mp4 projects/name/silence-candidates.json
npm run media -- cut input/video.mp4 projects/name/edit-plan.json output/name-clean.mp4
npm run media -- normalize output/name-master.mp4 output/name-final.mp4
npm run media -- qc output/name-final.mp4 output/name-qc
```

- Probe every input and map streams explicitly.
- Stream-copy only when keyframe precision and unchanged codecs are acceptable. Re-encode precise editorial cuts.
- Reset timestamps after each trim before concatenation.
- Use H.264, `yuv420p`, AAC 48 kHz and `+faststart` for broad social delivery.
- Use two-pass `loudnorm` for final speech-led output: target -16 LUFS integrated, -1.5 dBTP, LRA 11. Confirm measured output.
- Test hardware encoders before use and keep a software fallback.
- Keep lossless intermediates when another post step follows; use CRF 18 for high-quality social masters.
- Burn ASS/SRT when Remotion captions are inappropriate or a platform requires a deterministic subtitle pass.

FFmpeg performs media transforms. Remotion performs designed, frame-based visual composition. Keep that boundary explicit.
