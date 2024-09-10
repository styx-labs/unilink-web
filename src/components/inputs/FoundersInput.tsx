import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { cn } from "../../lib/utils";
import { CompanyFounder } from "../../client/types.gen";
import { Edit, Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Link } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { formatPhoneNumber } from "react-phone-number-input";

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
    } else {
      // Show an error message or handle invalid input
      alert("Please enter valid founder information.");
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
      <Label>Company Founders</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {value.map((founder, index) => (
          <Card key={index} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle>{founder.founder_name}</CardTitle>
              <CardDescription>{founder.founder_role}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col align-start">
              {founder.founder_email && (
                <p className="text-sm">
                  <Link
                    to={`mailto:${founder.founder_email}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {founder.founder_email}
                  </Link>
                </p>
              )}
              {founder.founder_phone && (
                <p className="text-sm">
                  <Link
                    to={`sms:${founder.founder_phone}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {formatPhoneNumber(founder.founder_phone) ||
                      founder.founder_phone}
                  </Link>
                </p>
              )}
              {founder.founder_linkedin_url && (
                <Link
                  to={founder.founder_linkedin_url}
                  className="text-sm text-blue-600 hover:text-blue-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {founder.founder_linkedin_url}
                </Link>
              )}
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
      </div>
      <Button onClick={openNewFounderDialog}>
        <Plus className="h-4 w-4 mr-2" />
        Add New Founder
      </Button>

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
            <div className="grid gap-2">
              <Label htmlFor="founder-name">Name</Label>
              <Input
                id="founder-name"
                value={currentFounder.founder_name}
                onChange={(e) =>
                  setCurrentFounder({
                    ...currentFounder,
                    founder_name: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="founder-role">Role</Label>
              <Input
                id="founder-role"
                value={currentFounder.founder_role}
                onChange={(e) =>
                  setCurrentFounder({
                    ...currentFounder,
                    founder_role: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="founder-email">Email</Label>
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
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="founder-phone">Phone</Label>
              <PhoneInput
                id="founder-phone"
                value={currentFounder.founder_phone}
                onChange={(value) =>
                  setCurrentFounder({
                    ...currentFounder,
                    founder_phone: value || "",
                  })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                defaultCountry="US"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="founder-linkedin">LinkedIn URL</Label>
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
