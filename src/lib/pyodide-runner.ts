// In-browser Python via Pyodide (ADR-005 companion). Client-only, lazy-loaded
// from CDN on first Run (~10 MB, then cached). Real execution — the output the
// tutor reviews is never model-imagined.

export interface RunResult {
  ok: boolean;
  stdout: string;
  error?: string;
  ms: number;
}

interface PyodideLike {
  runPythonAsync: (code: string) => Promise<unknown>;
  loadPackagesFromImports: (code: string) => Promise<unknown>;
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
}

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideLike>;
  }
}

const PYODIDE_VERSION = "0.26.4";
const CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let instance: Promise<PyodideLike> | null = null;

function injectScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (window.loadPyodide) return resolve();
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("pyodide script failed to load")));
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("pyodide script failed to load — check your connection"));
    document.head.appendChild(s);
  });
}

export function loadRuntime(): Promise<PyodideLike> {
  if (!instance) {
    instance = (async () => {
      await injectScript(`${CDN}pyodide.js`);
      if (!window.loadPyodide) throw new Error("pyodide loader missing after script load");
      return window.loadPyodide({ indexURL: CDN });
    })().catch((e) => {
      instance = null; // allow retry after a network failure
      throw e;
    });
  }
  return instance;
}

export const runtimeReady = () => instance !== null;

/** Run Python, capturing stdout/stderr. numpy etc. auto-load from imports. */
export async function runPython(code: string): Promise<RunResult> {
  const started = performance.now();
  let out = "";
  try {
    const py = await loadRuntime();
    py.setStdout({ batched: (s) => { out += `${s}\n`; } });
    py.setStderr({ batched: (s) => { out += `${s}\n`; } });
    await py.loadPackagesFromImports(code);
    const value = await py.runPythonAsync(code);
    if (value !== undefined && value !== null) out += `${String(value)}\n`;
    return { ok: true, stdout: out, ms: Math.round(performance.now() - started) };
  } catch (e) {
    return {
      ok: false,
      stdout: out,
      error: e instanceof Error ? e.message : String(e),
      ms: Math.round(performance.now() - started),
    };
  }
}
