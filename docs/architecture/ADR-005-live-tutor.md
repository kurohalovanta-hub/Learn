# ADR-005 — Live in-app AI tutor (server-side Claude calls)

**Date:** 2026-08-29 · **Status:** accepted
**Supersedes:** the "no server-side AI calls without a new ADR" clause of the tutor-bridge
design (this is that ADR). The copy-based bridge (`src/lib/tutor.ts`, `TutorBridge`)
remains as the fallback when the live tutor is not configured.

## Context

The copy-paste tutor bridge failed its user in practice: the friction of moving packets
between tabs meant questions at the moment of confusion simply never got asked. One week
of real use produced ~1% progress. A learning system where asking is expensive does not
teach.

## Decision

Add a server route (`/api/tutor`) that streams Claude responses into an in-app tutor
panel, under three contracts:

1. **Grounding** — every request injects the node's own curated materials (packet:
   resources with exact sections, recall Q&A, practice prompts, mastery bar). The system
   prompt requires answers grounded in those materials; anything beyond them must be
   flagged as outside the curated path, with a pointer to the source. This bounds
   hallucination to rare + flagged + checkable, matching the curation-first philosophy.
2. **Brevity** — answer-first, one concept per turn, hard length cap unless the learner
   explicitly asks for depth. The learner holds the depth dial (chips: shorter / deeper /
   example / skip). Every reply ends with 2–4 tappable next-step options so typing is
   optional.
3. **Adaptation** — the request carries the learner's derived evidence state (same
   compact context the bridge already built). The tutor probes before teaching, skips
   what is demonstrated, shrinks steps on failure.

The existing honesty machinery is **unchanged**: mode contracts still forbid solving the
mastery task; sessions end with the same JSON summary, ingested through the existing
`parseTutorSummary` → `summaryToEvidence` path, so AI-assisted work still caps at Silver
and full-solution exposure still raises `aiDependence`.

## Security / cost

- Requires `ANTHROPIC_API_KEY` (env). Model via `TUTOR_MODEL` (default `claude-sonnet-5`).
- **In production the route requires an approved signed-in session** (Redis accounts).
  With a key set but no Redis, it refuses outside development — an open endpoint on a
  public domain is a token-theft hole, not a feature.
- Budget: per-user daily request cap in Redis (`TUTOR_DAILY_LIMIT`, default 300),
  `max_tokens` capped per reply, history truncated server-side.
- No learner state is stored server-side by the tutor; conversation lives in the client.

## Companion decisions in the same change

- **In-browser code execution (Pyodide, client-side only).** Practice code runs for real
  in the browser; output shown is actual output, never model-imagined. The tutor reviews
  code *against its real output*. No server compute, no new infra.
- **Progress memory → GitHub (`/api/memory`)**: admin-only route commits a progress
  digest to a **private** repo via `GITHUB_MEMORY_TOKEN` + `GITHUB_MEMORY_REPO`. The
  route verifies the target repo is private and refuses otherwise — learner state never
  lands in a public repo (standing privacy rule).

## Rejected

- Client-side API key (leaks the key to every visitor).
- Unauthenticated tutor in production (cost abuse).
- Letting the tutor write evidence directly (it only produces the summary the existing
  ingestion validates — the derivation engine stays the single authority).
