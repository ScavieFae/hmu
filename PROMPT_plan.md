0a. Study `specs/*` with up to 10 parallel Sonnet subagents to learn the fix requirements.
0b. Study @IMPLEMENTATION_PLAN.md (if present) to understand the plan so far.
0c. Study `pages/_app.js` to understand current storage implementation.
0d. For reference, the application source code is in `pages/*` and `components/*`.

1. Study @IMPLEMENTATION_PLAN.md (if present; it may be incorrect) and use up to 20 Sonnet subagents to study existing source code and compare it against `specs/*`. Use an Opus subagent to analyze findings, prioritize tasks, and create/update @IMPLEMENTATION_PLAN.md as a bullet point list sorted in priority of items yet to be implemented. Ultrathink. Consider:
   - Current `react-secure-storage` usage patterns
   - All files that import or use secureLocalStorage
   - Migration complexity for existing users
   - Order of operations (what depends on what)

Study @IMPLEMENTATION_PLAN.md to determine starting point for research and keep it up to date with items considered complete/incomplete using subagents.

IMPORTANT: Plan only. Do NOT implement anything. Do NOT assume functionality is missing; confirm with code search first.

ULTIMATE GOAL: Fix Android PWA storage persistence by removing fingerprint-based encryption dependency and adding storage durability measures. The fix must handle migration for existing users gracefully.
