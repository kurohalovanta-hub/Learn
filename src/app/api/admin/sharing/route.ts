// Admin controls for lending the bridge to specific users (safe tutor mode).
// Admin-only. The cap is whatever the admin sets — 0 means unlimited.

import { requireAdmin } from "@/lib/server/auth";
import {
  addShareUser, getShareConfig, removeShareUser, setShareCap, setShareEnabled,
} from "@/lib/server/bridge";

export async function GET(req: Request) {
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;
  return Response.json(await getShareConfig(ctx.redis));
}

export async function PUT(req: Request) {
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;
  let body: { enabled?: boolean; cap?: number; add?: string; remove?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }

  if (typeof body.enabled === "boolean") await setShareEnabled(ctx.redis, body.enabled, ctx.user.username);
  if (typeof body.cap === "number" && body.cap >= 0 && body.cap <= 100_000) await setShareCap(ctx.redis, body.cap);
  if (typeof body.add === "string" && /^[a-z0-9_-]{3,24}$/.test(body.add.trim().toLowerCase())) {
    await addShareUser(ctx.redis, body.add.trim().toLowerCase());
  }
  if (typeof body.remove === "string") await removeShareUser(ctx.redis, body.remove.trim().toLowerCase());

  return Response.json(await getShareConfig(ctx.redis));
}
