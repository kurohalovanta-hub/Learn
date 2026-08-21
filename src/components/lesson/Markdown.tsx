"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { CodeBlock } from "../CodeBlock";
import type { ReactNode } from "react";

/** Lesson prose: markdown + $math$, styled by .lesson-prose. */
export function Markdown({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div className={`lesson-prose ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          pre: (props) => <>{props.children}</>,
          code: (props) => {
            const { className: cls, children } = props as { className?: string; children?: ReactNode };
            const text = String(children ?? "");
            const isBlock = text.includes("\n") || /language-/.test(cls ?? "");
            if (!isBlock) return <code>{children}</code>;
            const lang = /language-(\w+)/.exec(cls ?? "")?.[1] ?? "python";
            return (
              <div className="my-3">
                <CodeBlock source={text} lang={lang} />
              </div>
            );
          },
          table: (props) => (
            <div className="my-3 overflow-x-auto rounded-lg border border-line">
              <table className="w-full text-[13px]">{props.children}</table>
            </div>
          ),
          th: (props) => (
            <th className="border-b border-line bg-panel2 px-3 py-1.5 text-left font-mono text-[10.5px] tracking-wider text-faint uppercase">
              {props.children}
            </th>
          ),
          td: (props) => <td className="border-b border-line/50 px-3 py-1.5 align-top">{props.children}</td>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
