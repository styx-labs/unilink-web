import { useState, useEffect } from "react";
import DialogForm from "../../components/DialogForm";
import {
  InputField,
  TextareaField,
  SelectField,
} from "../../components/GenericInputFields";
import api from "../../api/axiosConfig";
import { Role, RoleStatus } from "../../lib/types";
import { RoleCriteriaInput } from "../../components/RoleCriteriaInput";
import { Button } from "../../components/ui/button";
import { useParams } from "react-router-dom";
export function RoleForm({
  role,
  onSubmit,
  open,
  onOpenChange,
  title,
  description,
}: {
  role: Partial<Role>;
  onSubmit: (role: Partial<Role>) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
}) {
  const [formData, setFormData] = useState<Partial<Role>>(role);
  const { companyId } = useParams();
  useEffect(() => {
    setFormData(role);
  }, [role]);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const generateCriteria = async () => {
    if (!formData.role_id) return;
    try {
      const response = await api.post(
        `/companies/${companyId}/roles/${formData.role_id}/generate_criteria`
      );
      const generatedCriteria = response.data;
      setFormData({
        ...formData,
        role_criteria: generatedCriteria,
      });
    } catch (error) {
      console.error("Error generating criteria:", error);
    }
  };

  return (
    <DialogForm
      title={title}
      description={description}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
    >
      <InputField
        id="role_name"
        label="Role Name"
        value={formData.role_name || ""}
        onChange={(id, value) => setFormData({ ...formData, [id]: value })}
      />
      <TextareaField
        id="role_desc"
        label="Description"
        value={formData.role_desc || ""}
        onChange={(id, value) => setFormData({ ...formData, [id]: value })}
      />
      <TextareaField
        id="role_requirements"
        label="Requirements"
        value={formData.role_requirements || ""}
        onChange={(id, value) => setFormData({ ...formData, [id]: value })}
      />
      <RoleCriteriaInput
        id="role_criteria"
        label="Criteria"
        value={formData.role_criteria || []}
        onChange={(id, value) => setFormData({ ...formData, [id]: value })}
      />
      <SelectField
        id="role_type"
        label="Type"
        value={formData.role_status || ""}
        onChange={(id, value) => setFormData({ ...formData, [id]: value })}
        options={Object.values(RoleStatus)}
      />
      <Button onClick={generateCriteria}>Generate Criteria</Button>
    </DialogForm>
  );
}
