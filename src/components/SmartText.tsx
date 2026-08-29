// Renders content text with raw URLs turned into short labeled link chips —
// packet prose should read like instructions, not like a config file.

const URL_RE = /https?:\/\/[^\s<>"')\]]+/g;

function label(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    const seg = u.pathname.split("/").filter(Boolean)[0];
    return seg && seg.length <= 18 && !/^[a-z0-9]{10,}$/i.test(seg) ? `${host}/${seg}` : host;
  } catch {
    return url.slice(0, 32);
  }
}

export function SmartText({ children, className = "" }: { children: string; className?: string }) {
  const text = children;
  const parts: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(URL_RE)) {
    const start = m.index ?? 0;
    // trim trailing punctuation that belongs to the sentence, not the URL
    let url = m[0];
    while (/[.,;:!?]$/.test(url)) url = url.slice(0, -1);
    if (start > last) parts.push(text.slice(last, start));
    parts.push(
      <a
        key={i++}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-0.5 inline-flex items-baseline gap-0.5 rounded border border-acc/30 bg-acc/8 px-1.5 py-px font-mono text-[0.85em] text-acc no-underline transition-colors hover:bg-acc/15"
      >
        {label(url)}<span aria-hidden className="text-[0.8em]">↗</span>
      </a>,
    );
    last = start + url.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <span className={className}>{parts}</span>;
}
