---
name: video-quality-control
description: Inspect rendered video technically and visually, find defects, drive corrections and approve delivery. Use after renders, before delivery, or when checking captions, crops, synchronization, blank frames, transitions and loudness.
---

# Video quality control

Run `npm run media -- qc <render.mp4> <new-qc-directory> [expected-seconds]`. Treat the report as evidence, not approval.

## Technical review

- Confirm intended duration, 1080x1920 geometry, H.264, yuv420p, AAC, stream presence and decodability.
- Compare audio and video durations. Review detected black segments rather than automatically failing intentional black.
- Confirm final loudness is -16 +/-2 LUFS and true peak does not exceed -1 dBTP.

## Visual and editorial review

- Open every extracted frame. Add frames immediately before, during and after complex transitions.
- Check crop, face framing, readable type, platform safe zones, line breaks, contrast, z-order, blank states and overflow.
- Watch the complete render with sound. Check cuts, natural speech rhythm, caption timing, motion, music balance, effect timing and the final frame.
- Make concrete corrections, render a new revision and run QC into a new directory.
- Replace `PENDING` in `report.json` only after review, recording reviewer, date, playback method, issues and disposition.

Delivery requires a clean report and a listened-through final render.
