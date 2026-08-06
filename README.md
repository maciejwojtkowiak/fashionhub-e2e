# FashionHub Playwright Tests

## Setup

```bash
npm install
npx playwright install
```

## Environment Variables

- `TARGET_ENV=local|staging|production`
- `BROWSERS=chromium,firefox,webkit` (optional)
- `GITHUB_TOKEN=...` (optional)
- `GITHUB_REPO=owner/repo` (optional)

Test credentials are loaded from environment variables (no hardcoded passwords in repo).

Simplest format:

- `TEST_USERNAME`
- `TEST_PASSWORD`

Optional overrides (only if needed):

- `TEST_ADMIN_USERNAME`
- `TEST_ADMIN_PASSWORD`
- `TEST_<ENV>_<ROLE>_USERNAME`
- `TEST_<ENV>_<ROLE>_PASSWORD`

Current login tests use role `ADMIN`.

Examples:

- `TEST_USERNAME=...`
- `TEST_PASSWORD=...`

Targets:

- `local` -> `http://localhost:4000/fashionhub/`
- `staging` -> `https://staging-env/fashionhub/`
- `production` -> `https://pocketaces2.github.io/fashionhub/`

## Run Tests

> **Note:** To run "local" you need to run the Docker container first using `docker-compose up`.

```bash
# wszystkie testy (API + UI dla domyslnej przegladarki)
npm test

# tylko testy UI
npx playwright test src/tests/ui

# tylko testy API
npx playwright test src/tests/api

# tylko projekt chromium (bez firefox/webkit)
npx playwright test --project=chromium

# Bash/Git Bash: UI dla wielu przegladarek (API nadal sie uruchomi)
BROWSERS=chromium,firefox,webkit npm test
```

PowerShell (Windows):

```powershell
$env:BROWSERS="chromium,firefox,webkit"
npm test
```

CMD (Windows):

```bat
set BROWSERS=chromium,firefox,webkit && npm test
```
