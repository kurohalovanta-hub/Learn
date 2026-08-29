// Bridge key management (session-authed). POST creates/rotates the key and
// returns it ONCE; GET reports linked/online; DELETE revokes.

import { requireSession } from "@/lib/server/auth";
import { bridgeOnline, bridgeTokenExists, createBridgeToken, revokeBridgeToken } from "@/lib/server/bridge";

export async function GET(req: Request) {
  const ctx = await requireSession(req);
  if (ctx instanceof Response) return ctx;
  const [exists, online] = await Promise.all([
    bridgeTokenExists(ctx.redis, ctx.user.username),
    bridgeOnline(ctx.redis, ctx.user.username),
  ]);
  return Response.json({ exists, online });
}

export async function POST(req: Request) {
  const ctx = await requireSession(req);
  if (ctx instanceof Response) return ctx;
  const token = await createBridgeToken(ctx.redis, ctx.user.username);
  return Response.json({ ok: true, token });
}

export async function DELETE(req: Request) {
  const ctx = await requireSession(req);
  if (ctx instanceof Response) return ctx;
  await revokeBridgeToken(ctx.redis, ctx.user.username);
  return Response.json({ ok: true });
}
