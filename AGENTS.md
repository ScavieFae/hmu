# AGENTS.md

## Project Overview

Next.js 12 PWA for sharing contact info via QR codes. Supports multiple contacts (max 2). Deployed on Vercel.

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

- `pages/_app.js` - App wrapper, storage context, multi-contact API, migrations
- `pages/*.js` - Route pages (index, preview, create, links)
- `components/*.js` - React components
- `public/manifest.json` - PWA manifest
- `utils/storage.js` - Safe localStorage wrapper, contact helpers
- `utils/migration.js` - Migration from react-secure-storage (legacy)
- `styles/` - CSS files

## Storage Implementation

Uses plain localStorage via `utils/storage.js`:
- `safeGetItem(key)` - Returns parsed JSON or null
- `safeSetItem(key, value)` - Stringifies and writes, returns boolean
- `safeParseVibe(vibeString)` - Safe vibe parsing with Anon fallback
- `generateContactId()` - Creates unique contact IDs
- `createEmptyContact()` - Returns empty contact template
- `STORAGE_KEYS` - Centralized key constants
- `MAX_CONTACTS` - Limit (currently 2)

**Storage keys:**
- `contacts` - Array of contact objects (new multi-contact structure)
- `formValues` / `linkValues` - Legacy single-contact keys (for migration)
- `converted` - First form submit flag
- `MIGRATION_COMPLETE` - Legacy migration status
- `CONTACTS_MIGRATION_COMPLETE` - Multi-contact migration status

## Context API

```javascript
{
  contacts,           // Array of all contacts
  getContact(id),     // Get specific contact by ID
  setContact(id, data), // Update contact (id='new' creates new)
  deleteContact(id),  // Remove contact
  canAddContact,      // Boolean: contacts.length < MAX_CONTACTS
  storageError,       // Boolean: show error banner
  setStorageError     // Setter for error state
}
```

## Data Flow

1. Legacy migration runs on mount (react-secure-storage → localStorage)
2. Multi-contact migration runs (single contact → contacts array)
3. Load contacts array from storage
4. Context provides contact operations
5. Pages use query params (`?id=xxx`) to identify which contact
6. Forms save via `setContact(id, { formValues })` or `setContact(id, { linkValues })`

## Routing Patterns

- `/` - Home, shows all contact cards when in standalone mode
- `/preview?id=xxx` - Shows QR code and links for specific contact
- `/create?id=new` - Create new contact
- `/create?id=xxx&editing=true` - Edit existing contact
- `/links?id=xxx` - Edit links for specific contact

## Codebase Patterns

- Functional components with hooks
- Context API for global state (no Redux)
- Query params for contact identification (not URL paths)
- Tailwind CSS for styling
- QRCode library for QR generation

## Deployment

Vercel auto-deploys from git push. No manual deployment needed.
