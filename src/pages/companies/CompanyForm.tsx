import { useState, useEffect } from "react";
import { Company, CompanyFounder } from "../../lib/types";
import DialogForm from "../../components/DialogForm";
import { InputField, TextareaField } from "../../components/GenericInputFields";
import FoundersInput from "../../components/FoundersInput";

export function CompanyForm({
  company,
  onSubmit,
  open,
  onOpenChange,
  title,
  description,
}: {
  company: Partial<Company>;
  onSubmit: (company: Partial<Company>) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
}) {
  const [formData, setFormData] = useState<Partial<Company>>(company);

  useEffect(() => {
    setFormData(company);
  }, [company]);

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
      <InputField
        id="company_name"
        label="Company Name"
        value={formData.company_name || ""}
        onChange={(id, value) => setFormData({ ...formData, [id]: value })}
      />
      <TextareaField
        id="company_desc"
        label="Description"
        value={formData.company_desc || ""}
        onChange={(id, value) => setFormData({ ...formData, [id]: value })}
      />
      <FoundersInput
        value={formData.founders || []}
        onChange={(founders: CompanyFounder[]) =>
          setFormData({ ...formData, founders })
        }
      />
    </DialogForm>
  );
}
