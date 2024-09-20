import { useState, useEffect } from "react";
import DialogForm from "../../components/DialogForm";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../components/ui/select";
import NotesInput from "../../components/inputs/NotesInput";
import { CriteriaScoresInput } from "../../components/inputs/CriteriaScoresInput";
import {
  CandidateRole,
  CandidateRoleStatus,
  CandidateRoleNoteType,
  CandidateRoleNote,
  CriteriaScoringItem,
} from "../../client/types.gen";
import { generateCandidateRoleDescriptionEndpointCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdGenerateDescriptionPost } from "../../client/services.gen";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";

import { Markdown } from "../../components/Markdown";
import { ScrollArea } from "../../components/ui/scroll-area";

interface CandidateRoleFormProps {
  candidateRole: Partial<CandidateRole>;
  onSubmit: (candidateRole: Partial<CandidateRole>) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  companyId: string;
  roleId: string;
}

const fields = [
  {
    id: "candidate_role_status",
    label: "Status",
    type: "select" as const,
    options: Object.values(CandidateRoleStatus),
  },
  {
    id: "criteria_scores",
    label: "Criteria Scores",
    type: "criteriascores" as const,
  },
  {
    id: "candidate_role_notes",
    label: "Notes",
    type: "notes" as const,
    options: Object.values(CandidateRoleNoteType),
  },
];

export function CandidateRoleForm({
  candidateRole,
  onSubmit,
  open,
  onOpenChange,
  isEditing,
  companyId,
  roleId,
}: CandidateRoleFormProps) {
  const [formData, setFormData] =
    useState<Partial<CandidateRole>>(candidateRole);

  useEffect(() => {
    setFormData(candidateRole);
  }, [candidateRole]);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const generateCandidateRoleDescription = async () => {
    const { data, error } =
      await generateCandidateRoleDescriptionEndpointCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdGenerateDescriptionPost(
        {
          path: {
            company_id: companyId,
            role_id: roleId,
            candidate_id: candidateRole.candidate_id || "",
          },
        }
      );
    if (error) {
      console.error("Error generating description:", error);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        candidate_role_generated_description: data,
      }));
    }
  };

  return (
    <DialogForm
      title={isEditing ? "Edit Candidate Role" : "Add Candidate Role"}
      description={
        isEditing
          ? "Edit the candidate role here."
          : "Enter details for the new candidate role."
      }
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            {renderField(field, formData, setFormData)}
          </div>
        ))}
        <Button onClick={generateCandidateRoleDescription}>
          Generate Description
        </Button>
        <div className="space-y-2">
          <Label htmlFor="generated-description">Generated Description</Label>
          <ScrollArea className="h-[200px] w-full border rounded-md p-4">
            {formData.candidate_role_generated_description ? (
              <Markdown
                content={formData.candidate_role_generated_description}
              />
            ) : (
              <p className="text-muted-foreground italic">
                No description generated yet
              </p>
            )}
          </ScrollArea>
        </div>
      </div>
    </DialogForm>
  );
}

function renderField(
  field: { id: string; label: string; type: string; options?: string[] },
  formData: Partial<CandidateRole>,
  setFormData: React.Dispatch<React.SetStateAction<Partial<CandidateRole>>>
) {
  switch (field.type) {
    case "select":
      return (
        <Select
          value={formData.candidate_role_status || ""}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              candidate_role_status: value as CandidateRoleStatus,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(CandidateRoleStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "notes":
      return (
        <NotesInput
          value={formData.candidate_role_notes || []}
          onChange={(notes: CandidateRoleNote[]) =>
            setFormData({
              ...formData,
              candidate_role_notes: notes,
            })
          }
          options={field.options || []}
        />
      );
    case "criteriascores":
      return (
        <CriteriaScoresInput
          values={formData.criteria_scores || []}
          onChange={(scores: CriteriaScoringItem[]) =>
            setFormData({
              ...formData,
              criteria_scores: scores,
            })
          }
        />
      );
    default:
      return null;
  }
}
