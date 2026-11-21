# Leonida Trophy Guide — GTA VI

[![make.fun](https://img.shields.io/badge/make.fun-gta6--trophy--guide--01-ff6b4a)](https://make.fun/c/gta6-trophy-guide-01)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Offline](https://img.shields.io/badge/offline-static%20files-7fd6a4)](app/index.html)

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI
(1 platinum, 2 gold, 6 silver, 46 bronze, 28 hidden), built for the
[make.fun competition gta6-trophy-guide-01](https://make.fun/c/gta6-trophy-guide-01).

Open `app/index.html` in a desktop browser — or serve `app/` with any static
server (`node serve.ts` → http://localhost:8080). No network, no account,
no tracking: the page loads nothing beyond its own files.

## What it does

- **Every trophy** with its official name, description and grade, as Exophase
  and PSNProfiles published the list (frozen 18 November 2026).
- **Checklist saved in the browser** (localStorage), with **export and import**
  of progress as a JSON file, plus reset.
- **Filters** by kind (story, missable, strangers, collectibles, activities,
  crime & combat, money & property, exploration, secrets, 100% completion),
  by grade, by earned-only, and full-text search.
- **Spoiler setting** (on by default) that hides the names and descriptions of
  story trophies until they are earned.
- **Roadmap to the platinum** in six stages, built from the official
  descriptions: story, strangers, activities, collectibles, crime & money,
  then secrets and 100% completion.
- **Missables flagged**: exactly one trophy is flagged as possibly missable
  (Positive Mental Attitude — meditate at every spot; PowerPyx / GTABase flag
  it, and the guide says the evidence is not yet confirmed). The other 54 are
  not missable.
- **A guide to each trophy in this entry's own words** — what to do, where and
  how, when it can be missed — with its sources named beside it. Five cryptic
  trophies give no actionable instruction in their descriptions, so their
  guides say the method is unconfirmed rather than inventing steps. A source
  is cited, never copied.

## Honesty notes

- The game launched 19 November 2026; no guide was checked by playing it.
  Each guide says where its facts come from, and where a method is
  unconfirmed.
- There are **no online trophies** — all 55 are offline single-player.
  Using cheats disables trophies (PowerPyx, via Planet GTA 6), so the roadmap
  says to leave them off.
- The look is original: no Rockstar logo, no official artwork, no game
  screenshots. Unofficial fan guide, not affiliated with Rockstar Games or
  Sony Interactive Entertainment.

## Files

| Path | What it is |
| --- | --- |
| `app/index.html` | The guide (single page, four views) |
| `app/css/style.css` | Original "Vice dusk" theme |
| `app/js/app.js` | Checklist, filters, spoiler rule, roadmap, export/import |
| `app/data/trophies.json` | The 55 trophies with guides and sources |
| `scripts/build-data.mjs` | Generates `app/data/trophies.json` from the authored data |
| `screenshots/` | 4 renders of the guide running |
| `main.ts` | Entry program: copies `app/` + `screenshots/` to `/output`, writes `dossier.json` |
| `vendor/makefun-frontend.ts` | make.fun library, unchanged from the kit |
| `serve.ts` | Tiny static server for local testing |

Build the dossier locally:

```sh
node scripts/build-data.mjs
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).
