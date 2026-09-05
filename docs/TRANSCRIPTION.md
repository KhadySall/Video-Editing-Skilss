# Local transcription

The supported optional engine is `faster-whisper`, an open implementation using CTranslate2. It supports word timestamps, CPU int8 inference and local processing. No paid API is required.

```text
python scripts/transcribe.py input/video.mp4 transcripts/video-source.json --model small
npm run transcript -- validate transcripts/video-source.json
```

Use `--language en` or another ISO language hint when automatic detection is wrong. `--device cuda` uses a compatible NVIDIA setup. `--offline` forbids model downloads and requires the requested model in `.cache/whisper/`.

Whisper timestamps are estimates. Review names, numbers, acronyms, low-confidence words, overlaps and words near cuts. Keep the original ASR output and corrected editorial transcript separate when traceability matters. After speech cuts, remap once with the keep-list; re-transcribe edited audio when accumulated drift is audible.

The JSON contract is `version`, `timebase`, `language`, `durationMs`, and ordered `words` using Remotion's caption shape. `sentences`, `warnings` and `engine` are optional provenance fields.
