# 04 — Tutor Continuity Audit
Date: 2026-08-21 · Authority: HANDOVERFINAL §21–23, §37, §39, §51.

## Current state

The product's entire AI-tutor integration is:

1. `TUTOR_PROMPTS` in `src/content/templates.ts` — 8 static prompt templates, one surfaced per
   day on `/today` (cycling every 8 days), with a copy button.
2. A tutor-protocol card in the same style on some surfaces.

That is the whole system. Measured against §21–23/§37/§39:

| Requirement | Current | Gap |
|---|---|---|
| Contextual tutor modes (Teach/Diagnose/Socratic/Practice/Debug/Examine/Defense/Critic) | one generic prompt/day | **absent** |
| Compact tutor packet (goal, node, bottleneck, verified prereqs, failed questions, evidence, AI-history, resource, mastery bar, project, dependencies, mode) | none — learner re-explains everything, every session | **absent** |
| Session-summary ingestion (structured JSON → evidence) | none — nothing returns to the app | **absent** |
| Independence accounting from tutor sessions (`full_solution_exposures`) | none — independence is a self-report dropdown elsewhere | **absent** |
| Provider neutrality (Claude and ChatGPT interchangeable; neither owns state) | trivially neutral (copy-paste text) | met by accident |
| Handoff artifacts (`learner-state/`, `tutor/` — a brand-new tutor can resume) | none | **absent** |
| Contextual ask buttons at the point of struggle (§51) | none | **absent** |

The consequence for the real learner: every Claude/ChatGPT session starts from zero context, so
sessions drift generic; nothing the tutor learns (verified strengths, misconceptions,
full-solution exposures) survives; and the AI-dependency the spec fears is *invisible* to the
product because tutoring happens entirely off the books.

## Design targets (V1 — copy-based, no mandatory API)

1. **Tutor packet generator.** A pure function `buildTutorPacket(mode, nodeId, state)` assembling
   the §21 fields from live store/content data, rendered as a compact fenced block with a one-tap
   copy. Packet ends with the mode contract (§22 rules) so the tutor behaves correctly without
   the learner policing it.
2. **Contextual entry points (§51).** On packet steps and lesson blocks: `I don't understand this
   step` · `Hint me — don't solve` · `Quiz me` · `Another example` · `Debug with me` ·
   `Examine me closed-book`. Each maps to a mode + packet, not a generic chat.
3. **Session ingestion.** A paste box accepting the §23 JSON summary; validated (zod-light,
   hand-rolled) and converted into typed evidence events: verified strengths → comprehension
   signal; `independent_successes` → independent-application signal; `full_solution_exposures` →
   AI-dependence increment; `remaining_weaknesses`/`misconceptions` → remediation queue +
   retrieval items. Malformed input is rejected with the reason; a tutor summary is evidence,
   **never** auto-mastery (§23).
4. **Handoff artifacts (§37).** `tutor/CLAUDE_TUTOR_HANDOFF.md`, `tutor/CHATGPT_TUTOR_HANDOFF.md`,
   `tutor/SESSION_SCHEMA.json` — static, versioned in the repo; plus `learner-state/` exports
   generated **on demand from Settings** (CURRENT_STATE.md + current-state.json + HANDOFF.md).
   Because the repo is public, learner-state files are *not* auto-committed (§64–65): the export
   is a download the learner may store privately or commit deliberately. Documented in 05.
5. **Default posture.** The default mode in every entry point is diagnostic/Socratic; "give me
   the full solution" exists, works, and is recorded as reduced independence (§68 Risk 5).

## Out of scope for V1 (recorded so it isn't scope-crept)

Direct API integration (§39 V2) — optional later; must never become mandatory or hold state the
database doesn't. Automatic parsing of free-form tutor chat logs — only the structured summary
contract is ingested.
