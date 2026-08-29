// Per-user AI connections (HALO). Each account links its own Claude and/or
// ChatGPT API key; keys live server-side in Redis under the user's record and
// are never echoed back to the client. The tutor uses the user's own
// connection first — the deployment needs no site-wide key.

import type { Redis } from "@upstash/redis";

export type AIProvider = "anthropic" | "openai";

export interface AIKeys {
  anthropic?: string;
  openai?: string;
  prefer?: AIProvider;
}

const AI_KEY = (u: string) => `ai:${u}`;

export async function loadAIKeys(redis: Redis, username: string): Promise<AIKeys> {
  return (await redis.get<AIKeys>(AI_KEY(username))) ?? {};
}

export async function saveAIKeys(redis: Redis, username: string, keys: AIKeys): Promise<void> {
  await redis.set(AI_KEY(username), keys);
}

/** Cheapest possible real validation: list models with the pasted key. */
export async function validateKey(provider: AIProvider, key: string): Promise<string | null> {
  try {
    const res =
      provider === "anthropic"
        ? await fetch("https://api.anthropic.com/v1/models?limit=1", {
            headers: { "x-api-key": key, "anthropic-version": "2023-06-01" },
          })
        : await fetch("https://api.openai.com/v1/models", {
            headers: { authorization: `Bearer ${key}` },
          });
    if (res.status === 401 || res.status === 403) return "That key was rejected — check it was copied whole and is still active.";
    if (!res.ok) return `The provider answered ${res.status} — try again in a moment.`;
    return null;
  } catch {
    return "Couldn't reach the provider to check the key — try again.";
  }
}

/** Which of the user's connections should serve this request, honoring preference. */
export function pickProvider(keys: AIKeys): { provider: AIProvider; key: string } | null {
  const order: AIProvider[] =
    keys.prefer === "openai" ? ["openai", "anthropic"] : ["anthropic", "openai"];
  for (const p of order) {
    const k = keys[p];
    if (k) return { provider: p, key: k };
  }
  return null;
}
