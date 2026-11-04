# Dental Clinic · العيادة السنية

Arabic/English clinic website for **Dr. Mousa Bashar Al Ibrahim** in Al-Tah village. Built with React, TypeScript and Vite, using plain CSS, Lucide icons and Motion.

The site includes five service groups, the original doctor and clinic photographs, an accessible gallery viewer, and one combined contact/appointment section. Appointments open a WhatsApp draft and require confirmation from the clinic. No patient information is saved by the website.

## Run locally

Use Node.js **22.12 or newer**. The project pins Node 22 for CI and provides `.nvmrc`.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite, normally `http://127.0.0.1:5173/dental-clinic-website/`.

## Commands

| Command                | Purpose                                                |
| ---------------------- | ------------------------------------------------------ |
| `npm run dev`          | Development server with live reload                    |
| `npm run typecheck`    | TypeScript, including unused imports and parameters    |
| `npm run format`       | Format source, styles and configuration with Prettier  |
| `npm run format:check` | Check formatting without changing files                |
| `npm run check`        | TypeScript and formatting checks                       |
| `npm run build`        | TypeScript validation and production output in `dist/` |
| `npm run preview`      | Serve the production build locally                     |
| `npm test`             | Playwright browser tests                               |

## Project structure

```text
.github/workflows/  Checks and GitHub Pages deployment
public/             Favicon and original images
src/components/     Page sections and reusable UI
src/data/           Clinic links, navigation, translations and service groups
src/hooks/          Language and theme preferences
src/lib/            Booking validation and WhatsApp message preparation
src/index.css       Shared styles, design tokens and responsive layouts
src/main.tsx        Application entry point
src/App.tsx         Page composition and shared service selection
src/components/Services.css  Service card styles
tests/             Browser and interaction tests
docs/              Verification and cleanup notes
```

## Content and behavior

- **Contact destinations:** `src/data/clinic.ts` contains the verified phone, WhatsApp and Google Maps links.
- **Languages:** `src/data/translations.ts` contains Arabic/English UI copy. Navigation uses named section keys rather than parallel array positions.
- **Services:** `src/data/serviceGroups.ts` is the single source for all five groups, their detailed treatments, images and appointment options.
- **Themes:** Light, Dark and System are supported. `src/hooks/useTheme.ts` follows the system preference and saves the selected option. A small script in `index.html` resolves the theme before React loads.
- **Storage:** Only language and theme preferences are saved in localStorage. Both controls continue working when storage is unavailable.
- **Photos:** Original assets in `public/images/` remain unchanged. Image URLs use Vite's base path. Service images load lazily.
- **Fonts:** Cairo and Inter load from Google Fonts, with local system fallbacks.
- **Optional video:** Add `public/videos/clinic-promo.mp4` and rebuild to enable the existing video section. Supply captions or a transcript for speech. The default project contains no promotional video.

## Browser tests

Install the test browser once:

```sh
npx playwright install chromium
npm test
```

Alternatively, use an installed Google Chrome on Windows:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'chrome'
npm test -- --workers=2
```

Tests cover both languages, both appearances, system-theme changes and persistence, seven viewport widths, image loading, responsive navigation, service details and preselection, gallery keyboard controls, contact links, and WhatsApp validation/encoding. Screenshots are written to the ignored `test-results/` directory. Video-absence assertions assume the optional video is not installed.

See [verification notes](docs/VERIFICATION.md) and the [cleanup record](docs/CLEANUP.md).

## Repository

The source repository is [mosa-b-alibrahim/dental-clinic-website](https://github.com/mosa-b-alibrahim/dental-clinic-website).

Commit `package-lock.json` with the source. Dependency folders, builds, test screenshots, local tools, environment files and ZIP backups are excluded by `.gitignore`. `hero.png` is included for this README preview and is not required by the deployed application.

`test-results/` contains generated local QA artifacts and is never published. `docs/` contains optional source documentation; the deployment uploads only `dist/`, so the documentation is not part of the live website.

## GitHub Pages

In the repository, select **Settings → Pages → Build and deployment → Source → GitHub Actions**.

- `ci.yml` checks formatting, types, build and browser behavior on pushes to `main` and pull requests.
- `deploy.yml` checks and builds the site, then deploys it on pushes to `main` or manual execution. It derives the Vite base from the repository name.
- After a successful deployment, the expected URL is `https://mosa-b-alibrahim.github.io/dental-clinic-website/`. The deployment workflow reports the actual URL.

The default local base is `/dental-clinic-website/`. For a different local base, copy `.env.example` to `.env.local` and set `VITE_BASE_PATH`. For a custom domain or account-root site, use `/` and update the workflow's base accordingly.

Live website: **https://mosa-b-alibrahim.github.io/dental-clinic-website/**
