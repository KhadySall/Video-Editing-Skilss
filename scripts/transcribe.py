"""Local transcription; no audio upload. Model weights download on first use."""
import argparse
import json
from pathlib import Path

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input")
    parser.add_argument("output")
    parser.add_argument("--model", default="small")
    parser.add_argument("--language", default=None)
    parser.add_argument("--device", choices=["cpu", "cuda"], default="cpu")
    parser.add_argument("--offline", action="store_true")
    args = parser.parse_args()
    source, output = Path(args.input).resolve(), Path(args.output).resolve()
    if output.exists() or source == output:
        raise SystemExit("Use a new output filename")
    if output.is_relative_to(Path("input").resolve()):
        raise SystemExit("Do not write derived files under input/")
    from faster_whisper import WhisperModel
    model = WhisperModel(args.model, device=args.device,
                         compute_type="int8" if args.device == "cpu" else "float16",
                         download_root=".cache/whisper", local_files_only=args.offline)
    segments, info = model.transcribe(str(source), language=args.language,
                                      word_timestamps=True, vad_filter=True,
                                      condition_on_previous_text=False,
                                      vad_parameters={"min_silence_duration_ms": 500})
    words, sentences, warnings = [], [], []
    for segment in segments:
        sentences.append({"startMs": round(segment.start * 1000),
                          "endMs": round(segment.end * 1000), "text": segment.text})
        for word in segment.words or []:
            start, end = round(word.start * 1000), round(word.end * 1000)
            if end <= start or (words and start < words[-1]["endMs"]):
                warnings.append({"text": word.word, "startMs": start, "endMs": end,
                                 "issue": "Invalid or overlapping timing; review before captions"})
            words.append({"text": word.word, "startMs": start, "endMs": end,
                          "timestampMs": round((start + end) / 2), "confidence": word.probability})
    if not words:
        raise SystemExit("No speech recognized; inspect audio and language before continuing")
    result = {"version": 1, "timebase": "source", "language": info.language,
              "durationMs": round(info.duration * 1000), "words": words,
              "sentences": sentences, "warnings": warnings,
              "engine": {"name": "faster-whisper", "model": args.model}}
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("x", encoding="utf-8") as stream:
        json.dump(result, stream, ensure_ascii=False, indent=2)
    print(f"Wrote {len(words)} words; {len(warnings)} timing issues require review")

if __name__ == "__main__":
    main()
