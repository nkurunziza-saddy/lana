"use client";

import { cn } from "@/lib/utils";

interface Props {
  orientation?: "vertical" | "horizontal";
}
const Separator = ({ orientation = "vertical" }: Props) => {
  return (
    <div
      className={cn(
        "bg-border/55",
        orientation === "horizontal" ? "my-1.5 h-px w-6" : "mx-1.5 h-4.5 w-px shrink-0",
      )}
    />
  );
};

export { Separator };
