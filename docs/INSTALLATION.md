# Installation

## Required

- Node.js 22 or 24
- npm 10 or newer
- FFmpeg and ffprobe 6 or newer
- Claude Code

Windows: install Claude Code with `winget install Anthropic.ClaudeCode`. Install an FFmpeg essentials build from the official FFmpeg download page's Windows providers, add its `bin` folder to `PATH`, and restart the terminal. This checked-out workspace also has a verified local FFmpeg 9.0.1 build in `.tools/ffmpeg/`; it is intentionally not committed.

macOS: `brew install node ffmpeg` and `brew install --cask claude-code`.

Debian/Ubuntu: install Node 22 from a maintained Node distribution, then `sudo apt install ffmpeg`. Install Claude Code with the current native installer from `https://code.claude.com/docs/en/setup`.

Verify with `node --version`, `npm --version`, `ffmpeg -version`, `ffprobe -version`, `claude --version`, then run `npm install`, `npm run skills:install`, and `npm run doctor`.

## Optional local transcription

Python 3.10-3.12 and `requirements-transcription.txt` provide faster-whisper. The first run downloads a model unless `--offline` is used. CPU `small` is the balanced default; use `base` for speed or a larger model when accuracy and hardware permit. Model files live in `.cache/whisper/` and are ignored.

## Remotion browser

Remotion downloads its compatible rendering browser on the first render. In restricted environments, point `REMOTION_BROWSER_EXECUTABLE` at a compatible Chromium or Chrome binary. Do not commit machine-specific paths.
