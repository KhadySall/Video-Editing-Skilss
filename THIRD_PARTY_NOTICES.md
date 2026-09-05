# Third-party notices

This project contains original orchestration, components and scripts. The following sources informed its design or are runtime dependencies.

- [Remotion Agent Skills](https://github.com/remotion-dev/skills), audited revision `f54682712abc4a68cdc7c41513bd3b3298829873`. Installed locally unchanged by `npm run skills:install`; excluded from Git because the standalone repository has no license file.
- [Remotion](https://github.com/remotion-dev/remotion), version 4.0.521. Remotion's license permits free use for individuals, nonprofits, evaluation, and for-profit organizations with up to three employees; other for-profit use requires a company license. See `node_modules/remotion/LICENSE.md` and https://www.remotion.dev/license.
- [claude-remotion-skill](https://github.com/haidrrrry/claude-remotion-skill), audited revision `1dcbe5e3fc6cf970bd10d3cc05f0a8a5d19d0383`, MIT. Motion-design and verification ideas were reviewed; this repository contains independent implementations.
- [ffmpeg-video-editor](https://github.com/bryanwhl/ffmpeg-video-editor), audited revision `d5c3ee6e9896fdabccd4e8b5d68149252bbb682c`, MIT. FFmpeg workflow ideas were reviewed; this repository contains independent cross-platform implementations.
- [jordantobyll/video-editing-skills](https://github.com/jordantobyll/video-editing-skills), audited revision `4556bdf5d7505337045fb3ac528822259412ede2`. No license found; concepts only, no copied code or prose.
- [wilwaldon-claude-code-video-toolkit](https://github.com/iflow-mcp/wilwaldon-claude-code-video-toolkit), audited revision `a6e9e5225d85585472666598297f47d9584f9a97`. No license file found; coverage reference only.
- React and React DOM: MIT. Lucide React: ISC. Inter font: SIL Open Font License 1.1. TypeScript: Apache-2.0. `@remotion/captions`: MIT; other Remotion packages follow the Remotion package license.
- [faster-whisper](https://github.com/SYSTRAN/faster-whisper), optional local transcription dependency, MIT. Its transitive models and CUDA libraries may carry separate terms.
- FFmpeg is not redistributed in this Git repository. Installed binaries may be LGPL or GPL depending on build configuration; inspect the selected distribution before redistribution.

The audio produced by `scripts/generate-sfx.mjs` is synthesized from original code and contains no third-party samples.
