"use client";

import { Button, Input, Label } from "@andi/ui";
import { Upload } from "lucide-react";
import React, { useState } from "react";

interface ImagePopoverContentProps {
  onSubmit: (src: string, alt: string) => void;
  onCancel: () => void;
}

export function ImagePopoverContent({ onSubmit, onCancel }: ImagePopoverContentProps) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) onSubmit(result, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-2">
      <div className="grid gap-1">
        <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
          URL
        </Label>
        <Input
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="h-8 text-xs focus:ring-1 focus:ring-primary/30"
        />
      </div>
      <div className="grid gap-1">
        <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
          Alt Text
        </Label>
        <Input
          placeholder="Description"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          className="h-8 text-xs focus:ring-1 focus:ring-primary/30"
        />
      </div>
      <div className="flex justify-end gap-2 mt-1">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" disabled={!url} onClick={() => onSubmit(url, alt)}>
          Insert
        </Button>
      </div>
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-[9px] uppercase">
          <span className="bg-popover px-2 text-muted-foreground tracking-tighter">Or</span>
        </div>
      </div>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
      />
      <Button
        variant="outline"
        size="sm"
        className="w-full h-8 text-xs hover:bg-accent"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="size-3 mr-2" />
        Upload file
      </Button>
    </div>
  );
}
