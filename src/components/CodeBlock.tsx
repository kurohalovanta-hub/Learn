"use client";

import { useMemo, type ReactNode } from "react";

// Minimal deterministic tokenizer — Python-flavored with a bash fallback.
// No dependency; good enough for curated lesson snippets.

const PY_KW = new Set([
  "def", "return", "if", "elif", "else", "for", "while", "in", "not", "and", "or", "import",
  "from", "as", "class", "with", "try", "except", "finally", "raise", "assert", "lambda",
  "None", "True", "False", "pass", "break", "continue", "yield", "global", "is", "del", "print",
]);

const TOKEN_RE =
  /(#[^\n]*)|("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b)|(\b[A-Za-z_][A-Za-z0-9_]*\b)|([+\-*/%=<>!&|^~@:]+)|(\s+)|(.)/g;

function highlightLine(line: string, key: number): ReactNode {
  const out: ReactNode[] = [];
  let m: RegExpExecArray | null;
  let i = 0;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(line))) {
    const [tok, com, str, num, word, op] = m;
    let cls = "";
    if (com) cls = "tok-com";
    else if (str) cls = "tok-str";
    else if (num) cls = "tok-num";
    else if (word) {
      if (PY_KW.has(word)) cls = "tok-kw";
      else if (word === "self") cls = "tok-self";
      else {
        const rest = line.slice(m.index + word.length);
        if (rest.startsWith("(")) cls = "tok-fn";
      }
    } else if (op) cls = "tok-op";
    out.push(
      cls ? (
        <span key={`${key}-${i++}`} className={cls}>{tok}</span>
      ) : (
        tok
      ),
    );
  }
  return out;
}

export interface CodeBlockProps {
  source: string;
  lang?: string;
  /** 1-indexed lines to emphasize. */
  highlight?: number[];
  /** 1-indexed lines rendered as masked (■■■) — for missing-line exercises. */
  masked?: number[];
  showLineNumbers?: boolean;
  title?: string;
  className?: string;
}

export function CodeBlock({
  source, lang = "python", highlight = [], masked = [], showLineNumbers, title, className = "",
}: CodeBlockProps) {
  const lines = useMemo(() => source.replace(/\n$/, "").split("\n"), [source]);
  const nums = showLineNumbers ?? lines.length > 4;
  const hl = new Set(highlight);
  const mk = new Set(masked);

  return (
    <div className={`codeblock ${className}`}>
      {title && (
        <div className="flex items-center justify-between border-b border-[#1c2836] px-3.5 py-1.5">
          <span className="font-mono text-[10.5px] tracking-wider text-faint">{title}</span>
          <span className="font-mono text-[9.5px] uppercase text-[#3d4a5c]">{lang}</span>
        </div>
      )}
      <pre>
        <code>
          {lines.map((line, i) => {
            const n = i + 1;
            const isMask = mk.has(n);
            return (
              <span key={i} className={`cline ${hl.has(n) ? "hl" : ""} ${isMask ? "mask" : ""}`}>
                {nums && (
                  <span className="mr-3 inline-block w-5 select-none text-right text-[#3d4a5c]">{n}</span>
                )}
                {isMask ? (
                  <span className="text-acc-math">{"█".repeat(Math.max(12, Math.min(32, line.length)))}  ← your line</span>
                ) : lang === "python" || lang === "py" ? (
                  highlightLine(line, i)
                ) : (
                  line
                )}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
