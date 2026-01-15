0a. Study `specs/multiple-contacts.md` to learn the feature requirements.
0b. Study @IMPLEMENTATION_PLAN.md (if present) to understand the plan so far.
0c. Study `pages/_app.js` to understand current storage context and data flow.
0d. Study `utils/storage.js` to understand storage patterns.
0e. For reference, the application source code is in `pages/*` and `components/*`.

1. Study @IMPLEMENTATION_PLAN.md (if present; it may be incorrect) and use up to 20 Sonnet subagents to study existing source code and compare it against `specs/multiple-contacts.md`. Use an Opus subagent to analyze findings, prioritize tasks, and create/update @IMPLEMENTATION_PLAN.md as a bullet point list sorted in priority of items yet to be implemented. Ultrathink. Consider:
   - Current single-contact data flow through context
   - All places that read formValues/linkValues from context
   - All places that write to formValues/linkValues via setters
   - Router patterns for passing contact ID
   - Migration path for existing single-contact users
   - Order of operations (what depends on what)

Study @IMPLEMENTATION_PLAN.md to determine starting point for research and keep it up to date with items considered complete/incomplete using subagents.

IMPORTANT: Plan only. Do NOT implement anything. Do NOT assume functionality is missing; confirm with code search first.

ULTIMATE GOAL: Add support for multiple contacts (max 2). Each contact has independent formValues and linkValues. Home shows multiple contact rows. Preview/edit flows work on specific contact by ID. Existing users migrated seamlessly.
