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
import FoundersInput from "./FoundersInput";
import {
  CandidateRoleNote,
  CompanyFounder,
  CriteriaScoringItem,
} from "../lib/types";
import { RoleCriteria } from "../lib/types";

interface Field {
  id: string;
  label: string;
  type:
    | "input"
    | "textarea"
    | "select"
    | "url"
    | "email"
    | "tel"
    | "notes"
    | "array"
    | "founders"
    | "criteriascores";
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
  onGenerateCriteria?: () => void;
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
  onGenerateCriteria,
}: DialogFormProps) {
  const handleChange = (id: string, value: any) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
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
              {field.type === "array" && (
                <div className="col-span-3">
                  {((values[field.id] as RoleCriteria[]) || []).map(
                    (item, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <Input
                          type="text"
                          value={item.criteria_name}
                          onChange={(e) => {
                            const newArray = [
                              ...(values[field.id] as RoleCriteria[]),
                            ];
                            newArray[index] = { criteria_name: e.target.value };
                            handleChange(field.id, newArray);
                          }}
                          className="flex-grow"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newArray = [
                              ...(values[field.id] as RoleCriteria[]),
                            ];
                            newArray.splice(index, 1);
                            handleChange(field.id, newArray);
                          }}
                          className="ml-2"
                        >
                          Remove
                        </Button>
                      </div>
                    )
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newArray = [
                        ...((values[field.id] as RoleCriteria[]) || []),
                        { criteria_name: "" },
                      ];
                      handleChange(field.id, newArray);
                    }}
                  >
                    Add {field.label}
                  </Button>
                </div>
              )}
              {field.type === "founders" && (
                <FoundersInput
                  value={values[field.id] || []}
                  onChange={(founders: CompanyFounder[]) =>
                    handleChange(field.id, founders)
                  }
                  className="col-span-3"
                />
              )}
              {field.type === "criteriascores" && (
                <div className="col-span-3">
                  {((values[field.id] as CriteriaScoringItem[]) || []).map(
                    (item, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <Input
                          type="text"
                          value={item.criteria_name}
                          onChange={(e) => {
                            const newArray = [
                              ...(values[field.id] as CriteriaScoringItem[]),
                            ];
                            newArray[index] = {
                              ...newArray[index],
                              criteria_name: e.target.value,
                            };
                            handleChange(field.id, newArray);
                          }}
                          className="flex-grow mr-2"
                        />
                        <Input
                          type="number"
                          value={item.score}
                          onChange={(e) => {
                            const newArray = [
                              ...(values[field.id] as CriteriaScoringItem[]),
                            ];
                            newArray[index] = {
                              ...newArray[index],
                              score: parseFloat(e.target.value),
                            };
                            handleChange(field.id, newArray);
                          }}
                          className="w-24"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newArray = [
                              ...(values[field.id] as CriteriaScoringItem[]),
                            ];
                            newArray.splice(index, 1);
                            handleChange(field.id, newArray);
                          }}
                          className="ml-2"
                        >
                          Remove
                        </Button>
                      </div>
                    )
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newArray = [
                        ...((values[field.id] as CriteriaScoringItem[]) || []),
                        { criteria_name: "", score: 0 },
                      ];
                      handleChange(field.id, newArray);
                    }}
                  >
                    Add Criteria Score
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onSubmit}>Save changes</Button>
        </DialogFooter>
        {onGenerateCriteria && (
          <div className="flex justify-end mb-4">
            <Button onClick={onGenerateCriteria} variant="outline">
              Generate Criteria
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default DialogForm;
