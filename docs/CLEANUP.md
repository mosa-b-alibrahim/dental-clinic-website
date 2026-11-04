# Cleanup record — 2026-11-04

A complete ZIP backup was created and checked **before** source changes:

`Dental Clinic Website-backup-20261104-172014.zip`

The backup is stored beside the project, outside the Git repository. It contains 12,530 entries, including source, assets, `.git`, installed dependencies, local tools and prior verification screenshots. The source inside the archive was checked against the original working files.

## Source cleanup

- Consolidated global layout and theme styles into `src/index.css`; removed the separate override-only theme stylesheet.
- Removed 92 CSS rules for unused classes and 212 declarations overwritten by later declarations with the same selector and condition. Removed unreferenced custom properties.
- Removed Tailwind and its Vite plugin because the interface uses custom CSS rather than utility classes. Retained the relevant native-control resets and desktop container limit so the existing appearance is preserved.
- Removed the unused YAML parsing dependency.
- Formatted TypeScript, JSX, CSS, HTML and configuration consistently with Prettier.
- Moved language and theme state into `src/hooks/`.
- Separated appointment validation and WhatsApp URL preparation into `src/lib/booking.ts`, with a typed success/error result.
- Replaced parallel navigation arrays and numeric labels with named section keys shared by the header and footer.
- Removed unused translation entries for retired content.
- Added a shared lazy-image loading helper for browser tests, fixing an existing tablet preload race without weakening assertions.
- Replaced obsolete redesign reports with current documentation under `docs/`.
- Archived the empty duplicate project folder and retired local helper files outside the repository after verification, under `Dental Clinic Website-cleanup-archive-20261104` beside the project. Installed dependencies and build/test outputs stay local and are ignored by Git.

The five service groups, treatment details, clinic destinations, contact form, hero layout, theme preferences and bilingual behavior are preserved. No image was edited by the cleanup. During the session, `treatment-room.jpg` and `waiting-room.jpg` changed independently in the working folder; their current versions were kept, and the earlier versions remain in the complete backup.

## Repository preparation

- Added `.editorconfig`, `.gitattributes`, `.prettierrc.json`, `.prettierignore` and `.nvmrc`.
- Enabled TypeScript checks for unused locals, unused parameters and switch fallthrough.
- Added `typecheck`, `format`, `format:check` and `check` scripts.
- Added CI for formatting, types, production build and browser tests.
- Retained GitHub Pages deployment and repository-based asset paths, adding the source checks before its build.
- Updated the README with installation, project structure, testing and first-push instructions.

At the end of the cleanup, before the subsequent publication request, no Git commit, remote configuration, push or deployment had been performed. Publication instructions and the site URL are maintained in the main README.

See [verification results](VERIFICATION.md) for the final checks and known limits.
