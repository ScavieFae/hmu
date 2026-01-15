# AGENTS.md

## Project Overview

Next.js 12 PWA for sharing contact info via QR codes. Deployed on Vercel.

## Build & Run

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server  
npm start
```

## Validation

```bash
# Lint
npm run lint

# Build (validates compilation)
npm run build
```

Note: No test suite currently exists. Validation is build + lint.

## Project Structure

- `pages/_app.js` - App wrapper, storage context, data loading
- `pages/*.js` - Route pages
- `components/*.js` - React components
- `public/manifest.json` - PWA manifest
- `styles/` - CSS files

## Storage Implementation

Currently uses `react-secure-storage` in `pages/_app.js`:
- `formValues` - User contact info (name, phone, email, url, vibe)
- `linkValues` - Social links (instagram, twitter, linkedin, venmo, custom)

Data flow:
1. Load from storage on mount (`useEffect` with empty deps)
2. Write to storage via custom setters (`setFormValues`, `setLinkValues`)
3. Storage context shared via React Context API

## Deployment

Vercel auto-deploys from git push. No manual deployment needed.

## Codebase Patterns

- Functional components with hooks
- Context API for global state (no Redux)
- Tailwind CSS for styling
- QRCode library for QR generation
