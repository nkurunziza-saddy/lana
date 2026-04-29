export function Ticker({ items }: { items: string[] }) {
  const doubled = [...items, ...items, ...items, ...items];
  return (
    <div
      className="overflow-hidden py-[11px]"
      style={{
        borderBottom: "var(--border-grid)",
      }}
    >
      <div className="flex w-max animate-ticker gap-0">
        {doubled.map((item, i) => (
          <div
            key={i}
            className="whitespace-nowrap px-9 text-[11px] tracking-[0.06em] text-muted-foreground"
            style={{
              fontFamily: "var(--ff-mono)",
              borderRight: "var(--border-grid)",
            }}
          >
            {item}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
