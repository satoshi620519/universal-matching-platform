# CONTINUITY PROTOCOL — Development Handoff Rules

## Absolute rule
Development must never depend on ChatGPT conversation memory alone.

If a work session ends unexpectedly, reaches a limit, or stops in the middle of a task, the next session must be able to determine the exact state and continue without guessing.

## Required session workflow

### Before starting work
1. Read DEVELOPMENT_STATUS.md.
2. Read the relevant specification and architecture documents.
3. Identify the exact current task.
4. Confirm what is already complete and what is not.

### During work
For every meaningful unit of work, keep track of:
- Current milestone
- Current task
- Files created or changed
- Features completed
- Features partially completed
- Decisions made
- Problems discovered
- Workarounds used
- Tests run and results
- Remaining work
- Exact next action

### Before ending a session
Update DEVELOPMENT_STATUS.md with:
- Date/session summary
- Exact phase
- Exact task being worked on
- Completion percentage or status
- Completed items
- Incomplete items
- Files modified
- Known issues
- Test status
- Exact next step

Do this even if the work is only partially complete.

### If interrupted unexpectedly
At the next opportunity, immediately record:
- Last confirmed successful action
- Current repository state
- What may be incomplete
- What needs verification

Never assume unfinished work is complete.

## Status format

Every active development session should preserve:

```
CURRENT PHASE:
CURRENT MILESTONE:
CURRENT TASK:
STATUS: Not started / In progress / Blocked / Testing / Complete

COMPLETED:
- ...

IN PROGRESS:
- ...

NOT STARTED:
- ...

FILES CHANGED:
- ...

DECISIONS MADE:
- ...

KNOWN ISSUES:
- ...

TEST RESULTS:
- ...

EXACT NEXT ACTION:
- ...
```

## Atomic work principle
Large work must be broken into small milestones.

For each milestone:
1. Specify
2. Implement
3. Test
4. Record result
5. Commit/update status
6. Move to next milestone

Do not leave a large amount of undocumented work in progress.

## Source of truth
Priority order:
1. Actual repository source code
2. DEVELOPMENT_STATUS.md
3. Relevant specifications
4. DECISIONS.md
5. Conversation context

If conversation memory conflicts with repository documentation, the repository documentation must be checked and corrected deliberately.

## Restart protocol
When a new ChatGPT conversation resumes this project:

1. Connect/read repository.
2. Read PROJECT_MASTER.md.
3. Read MASTER_DEVELOPMENT_ROADMAP.md.
4. Read DEVELOPMENT_STATUS.md first for current state.
5. Read the specifications relevant to CURRENT TASK.
6. Inspect files listed as in progress.
7. Verify incomplete work before changing it.
8. Continue from EXACT NEXT ACTION.

Never restart development from memory or broad assumptions.

## Completion rule
A task is not considered complete merely because code was written.
It is complete only when:
- implementation exists
- relevant tests/checks are run
- documentation is updated
- DEVELOPMENT_STATUS.md is updated
- the next task is explicitly recorded
