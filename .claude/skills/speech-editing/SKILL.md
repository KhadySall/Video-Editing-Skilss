---
name: speech-editing
description: Transcribe and edit talking-head or spoken media while preserving natural rhythm. Use for timestamps, pause detection, dead-air removal, false starts, repetitions, transcript remapping or speech cuts.
---

# Speech editing

1. Inspect the real audio stream; listen before diagnosing noise or pauses.
2. Prefer local `faster-whisper` with word timestamps. See `docs/TRANSCRIPTION.md`.
3. Store the raw transcript as source time. Correct obvious recognition errors without changing timestamps.
4. Run `npm run media -- silence <input> <candidates.json>` for review candidates. Its `-35 dB / 650 ms` defaults are a starting point, not an edit decision.
5. Remove false starts and repetitions only after confirming their meaning by listening. Keep hesitation that communicates thought, emphasis or emotion.
6. Add boundary room for consonants and breaths. Avoid cuts inside words and immediately after plosives. Prefer 80-180 ms of context, adjusted by ear.
7. Express the result as ordered `keep` intervals with a reason for each interval. Run the deterministic cut script.
8. Remap timestamps once. Validate the edited transcript against the edited audio and re-transcribe if timing drift is audible.

VAD can propose speech regions; it cannot identify a rhetorically useful pause, a bad take, or the best performance. Never accept its output as an edit decision without transcript and listening context.
