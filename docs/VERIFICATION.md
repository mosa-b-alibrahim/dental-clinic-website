# Verification — 2026-11-04

These results record validation of the cleaned application before its first publication. The cleanup preserves the approved dental clinic interface and behavior.

## Checks

- **Passed:** `npm run check` — TypeScript validation, unused-code checks and formatting.
- **Passed:** `npm run build` — production Vite build with the existing GitHub Pages base path. Output CSS decreased from 54.25 kB to 39.65 kB (12.12 kB to 8.71 kB gzipped).
- **Passed: 53 tests (3.2 minutes).** `npm test -- --workers=2`, run locally with `PLAYWRIGHT_CHANNEL=chrome` because Google Chrome is installed. CI installs Playwright Chromium.
- **Passed: zero computed-style differences** across 16 combinations of Arabic/English, Light/Dark and 320, 390, 768 and 1440 pixel layouts. Compared layout, typography and surface properties before/after cleanup.
- Checked original image SHA-256 hashes: eight files match exactly. `treatment-room.jpg` and `waiting-room.jpg` changed independently during the session; cleanup did not edit assets or restore over those changes. The complete backup retains their earlier versions.
- Inspected the Git candidate list to exclude dependency folders, generated builds, screenshots, tools, backups and local environment files.

The browser suite covers 53 cases, including seven viewport widths, no horizontal overflow, language switching, theme persistence/system changes, unavailable storage, pre-React theme initialization, service details, keyboard controls, booking preselection, form validation, WhatsApp URL generation, original contact destinations, compact unified contact navigation, single hover indicators and a non-overlapping hero smile decoration.

A separate temporary checkout also completed **`npm ci` and a production build successfully**, confirming that the lockfile works without the existing dependency directory. The isolated checkout was created under the system temporary directory and is outside the repository.

An initial browser run exposed a pre-existing lazy-image preload race at 768px. The shared image helper now scrolls each lazy image into view and verifies all image URLs; the final complete browser run passed.

## Local artifacts

Screenshots are generated under ignored `test-results/`. Full-page names use `ux-{language}-{theme}-{width}.png`. Section captures add suffixes such as `-home`, `-services`, `-contact` or `-viewer`. These files can be regenerated with the browser tests.

## Limits

- Browser verification uses desktop Chrome with simulated viewport sizes, not physical mobile devices or every browser engine.
- Clinic photographs remain in their original resolution and color, so some assets are large.
- Google Fonts has system-font fallbacks.
- The original Google Maps URL is retained. A previous network check timed out, so external location availability was not independently confirmed.
- Booking tests intercept `window.open`; they generate the WhatsApp URL without sending a message.
- Optional video absence is the default test expectation. Add captions/transcripts if enabling the optional promotional video later.
