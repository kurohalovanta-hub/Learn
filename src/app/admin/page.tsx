"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-client";
import { EmptyState, Panel, SectionTitle } from "@/components/ui";

interface AdminUser {
  username: string;
  role: "admin" | "user";
  approved: boolean;
  createdAt: number;
}

export default function AdminPage() {
  const auth = useAuth();
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [msg, setMsg] = useState("");
  const [resetFor, setResetFor] = useState<string | null>(null);
  const [newPw, setNewPw] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/users", { cache: "no-store" });
    if (res.ok) setUsers(((await res.json()) as { users: AdminUser[] }).users);
    else setMsg(`Failed to load users (HTTP ${res.status}).`);
  }, []);

  useEffect(() => {
    if (auth.status !== "authed" || auth.user?.role !== "admin") return;
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [auth.status, auth.user?.role, load]);

  const act = async (username: string, action: string, extra?: Record<string, unknown>) => {
    setMsg("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, action, ...extra }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) setMsg(data.error ?? `Action failed (HTTP ${res.status}).`);
    else setMsg(`${action} → ${username} ✓`);
    load();
  };

  if (auth.status !== "authed" || auth.user?.role !== "admin") {
    return (
      <div className="mx-auto max-w-lg pt-16">
        <EmptyState title="Administrators only" hint="Sign in with an admin account to manage access." />
      </div>
    );
  }

  const pending = users?.filter((u) => !u.approved) ?? [];
  const active = users?.filter((u) => u.approved) ?? [];

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <div className="mono-label">access control</div>
        <h1 className="font-mono text-2xl font-bold">ADMIN</h1>
        <p className="mt-1 text-sm text-dim">
          New registrations wait here until you approve them. Revoking bumps the session version — the user is signed out everywhere immediately.
        </p>
      </div>

      {msg && <div className="text-xs text-acc-math">{msg}</div>}

      <Panel accent="#e8b34d">
        <SectionTitle>pending approval · {pending.length}</SectionTitle>
        {pending.length === 0 ? (
          <div className="text-sm text-faint">No requests waiting.</div>
        ) : (
          <div className="space-y-2">
            {pending.map((u) => (
              <div key={u.username} className="flex flex-wrap items-center gap-2 rounded-md border border-line bg-panel2 px-3 py-2">
                <span className="min-w-0 flex-1 font-mono text-sm">{u.username}</span>
                <span className="text-[11px] text-faint">{new Date(u.createdAt).toLocaleDateString()}</span>
                <button className="btn btn-acc !py-1" onClick={() => act(u.username, "approve")}>Approve</button>
                <button className="btn btn-danger !py-1" onClick={() => act(u.username, "delete")}>Reject</button>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel>
        <SectionTitle>active accounts · {active.length}</SectionTitle>
        <div className="space-y-2">
          {active.map((u) => (
            <div key={u.username} className="rounded-md border border-line bg-panel2 px-3 py-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="min-w-0 flex-1 font-mono text-sm">
                  {u.username}
                  {u.username === auth.user?.username && <span className="ml-2 text-[10px] text-faint">(you)</span>}
                </span>
                <span
                  className="rounded px-1.5 py-0.5 font-mono text-[10px] uppercase"
                  style={{ color: u.role === "admin" ? "#e8b34d" : "#8b97a7", background: u.role === "admin" ? "#e8b34d14" : "#8b97a714" }}
                >
                  {u.role}
                </span>
                {u.username !== auth.user?.username && (
                  <>
                    {u.role === "user" ? (
                      <button className="btn !py-1 text-xs" onClick={() => act(u.username, "promote")}>promote</button>
                    ) : (
                      <button className="btn !py-1 text-xs" onClick={() => act(u.username, "demote")}>demote</button>
                    )}
                    <button className="btn !py-1 text-xs" onClick={() => act(u.username, "revoke")}>revoke</button>
                    <button className="btn btn-danger !py-1 text-xs" onClick={() => act(u.username, "delete")}>delete</button>
                  </>
                )}
                <button className="btn !py-1 text-xs" onClick={() => { setResetFor(resetFor === u.username ? null : u.username); setNewPw(""); }}>
                  reset pw
                </button>
              </div>
              {resetFor === u.username && (
                <div className="mt-2 flex gap-2">
                  <input
                    type="password"
                    placeholder="new password (min 8)"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                  />
                  <button
                    className="btn btn-acc shrink-0 !py-1"
                    disabled={newPw.length < 8}
                    onClick={() => { act(u.username, "reset-password", { newPassword: newPw }); setResetFor(null); }}
                  >
                    set
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
