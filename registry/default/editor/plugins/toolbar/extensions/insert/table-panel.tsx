/* oxlint-disable */
// @ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface TablePopoverContentProps {
  onSubmit: (rows: number, columns: number) => void;
  onCancel: () => void;
}

export function TablePopoverContent({ onSubmit, onCancel }: TablePopoverContentProps) {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);

  return (
    <div className="p-2 flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Rows
          </Label>
          <Input
            type="number"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="h-8 text-xs focus:ring-1 focus:ring-primary/30"
          />
        </div>
        <div className="grid gap-1.5">
          <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Cols
          </Label>
          <Input
            type="number"
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            className="h-8 text-xs focus:ring-1 focus:ring-primary/30"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={() => onSubmit(rows, columns)}>
          Insert Table
        </Button>
      </div>
    </div>
  );
}
