import type { ReactNode } from "react";
import { cn } from "@lana/ui";

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "mb-5 inline-block border-[var(--border-grid)] px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-muted-foreground",
        className,
      )}
      style={{ fontFamily: "var(--ff-mono)" }}
    >
      {children}
    </div>
  );
}

export function Display({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h1
      className={cn(
        "mb-4 text-[52px] font-normal leading-[1.05] tracking-[-0.02em] text-foreground md:text-[64px]",
        className,
      )}
      style={{ fontFamily: "var(--ff-display)" }}
    >
      {children}
    </h1>
  );
}

export function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "mb-7 max-w-[360px] text-[13px] leading-[1.7] text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function MonoLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn("mb-4 text-[10px] uppercase tracking-[0.1em] text-muted-foreground", className)}
      style={{ fontFamily: "var(--ff-mono)" }}
    >
      {children}
    </div>
  );
}

export function StatN({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn("mb-1 text-[48px] font-normal leading-none tracking-[-0.03em]", className)}
      style={{ fontFamily: "var(--ff-display)" }}
    >
      {children}
    </div>
  );
}

export function StatL({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn("text-[10px] tracking-[0.08em] text-muted-foreground", className)}
      style={{ fontFamily: "var(--ff-mono)" }}
    >
      {children}
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("my-5 h-px bg-foreground opacity-[0.08]", className)} />;
}

export function FeatNum({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn("mb-5 text-[10px] text-muted-foreground", className)}
      style={{ fontFamily: "var(--ff-mono)" }}
    >
      {children}
    </div>
  );
}

export function FeatTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn("mb-2 text-[20px] font-normal", className)}
      style={{ fontFamily: "var(--ff-display)" }}
    >
      {children}
    </div>
  );
}

export function FeatDesc({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("text-[12px] leading-[1.7] text-muted-foreground", className)}>{children}</p>
  );
}

export function Blockquote({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn("mb-5 text-[22px] italic leading-[1.4] text-foreground", className)}
      style={{ fontFamily: "var(--ff-display)" }}
    >
      {children}
    </div>
  );
}
