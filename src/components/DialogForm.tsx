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
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface Field {
  id: string;
  label: string;
  type: "input" | "textarea";
}

interface DialogFormProps {
  title: string;
  description: string;
  fields: Field[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  values: any;
  setValues: (values: any) => void;
}

const DialogForm: React.FC<DialogFormProps> = ({
  title,
  description,
  fields,
  open,
  onOpenChange,
  onSubmit,
  values,
  setValues,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {fields.map((field) => (
            <div key={field.id} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.id} className="text-right">
                {field.label}
              </Label>
              {field.type === "input" ? (
                <Input
                  id={field.id}
                  value={values[field.id] || ""}
                  onChange={(e) =>
                    setValues({ ...values, [field.id]: e.target.value })
                  }
                  className="col-span-3"
                />
              ) : (
                <Textarea
                  id={field.id}
                  value={values[field.id] || ""}
                  onChange={(e) =>
                    setValues({ ...values, [field.id]: e.target.value })
                  }
                  className="col-span-3"
                />
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogForm;
