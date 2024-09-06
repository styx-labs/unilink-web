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
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import NotesInput from "./NotesInput";
import { CandidateRoleNote } from "../lib/types";
interface Field {
  id: string;
  label: string;
  type: "input" | "textarea" | "select" | "url" | "email" | "tel" | "notes";
  options?: string[];
}

interface DialogFormProps {
  title: string;
  description: string;
  fields: Field[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  values: Record<string, any>;
  setValues: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}

function DialogForm({
  title,
  description,
  fields,
  open,
  onOpenChange,
  onSubmit,
  values,
  setValues,
}: DialogFormProps) {
  const handleChange = (
    id: string,
    value: string | number | readonly string[] | CandidateRoleNote[]
  ) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
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
              {field.type === "input" && (
                <Input
                  id={field.id}
                  value={values[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="col-span-3"
                />
              )}
              {field.type === "textarea" && (
                <Textarea
                  id={field.id}
                  value={values[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="col-span-3"
                />
              )}
              {field.type === "select" && (
                <Select
                  value={values[field.id] || ""}
                  onValueChange={(value) => handleChange(field.id, value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {(field.type === "url" ||
                field.type === "email" ||
                field.type === "tel") && (
                <Input
                  id={field.id}
                  type={field.type}
                  value={values[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="col-span-3"
                />
              )}
              {field.type === "notes" && (
                <NotesInput
                  value={values[field.id] || []}
                  onChange={(notes: CandidateRoleNote[]) =>
                    handleChange(field.id, notes)
                  }
                  options={field.options || []}
                  className="col-span-3"
                />
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DialogForm;
