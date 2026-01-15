# Multiple Contacts

## Problem Statement

Users want to maintain separate contact personas for different contexts (e.g., professional vs. personal, work vs. side project). Currently the app supports only one contact with one set of links.

## Requirements

### 1. Data Model

**Structure**: Array of contact objects, each with unique ID:

```javascript
// New storage structure
contacts: [
  {
    id: "primary",           // or UUID
    formValues: { name, phone, email, url, vibe },
    linkValues: { instagram, twitter, linkedin, venmo, custom }
  },
  {
    id: "alternate",
    formValues: { ... },
    linkValues: { ... }
  }
]
```

**Storage key**: `contacts` (replaces separate `formValues` and `linkValues`)

**Limit**: Maximum 2 contacts for initial implementation.

### 2. Home View Changes

**When in standalone mode (PWA installed)**:

- Show all existing contacts as rows (using `<Contacts>` component)
- Each row displays that contact's name and vibe
- Clicking a row navigates to that contact's preview
- If fewer than 2 contacts exist, show "+ New contact" button below existing contacts
- If 0 contacts exist, show only "+ New contact" button (current behavior)

**Layout**:
```
┌─────────────────────────┐
│  🎨 Professional        │  ← Click → /preview?id=primary
└─────────────────────────┘
┌─────────────────────────┐
│  🎮 Personal            │  ← Click → /preview?id=alternate
└─────────────────────────┘
     [+ New contact]         ← Click → /create?id=new
```

### 3. Contact Routing

**Preview page** (`/preview`):
- Accept `?id=xxx` query parameter
- Display that specific contact's QR code and links
- Edit button edits that specific contact
- If no ID provided, default to first contact

**Create page** (`/create`):
- Accept `?id=xxx` for editing existing contact
- Accept `?id=new` for creating new contact
- Save updates the specific contact in the array
- After save, navigate to `/preview?id=xxx`

**Links page** (`/links`):
- Accept `?id=xxx` query parameter
- Edit links for that specific contact
- After save, navigate to `/preview?id=xxx`

### 4. Context API Changes

**Current**:
```javascript
{ formValues, setFormValues, linkValues, setLinkValues }
```

**New**:
```javascript
{
  contacts,                    // Full array
  getContact(id),              // Get specific contact
  setContact(id, data),        // Update specific contact (formValues + linkValues)
  addContact(data),            // Add new contact, returns new ID
  deleteContact(id),           // Remove contact (future)
}
```

### 5. Migration

**On app init**:
1. Check for old `formValues` key in storage
2. If exists AND new `contacts` key doesn't exist:
   - Create new structure with single contact (id: "primary")
   - Save to `contacts` key
   - Keep old keys for one version (don't delete yet)
3. If `contacts` exists, use it directly

**Migration code location**: `_app.js` useEffect on mount, before setting loading=false

### 6. Component Changes

**`<Contacts>` component**:
- Add `id` prop
- Pass `id` to router when navigating to preview
- No other changes needed (already receives name, vibe as props)

**`<Form>` component**:
- Read contact ID from router query
- Load specific contact's formValues
- Save to specific contact

**`<LinkForm>` component**:
- Read contact ID from router query
- Load specific contact's linkValues
- Save to specific contact

**`<EditPane>` component**:
- Pass contact ID to edit routes

## Acceptance Criteria

- [ ] Home shows all contacts as separate rows
- [ ] Each contact navigates to its own preview
- [ ] Edit button edits the current contact only
- [ ] Links are independent per contact
- [ ] "+ New contact" appears when < 2 contacts
- [ ] Creating new contact adds to array
- [ ] Existing single-contact users are migrated seamlessly
- [ ] Maximum 2 contacts enforced
- [ ] Empty state (0 contacts) still works

## Files to Modify

- `utils/storage.js` - Add CONTACTS key, update helpers if needed
- `pages/_app.js` - New context shape, migration logic
- `pages/index.js` - Multiple contact rows, new contact button
- `pages/preview.js` - Read contact ID from query
- `pages/create.js` - Read/write specific contact
- `pages/links.js` - Read/write specific contact's links
- `components/Contacts.js` - Add id prop, pass to navigation
- `components/Form.js` - Use contact ID from query
- `components/LinkForm.js` - Use contact ID from query
- `components/EditPane.js` - Pass contact ID to routes

## Non-Goals (Future)

- More than 2 contacts
- Reordering contacts
- Deleting contacts (can edit to blank instead)
- Contact-specific themes beyond vibe
