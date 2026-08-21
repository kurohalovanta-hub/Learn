import {
  deleteUser, getUser, hashPassword, listUsers, putUser, requireAdmin,
} from "@/lib/server/auth";

export async function GET(req: Request) {
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;
  const users = await listUsers(ctx.redis);
  return Response.json({
    users: users.map((u) => ({
      username: u.username, role: u.role, approved: u.approved, createdAt: u.createdAt,
    })),
  });
}

type Action = "approve" | "revoke" | "delete" | "promote" | "demote" | "reset-password";

export async function POST(req: Request) {
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;
  const body = (await req.json().catch(() => null)) as
    | { username?: string; action?: Action; newPassword?: string }
    | null;
  const username = body?.username;
  const action = body?.action;
  if (!username || !action) return new Response("bad request", { status: 400 });

  const target = await getUser(ctx.redis, username);
  if (!target) return new Response("not found", { status: 404 });

  const self = target.username === ctx.user.username;
  switch (action) {
    case "approve":
      await putUser(ctx.redis, { ...target, approved: true });
      break;
    case "revoke":
      if (self) return Response.json({ error: "You cannot revoke yourself." }, { status: 400 });
      await putUser(ctx.redis, { ...target, approved: false, sv: target.sv + 1 });
      break;
    case "delete":
      if (self) return Response.json({ error: "You cannot delete yourself." }, { status: 400 });
      await deleteUser(ctx.redis, username);
      break;
    case "promote":
      await putUser(ctx.redis, { ...target, role: "admin", approved: true });
      break;
    case "demote": {
      if (self) return Response.json({ error: "You cannot demote yourself." }, { status: 400 });
      await putUser(ctx.redis, { ...target, role: "user" });
      break;
    }
    case "reset-password": {
      const pw = body?.newPassword ?? "";
      if (pw.length < 8) return Response.json({ error: "Password must be at least 8 characters." }, { status: 400 });
      const { hash, salt } = await hashPassword(pw);
      await putUser(ctx.redis, { ...target, hash, salt, sv: target.sv + 1 });
      break;
    }
    default:
      return new Response("bad action", { status: 400 });
  }
  return Response.json({ ok: true });
}
