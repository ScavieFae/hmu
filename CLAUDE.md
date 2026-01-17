# hmu.world

Personal QR code sharing PWA. Forked from stedmanhalliday/hmu.

## Quick Start

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (also validates)
npm run lint    # eslint
```

No test suite — validation is build + lint.

## Architecture

- **Next.js 12** / React 17 / Tailwind
- **localStorage** for persistence (no backend)
- **Context API** in `_app.js` for contact state
- **PWA** — installable on mobile

## Key Files

- `pages/_app.js` — App wrapper, storage context, migrations
- `utils/storage.js` — localStorage wrapper, contact helpers
- `components/` — 15 React components
- `specs/` — Feature specs (multiple-contacts, android-storage)

## Data Model

Contacts array in localStorage. Each contact has:
- `id` — unique identifier
- `formValues` — name, headline, vibe (theme)
- `linkValues` — social links array

Max 2 contacts currently.

## Routing

Query params for contact identification:
- `/` — home, shows contact cards
- `/preview?id=xxx` — QR code view
- `/create?id=new` — new contact
- `/create?id=xxx&editing=true` — edit contact
- `/links?id=xxx` — edit links

## Git Remotes

- `origin` — ScavieFae/hmu (your fork)
- `upstream` — stedmanhalliday/hmu (original)
