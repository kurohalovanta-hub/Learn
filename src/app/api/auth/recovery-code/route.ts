import {
  generateRecoveryCode, hashPassword, normalizeRecoveryCode, putUser, requireSession,
} from "@/lib/server/auth";

// Issue a fresh single-use recovery code for the signed-in account. The plaintext
// is returned exactly once and never stored — only its scrypt hash is persisted.
// Generating a new code invalidates any previous one.
export async function POST(req: Request) {
  const ctx = await requireSession(req);
  if (ctx instanceof Response) return ctx;
  const { redis, user } = ctx;

  const code = generateRecoveryCode();
  const { hash, salt } = await hashPassword(normalizeRecoveryCode(code));
  await putUser(redis, {
    ...user,
    recoveryHash: hash,
    recoverySalt: salt,
    recoveryCreatedAt: Date.now(),
  });

  return Response.json({
    ok: true,
    code,
    note: "Store this somewhere safe and private. It is shown once, works once, and replaces any earlier code.",
  });
}
