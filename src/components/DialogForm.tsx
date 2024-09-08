import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface DialogFormProps {
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

function DialogForm({
  title,
  description,
  open,
  onOpenChange,
  onSubmit,
  children,
  footer,
}: DialogFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">{children}</div>
        <DialogFooter>
          {footer || <Button onClick={onSubmit}>Save changes</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DialogForm;
