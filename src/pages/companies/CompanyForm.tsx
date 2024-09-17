import { useState, useEffect } from "react";
import { Company, CompanyFounder, CompanyStatus } from "../../client/types.gen";
import DialogForm from "../../components/DialogForm";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import FoundersInput from "../../components/inputs/FoundersInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

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
      <div className="space-y-4">
        <div>
          <Label>Company Name</Label>
          <Input
            id="company_name"
            value={formData.company_name || ""}
            onChange={(e) =>
              setFormData({ ...formData, company_name: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status || ""}
            onValueChange={(value) =>
              setFormData({ ...formData, status: value as CompanyStatus })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(CompanyStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            id="company_desc"
            value={formData.company_desc || ""}
            onChange={(e) =>
              setFormData({ ...formData, company_desc: e.target.value })
            }
          />
        </div>
        <div>
          <Label>Contract Size</Label>
          <Input
            id="contract_size"
            value={formData.contract_size || ""}
            onChange={(e) =>
              setFormData({ ...formData, contract_size: e.target.value })
            }
          />
        </div>
        <FoundersInput
          value={formData.founders || []}
          onChange={(founders: CompanyFounder[]) =>
            setFormData({ ...formData, founders })
          }
        />
      </div>
    </DialogForm>
  );
}
