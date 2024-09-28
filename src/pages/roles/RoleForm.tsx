import { useState, useEffect } from "react";
import DialogForm from "../../components/DialogForm";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { useParams } from "react-router-dom";
import { RoleWithId, RoleStatus } from "../../client/types.gen";
import { RoleCriteriaInput } from "../../components/inputs/RoleCriteriaInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export function RoleForm({
  role,
  onSubmit,
  open,
  onOpenChange,
  title,
  description,
}: {
  role: Partial<RoleWithId>;
  onSubmit: (role: Partial<RoleWithId>) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
}) {
  const [formData, setFormData] = useState<Partial<RoleWithId>>(role);
  const { companyId } = useParams();

  useEffect(() => {
    setFormData(role);
  }, [role]);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <DialogForm
      title={title}
      description={description}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="role_name">Role Name</Label>
          <Input
            id="role_name"
            value={formData.role_name || ""}
            onChange={(e) =>
              setFormData({ ...formData, role_name: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="role_status">Status</Label>
          <Select
            value={formData.role_status || ""}
            onValueChange={(value) =>
              setFormData({ ...formData, role_status: value as RoleStatus })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(RoleStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="meeting_link">Meeting Link</Label>
          <Input
            id="meeting_link"
            value={formData.meeting_link || ""}
            type="url"
            onChange={(e) =>
              setFormData({ ...formData, meeting_link: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="role_desc">Description</Label>
          <Textarea
            id="role_desc"
            value={formData.role_desc || ""}
            onChange={(e) =>
              setFormData({ ...formData, role_desc: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="role_requirements">Requirements</Label>
          <Textarea
            id="role_requirements"
            value={formData.role_requirements || ""}
            onChange={(e) =>
              setFormData({ ...formData, role_requirements: e.target.value })
            }
          />
        </div>
        <div>
          <RoleCriteriaInput
            id="role_criteria"
            label="Role Criteria"
            value={formData.role_criteria || []}
            onChange={(id, value) => setFormData({ ...formData, [id]: value })}
            companyId={companyId || ""}
            roleId={formData.role_id}
            onGenerateCriteria={(generatedCriteria) => {
              setFormData({
                ...formData,
                role_criteria: generatedCriteria,
              });
            }}
          />
        </div>
      </div>
    </DialogForm>
  );
}
