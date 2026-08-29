// Per-user progress memory → GitHub. Each signed-in user links their OWN
// private repo (fine-grained PAT stored server-side in Redis, never echoed
// back). The digest written there is AI-readable — any assistant (Claude,
// ChatGPT, whatever) can ingest one file and know the project, the progress,
// and the recent tutor conversations. Public repos are refused: learner state
// never lands anywhere public.

import { requireSession } from "@/lib/server/auth";

export const maxDuration = 30;

const GH = "https://api.github.com";
const CONFIG_KEY = (u: string) => `memory:${u}`;

interface MemoryConfig {
  repo: string; // "owner/repo"
  token: string;
}

const ghHeaders = (token: string) => ({
  authorization: `Bearer ${token}`,
  accept: "application/vnd.github+json",
  "x-github-api-version": "2022-11-28",
  "user-agent": "embodied-os-memory",
});

const REPO_RE = /^[\w.-]+\/[\w.-]+$/;

function envConfig(): MemoryConfig | null {
  const token = process.env.GITHUB_MEMORY_TOKEN;
  const repo = process.env.GITHUB_MEMORY_REPO;
  return token && repo && REPO_RE.test(repo) ? { repo, token } : null;
}

async function loadConfig(redis: { get<T>(k: string): Promise<T | null> }, username: string): Promise<{ cfg: MemoryConfig; source: "user" | "env" } | null> {
  const user = await redis.get<MemoryConfig>(CONFIG_KEY(username));
  if (user?.repo && user.token) return { cfg: user, source: "user" };
  const env = envConfig();
  return env ? { cfg: env, source: "env" } : null;
}

/** Repo must exist, be private, and the token must be able to write to it. */
async function validateRepo(cfg: MemoryConfig): Promise<string | null> {
  const res = await fetch(`${GH}/repos/${cfg.repo}`, { headers: ghHeaders(cfg.token) });
  if (res.status === 404) return `GitHub can't see ${cfg.repo} with that token — check the repo name and the token's repository access.`;
  if (!res.ok) return `GitHub says ${res.status} — check the token.`;
  const info = (await res.json()) as { private?: boolean; permissions?: { push?: boolean } };
  if (!info.private) return `${cfg.repo} is PUBLIC — your learner state and chats must not go there. Make it private (or use a private repo).`;
  if (!info.permissions?.push) return `That token can read ${cfg.repo} but not write to it — it needs Contents: read & write.`;
  return null;
}

export async function GET(req: Request) {
  const ctx = await requireSession(req);
  if (ctx instanceof Response) return ctx;
  const found = await loadConfig(ctx.redis, ctx.user.username);
  return Response.json(found ? { configured: true, repo: found.cfg.repo, source: found.source } : { configured: false });
}

/** Link (or replace) the user's memory repo. */
export async function PUT(req: Request) {
  const ctx = await requireSession(req);
  if (ctx instanceof Response) return ctx;
  let body: { repo?: string; token?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }
  const repo = typeof body.repo === "string" ? body.repo.trim().replace(/^https?:\/\/github\.com\//, "").replace(/\.git$/, "").replace(/\/+$/, "") : "";
  const token = typeof body.token === "string" ? body.token.trim() : "";
  if (!REPO_RE.test(repo)) return Response.json({ error: "repo must look like owner/name" }, { status: 400 });
  if (token.length < 20 || token.length > 400) return Response.json({ error: "that doesn't look like a GitHub token" }, { status: 400 });

  const problem = await validateRepo({ repo, token });
  if (problem) return Response.json({ error: problem }, { status: 400 });

  await ctx.redis.set(CONFIG_KEY(ctx.user.username), { repo, token });
  return Response.json({ ok: true, repo });
}

export async function DELETE(req: Request) {
  const ctx = await requireSession(req);
  if (ctx instanceof Response) return ctx;
  await ctx.redis.del(CONFIG_KEY(ctx.user.username));
  return Response.json({ ok: true });
}

/** Write the digest to the linked repo. */
export async function POST(req: Request) {
  const ctx = await requireSession(req);
  if (ctx instanceof Response) return ctx;

  const found = await loadConfig(ctx.redis, ctx.user.username);
  if (!found) {
    return Response.json({ error: "No memory repo linked — connect one in Settings → memory." }, { status: 501 });
  }
  const { cfg } = found;

  let body: { digest?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }
  const digest = typeof body.digest === "string" ? body.digest.trim() : "";
  if (!digest || digest.length > 400_000) {
    return Response.json({ error: "digest missing or too large" }, { status: 400 });
  }

  // re-check privacy on every write — a repo can be flipped public later
  const problem = await validateRepo(cfg);
  if (problem) return Response.json({ error: problem }, { status: 400 });

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
  return Response.json({ ok: true, url: out.content?.html_url ?? null, path, repo: cfg.repo });
}
