0a. Study `specs/multiple-contacts.md` to learn the feature requirements.
0b. Study @IMPLEMENTATION_PLAN.md.
0c. Study @AGENTS.md for build/validation commands and codebase patterns.
0d. Study `utils/storage.js` for storage patterns to follow.
0e. For reference, the application source code is in `pages/*` and `components/*`.

1. Your task is to implement the multiple contacts feature per the specifications using parallel subagents. Follow @IMPLEMENTATION_PLAN.md and choose the most important item to address. Before making changes, search the codebase (don't assume not implemented) using Sonnet subagents. You may use up to 20 parallel Sonnet subagents for searches/reads and only 1 Sonnet subagent for build/lint. Use Opus subagents when complex reasoning is needed (debugging, context API design, migration logic).

2. After implementing functionality or resolving problems, run `npm run build` to validate. If build fails, fix the issues. Ultrathink.

3. When you discover issues, immediately update @IMPLEMENTATION_PLAN.md with your findings using a subagent. When resolved, update and remove the item.

4. When the build passes, update @IMPLEMENTATION_PLAN.md, then `git add -A` then `git commit` with a message describing the changes.

5. Important: When authoring code comments, capture the why — explain data structure decisions, migration logic, and context API design rationale.

6. Important: Single sources of truth. Use the existing `utils/storage.js` patterns. Don't create parallel storage mechanisms.

7. Keep @IMPLEMENTATION_PLAN.md current with learnings using a subagent — future work depends on this to avoid duplicating efforts. Update especially after finishing your turn.

8. When you learn something new about how to run the application, update @AGENTS.md using a subagent but keep it brief.

9. For any bugs you notice, resolve them or document them in @IMPLEMENTATION_PLAN.md using a subagent even if unrelated to the current piece of work.

10. Implement functionality completely. Placeholders and stubs waste efforts and time redoing the same work.

11. IMPORTANT: Keep @AGENTS.md operational only — status updates and progress notes belong in `IMPLEMENTATION_PLAN.md`. A bloated AGENTS.md pollutes every future loop's context.

12. IMPORTANT: The context API change is foundational. Components depend on it. Plan the order carefully:
    - Context API changes first (expose new shape)
    - Migration logic (convert old single-contact to new array)
    - Then update pages/components to consume new API
    - Route changes (query params) alongside component updates

13. IMPORTANT: Backward compatibility during transition:
    - Old `formValues`/`linkValues` keys may still exist
    - Migration must handle: old keys only, new key only, both exist
    - Components being updated mid-feature should handle both shapes gracefully

14. IMPORTANT: Test the UX flow mentally after each change:
    - Home → click contact → preview (correct contact?)
    - Preview → edit → create (editing correct contact?)
    - Create → save → preview (saved to correct contact?)
    - Home → new contact → create (creates second, not overwrites first?)
