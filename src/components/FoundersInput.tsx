import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "../lib/utils";
import { CompanyFounder } from "../lib/types";
import { Edit, Plus, Trash2 } from "lucide-react";

interface FoundersInputProps {
  value: CompanyFounder[];
  onChange: (founders: CompanyFounder[]) => void;
  className?: string;
}

const FoundersInput: React.FC<FoundersInputProps> = ({
  value,
  onChange,
  className,
}) => {
  const [currentFounder, setCurrentFounder] = useState<CompanyFounder>({
    founder_name: "",
    founder_role: "",
    founder_email: "",
    founder_phone: "",
    founder_linkedin_url: "",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addOrUpdateFounder = () => {
    if (currentFounder.founder_name && currentFounder.founder_role) {
      if (editingIndex !== null) {
        const updatedFounders = [...value];
        updatedFounders[editingIndex] = currentFounder;
        onChange(updatedFounders);
        setEditingIndex(null);
      } else {
        onChange([...value, currentFounder]);
      }
      setCurrentFounder({
        founder_name: "",
        founder_role: "",
        founder_email: "",
        founder_phone: "",
        founder_linkedin_url: "",
      });
      setIsDialogOpen(false);
    }
  };

  const editFounder = (index: number) => {
    setCurrentFounder(value[index]);
    setEditingIndex(index);
    setIsDialogOpen(true);
  };

  const deleteFounder = (index: number) => {
    const updatedFounders = value.filter((_, i) => i !== index);
    onChange(updatedFounders);
  };

  const openNewFounderDialog = () => {
    setCurrentFounder({
      founder_name: "",
      founder_role: "",
      founder_email: "",
      founder_phone: "",
      founder_linkedin_url: "",
    });
    setEditingIndex(null);
    setIsDialogOpen(true);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Card>
        <CardHeader>
          <CardTitle>Company Founders</CardTitle>
          <CardDescription>Manage founders for this company</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            {value.map((founder, index) => (
              <Card key={index} className="mb-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {founder.founder_name}
                  </CardTitle>
                  <CardDescription>{founder.founder_role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {founder.founder_email}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editFounder(index)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteFounder(index)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <Button onClick={openNewFounderDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Founder
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? "Edit Founder" : "Add New Founder"}
            </DialogTitle>
            <DialogDescription>
              {editingIndex !== null
                ? "Make changes to the existing founder."
                : "Enter details for the new founder."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="founder-name" className="text-right">
                Name
              </Label>
              <Input
                id="founder-name"
                value={currentFounder.founder_name}
                onChange={(e) =>
                  setCurrentFounder({
                    ...currentFounder,
                    founder_name: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="founder-role" className="text-right">
                Role
              </Label>
              <Input
                id="founder-role"
                value={currentFounder.founder_role}
                onChange={(e) =>
                  setCurrentFounder({
                    ...currentFounder,
                    founder_role: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="founder-email" className="text-right">
                Email
              </Label>
              <Input
                id="founder-email"
                type="email"
                value={currentFounder.founder_email}
                onChange={(e) =>
                  setCurrentFounder({
                    ...currentFounder,
                    founder_email: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="founder-phone" className="text-right">
                Phone
              </Label>
              <Input
                id="founder-phone"
                type="tel"
                value={currentFounder.founder_phone}
                onChange={(e) =>
                  setCurrentFounder({
                    ...currentFounder,
                    founder_phone: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="founder-linkedin" className="text-right">
                LinkedIn URL
              </Label>
              <Input
                id="founder-linkedin"
                type="url"
                value={currentFounder.founder_linkedin_url}
                onChange={(e) =>
                  setCurrentFounder({
                    ...currentFounder,
                    founder_linkedin_url: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addOrUpdateFounder}>
              {editingIndex !== null ? "Update Founder" : "Add Founder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FoundersInput;
