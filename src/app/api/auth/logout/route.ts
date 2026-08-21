import { sessionCookie } from "@/lib/server/auth";

export async function POST() {
  return Response.json({ ok: true }, { headers: { "set-cookie": sessionCookie("", 0) } });
}
