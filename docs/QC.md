# Quality control

`npm run media -- qc` verifies decode integrity, stream formats, geometry, duration agreement, loudness, likely black segments, and extracts six representative frames. It cannot judge taste, meaning, sync or speaker performance.

Open all extracted frames and add samples around every transition. Check faces, crop, hierarchy, caption safe zones, longest words, graphic truthfulness, contrast, continuity and the final frame. Watch the complete video with sound at normal speed and inspect problem cuts more slowly. Compare the final render rather than a Remotion preview.

Create a new QC directory per revision. A report passes only after its technical errors are empty and a reviewer replaces the pending visual-review text with evidence of the full playback and any corrections.
