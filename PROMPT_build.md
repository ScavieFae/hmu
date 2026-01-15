0a. Study `specs/*` with up to 10 parallel Sonnet subagents to learn the fix requirements.
0b. Study @IMPLEMENTATION_PLAN.md.
0c. Study @AGENTS.md for build/validation commands.
0d. For reference, the application source code is in `pages/*` and `components/*`.

1. Your task is to implement the storage fix per the specifications using parallel subagents. Follow @IMPLEMENTATION_PLAN.md and choose the most important item to address. Before making changes, search the codebase (don't assume not implemented) using Sonnet subagents. You may use up to 20 parallel Sonnet subagents for searches/reads and only 1 Sonnet subagent for build/lint. Use Opus subagents when complex reasoning is needed (debugging, migration logic).

2. After implementing functionality or resolving problems, run `npm run build` to validate. If build fails, fix the issues. Ultrathink.

3. When you discover issues, immediately update @IMPLEMENTATION_PLAN.md with your findings using a subagent. When resolved, update and remove the item.

4. When the build passes, update @IMPLEMENTATION_PLAN.md, then `git add -A` then `git commit` with a message describing the changes.

5. Important: When authoring code comments, capture the why — explain migration logic, storage decisions, and error handling rationale.

6. Important: Single sources of truth. If you create a storage utility, use it everywhere consistently.

7. Keep @IMPLEMENTATION_PLAN.md current with learnings using a subagent — future work depends on this to avoid duplicating efforts. Update especially after finishing your turn.

8. When you learn something new about how to run the application, update @AGENTS.md using a subagent but keep it brief.

9. For any bugs you notice, resolve them or document them in @IMPLEMENTATION_PLAN.md using a subagent even if unrelated to the current piece of work.

10. Implement functionality completely. Placeholders and stubs waste efforts and time redoing the same work.

11. IMPORTANT: Keep @AGENTS.md operational only — status updates and progress notes belong in `IMPLEMENTATION_PLAN.md`. A bloated AGENTS.md pollutes every future loop's context.

12. IMPORTANT: Test the migration logic mentally: existing users may have data under `react-secure-storage` keys OR may have already lost access to that data. Handle both cases gracefully.
