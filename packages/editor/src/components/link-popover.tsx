import type React from "react";
import { useState } from "react";
import { Button } from "@lana/ui";
import { Input } from "@lana/ui";
import { Label } from "@lana/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@lana/ui";

export function LinkPopover({
  isOpen,
  onClose,
  onSubmit,
  initialUrl = "",
  trigger,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
  initialUrl?: string;
  trigger: React.ReactElement;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setUrl(initialUrl);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
      onClose();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <PopoverTrigger render={trigger} />
      <PopoverContent className="w-80" side="bottom" align="start">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div>
            <Label className="text-sm font-medium" htmlFor="url">
              URL
            </Label>
            <Input
              autoFocus
              className="mt-1.5 focus:ring-2 focus:ring-primary/20 transition-all"
              id="url"
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  onClose();
                }
              }}
              placeholder="https://example.com"
              value={url}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" type="submit">
              Insert Link
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
