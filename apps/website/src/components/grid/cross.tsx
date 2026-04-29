type Corner = "tl" | "tr" | "bl" | "br";

export function Cross({ corner }: { corner: Corner }) {
  const pos: Record<Corner, object> = {
    tl: { top: -6, left: -6 },
    tr: { top: -6, right: -6 },
    bl: { bottom: -6, left: -6 },
    br: { bottom: -6, right: -6 },
  };

  return (
    <div
      style={{
        position: "absolute",
        width: 12,
        height: 12,
        pointerEvents: "none",
        zIndex: 10,
        ...pos[corner],
      }}
    >
      {/* vertical bar */}
      <div
        style={{
          position: "absolute",
          width: 1,
          height: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          background: "currentColor",
          opacity: 0.3,
        }}
      />
      {/* horizontal bar */}
      <div
        style={{
          position: "absolute",
          height: 1,
          width: "100%",
          top: "50%",
          transform: "translateY(-50%)",
          background: "currentColor",
          opacity: 0.3,
        }}
      />
    </div>
  );
}
