# Audio and sound design

Speech leads the mix. Clean only audible problems, use gentle fades at edits, and monitor on headphones plus a phone speaker. The final helper targets -16 LUFS integrated, -1.5 dBTP and LRA 11 using measured two-pass EBU R128 normalization.

Run `npm run sfx:generate` to create five original 48 kHz mono WAV files under `public/demo/sfx/`: `click-soft`, `impact-low`, `whoosh-short`, `success-chime`, and `music-bed`. The script is the source and may be changed to generate a project-specific palette. These assets contain no third-party samples.

Use impact for a major claim, whoosh for an actual spatial transition, click for a small UI confirmation, and chime for a resolved positive beat. Place a transient slightly before the visual landing when it feels perceptually synchronized. Keep music low under speech; automate or duck it when intelligibility drops. Avoid filling every cut with a sound.

For external music or effects, record source URL, creator, license, download date, consent where relevant, and allowed platforms in `projects/<name>/assets.json`. Never assume “royalty-free” means attribution-free or cleared for commercial social platforms.
