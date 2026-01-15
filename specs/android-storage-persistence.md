# Android PWA Storage Persistence

## Problem Statement

User data stored in localStorage is sporadically lost on Android PWA after extended periods. The app resets to blank state, losing all saved contact and link information.

## Root Cause Analysis

The app uses `react-secure-storage` which encrypts data using a browser fingerprint-derived key. When the fingerprint changes (Chrome updates, WebView rotation, OS updates), previously saved data becomes undecryptable and returns `null`.

Additionally:
- No persistent storage has been requested via `navigator.storage.persist()`
- No service worker exists, reducing PWA "permanence" signals to Android

## Requirements

### 1. Replace `react-secure-storage` with Plain localStorage

**Rationale**: The encryption provides no meaningful security benefit—data is user-controlled personal info on their own device. The device lock screen is the security boundary. The encryption makes data MORE fragile, not more secure.

**Implementation**:
- Remove `react-secure-storage` dependency
- Replace all `secureLocalStorage` calls with native `localStorage`
- Maintain existing key names (`formValues`, `linkValues`)
- Keep JSON.stringify/parse pattern for objects
- Add try/catch for parse errors with graceful fallback to empty state

**Migration**: 
- On first load after update, attempt to read existing `react-secure-storage` keys
- If readable, migrate to plain localStorage keys
- If not readable (fingerprint changed), accept data loss (unavoidable)

### 2. Request Persistent Storage

**Implementation**:
- On app init, call `navigator.storage.persist()` 
- Log result for diagnostics
- Don't block on result—it's a hint to the browser

**Location**: Add to `_app.js` useEffect on mount

### 3. Add Storage Diagnostics

**Implementation**:
- Log storage quota and usage on app init
- Log when data is read (success/failure)
- Log when data is written
- Use structured console logs that can be filtered

**Purpose**: Enable debugging for any future storage issues

### 4. Optional: Add Service Worker

**Scope**: Basic offline shell, no complex caching
**Rationale**: Helps Android treat PWA as "real app" with more durable storage
**Priority**: Lower than items 1-3

## Acceptance Criteria

- [ ] App retains user data across Android PWA sessions reliably
- [ ] No dependency on browser fingerprint for data access
- [ ] Persistent storage requested on init
- [ ] Storage operations logged for diagnostics
- [ ] Graceful handling of corrupted/missing data (empty state, not crash)
- [ ] Existing users who CAN read their old data get it migrated
- [ ] Existing users who CANNOT read their old data see empty state (not error)

## Files to Modify

- `pages/_app.js` - Storage context, init logic
- `package.json` - Remove `react-secure-storage`

## Files to Potentially Add

- `public/sw.js` - Basic service worker (optional)
- `utils/storage.js` - Storage helper with logging (optional, could inline)

## Testing Notes

- Cannot reliably reproduce the original bug in development
- Success = no further user reports of data loss after deployment
- Can verify migration logic by manually testing with/without old storage keys
