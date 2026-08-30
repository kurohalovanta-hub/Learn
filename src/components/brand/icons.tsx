// One tight icon family — 1.5px stroke, round caps, currentColor so each inherits
// nav dim / active cyan / glow. Retires the Unicode glyph bag (Σ ¶ ⑦ ⛨ ⇗ ◉ ⬡ ⊞ ▶).

const P: Record<string, React.ReactNode> = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  today: <><path d="M8 5 16 12 8 19Z" /></>,
  tree: <><circle cx="12" cy="5" r="2.4" /><circle cx="6" cy="18" r="2.4" /><circle cx="18" cy="18" r="2.4" /><path d="M12 7.4v3.6M12 11l-6 4.5M12 11l6 4.5" /></>,
  levels: <><path d="M4 18h4v-5H4zM10 18h4V8h-4zM16 18h4V4h-4z" /></>,
  projects: <><path d="M4 7h16M4 7v12a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V7M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></>,
  boss: <><path d="M12 3 20 7v5c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V7Z" /></>,
  labs: <><path d="M9 3h6M10 3v6l-5 8a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 17l-5-8V3" /></>,
  papers: <><path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" /><path d="M14 3v5h5M8 13h8M8 17h5" /></>,
  experiments: <><path d="M4 20 10 4M20 20 14 4M4 20h16M9 13h6" /></>,
  ideas: <><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.2 1 2h6c0-.8.3-1.3 1-2A6 6 0 0 0 12 3Z" /></>,
  frontier: <><path d="M5 19 19 5M11 5h8v8" /></>,
  agent: <><rect x="4" y="8" width="16" height="11" rx="2" /><path d="M12 4v4M8.5 13h.01M15.5 13h.01M9 17h6" /></>,
  review: <><path d="M4 12a8 8 0 1 1 2.3 5.6M4 12v-4M4 12h4" /></>,
  weekly: <><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M4 9h16M8 3v4M16 3v4" /></>,
  guide: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.2 2.4c-.7.3-1.2.8-1.2 1.6M12 16.5h.01" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></>,
  admin: <><path d="M12 3 20 6v6c0 4.5-3.2 7-8 9-4.8-2-8-4.5-8-9V6Z" /><path d="M9 12l2 2 4-4" /></>,
  base: <><path d="M4 10 12 4l8 6v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" /><path d="M9 20v-6h6v6" /></>,
};

export function NavIcon({ name, size = 16, className = "" }: { name: string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {P[name] ?? <circle cx="12" cy="12" r="3" />}
    </svg>
  );
}
