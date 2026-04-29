/* oxlint-disable */
// @ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const LAYOUTS = [
  { label: "2 columns (equal)", value: "1fr 1fr" },
  { label: "2 columns (25/75)", value: "1fr 3fr" },
  { label: "3 columns (equal)", value: "1fr 1fr 1fr" },
  { label: "4 columns (equal)", value: "1fr 1fr 1fr 1fr" },
];

interface LayoutPopoverContentProps {
  onSubmit: (template: string) => void;
  onCancel: () => void;
}

export function LayoutPopoverContent({ onSubmit, onCancel }: LayoutPopoverContentProps) {
  const [layout, setLayout] = useState(LAYOUTS[0].value);
  const selected = LAYOUTS.find((l) => l.value === layout);

  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="grid gap-1.5">
        <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
          Layout
        </Label>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" className="h-8 w-full justify-between px-2 text-xs">
                {selected?.label}
                <ChevronDown className="size-3 opacity-50" />
              </Button>
            }
          />
          <DropdownMenuContent className="w-56">
            {LAYOUTS.map((l) => (
              <DropdownMenuItem
                key={l.value}
                closeOnClick
                onClick={() => setLayout(l.value)}
                className="text-xs"
              >
                {l.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={() => onSubmit(layout)}>
          Insert
        </Button>
      </div>
    </div>
  );
}
