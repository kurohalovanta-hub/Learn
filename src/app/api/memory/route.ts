// Progress memory → GitHub (ADR-005 companion). Admin-only. Commits a progress
// digest to a PRIVATE repo so the learner's trajectory survives outside one
// browser. Refuses public targets — learner state never lands in a public repo.

import { requireAdmin } from "@/lib/server/auth";

export const maxDuration = 30;

const GH = "https://api.github.com";

function ghConfig(): { token: string; repo: string } | null {
  const token = process.env.GITHUB_MEMORY_TOKEN;
  const repo = process.env.GITHUB_MEMORY_REPO; // "owner/repo"
  if (!token || !repo || !/^[\w.-]+\/[\w.-]+$/.test(repo)) return null;
  return { token, repo };
}

const ghHeaders = (token: string) => ({
  authorization: `Bearer ${token}`,
  accept: "application/vnd.github+json",
  "x-github-api-version": "2022-11-28",
  "user-agent": "embodied-os-memory",
});

export async function GET(req: Request) {
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;
  return Response.json({ configured: !!ghConfig() });
}

export async function POST(req: Request) {
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;

  const cfg = ghConfig();
  if (!cfg) {
    return Response.json(
      { error: "Memory sync not configured — set GITHUB_MEMORY_TOKEN and GITHUB_MEMORY_REPO (owner/repo, PRIVATE)." },
      { status: 501 },
    );
  }

  let body: { digest?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }
  const digest = typeof body.digest === "string" ? body.digest.trim() : "";
  if (!digest || digest.length > 200_000) {
    return Response.json({ error: "digest missing or too large" }, { status: 400 });
  }

  // privacy gate: the target must exist and must be private
  const repoRes = await fetch(`${GH}/repos/${cfg.repo}`, { headers: ghHeaders(cfg.token) });
  if (!repoRes.ok) {
    return Response.json({ error: `GitHub says ${repoRes.status} for ${cfg.repo} — check token scope and repo name.` }, { status: 502 });
  }
  const repoInfo = (await repoRes.json()) as { private?: boolean };
  if (!repoInfo.private) {
    return Response.json({ error: `${cfg.repo} is PUBLIC — refusing to write learner state there. Make it private or point at a private repo.` }, { status: 403 });
  }

  const path = `progress/${ctx.user.username}.md`;
  const fileUrl = `${GH}/repos/${cfg.repo}/contents/${path}`;
  const existing = await fetch(fileUrl, { headers: ghHeaders(cfg.token) });
  const sha = existing.ok ? ((await existing.json()) as { sha?: string }).sha : undefined;

  const put = await fetch(fileUrl, {
    method: "PUT",
    headers: { ...ghHeaders(cfg.token), "content-type": "application/json" },
    body: JSON.stringify({
      message: `progress memory: ${ctx.user.username} @ ${new Date().toISOString().slice(0, 10)}`,
      content: Buffer.from(digest, "utf8").toString("base64"),
      ...(sha ? { sha } : {}),
    }),
  });
  if (!put.ok) {
    const err = await put.text().catch(() => "");
    return Response.json({ error: `GitHub write failed (${put.status}): ${err.slice(0, 200)}` }, { status: 502 });
  }
  const out = (await put.json()) as { content?: { html_url?: string } };
  return Response.json({ ok: true, url: out.content?.html_url ?? null, path });
}
