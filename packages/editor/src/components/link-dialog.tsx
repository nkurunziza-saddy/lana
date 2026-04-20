import type React from "react";
import { useState } from "react";

import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Label } from "@lana/ui";

export function LinkDialog({
  isOpen,
  onClose,
  onSubmit,
  initialUrl = "",
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
  initialUrl?: string;
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
    }
    onClose();
  };

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent
        aria-describedby="link-dialog"
        className="sm:max-w-md backdrop-blur-md bg-background/95"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Insert Link</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
          <div>
            <Label className="text-sm font-medium" htmlFor="url">
              URL
            </Label>
            <Input
              autoFocus
              className="mt-1.5 focus:ring-2 focus:ring-primary/20 transition-all"
              id="url"
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              value={url}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button onClick={onClose} type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">Insert Link</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
