// TODO: FIX issue when update it removes all other parts of candidate role

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { ScrollArea } from "../../components/ui/scroll-area";
import { ArrowLeft } from "lucide-react";
import { Markdown } from "../../components/Markdown";
import BreadCrumbs from "../../components/breadcrumbs";
import { CandidateRole, CandidateRoleStatus } from "../../client/types.gen";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { CandidateRoleNoteType, CandidateWithId } from "../../client/types.gen";
import NotesInput from "../../components/inputs/NotesInput";
import { CriteriaScoresInput } from "../../components/inputs/CriteriaScoresInput";
import { useCandidateRoles } from "../../hooks/useCandidateRoles";
import { ProfessionalLinksCard } from "../../components/ProfessionalLinksCard";

const CandidateRolePage: React.FC = () => {
  const { companyId, roleId, candidateId } = useParams();
  const navigate = useNavigate();
  const [candidateRole, setCandidateRole] = useState<CandidateRole | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const {
    getCandidateRole,
    generateCandidateRoleDescription,
    updateCandidateRole,
  } = useCandidateRoles();

  useEffect(() => {
    getCandidateRole(candidateId || "").then((role) => {
      setCandidateRole(role);
    });
  }, [companyId, roleId, candidateId]);

  const generateRoleDescription = async () => {
    if (!candidateRole) return;
    setIsLoading(true);
    const candidateDescription = await generateCandidateRoleDescription(
      candidateId || ""
    );
    setCandidateRole(() => ({
      ...candidateRole,
      candidate_role_generated_description: candidateDescription,
    }));
    setIsLoading(false);
  };

  const breadcrumbItems = [
    { label: "Companies", path: "/" },
    { label: "Roles", path: `/companies/${companyId}/roles` },
    {
      label: "Candidates",
      path: `/companies/${companyId}/roles/${roleId}/candidates`,
    },
  ];

  if (!candidateRole) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <BreadCrumbs items={breadcrumbItems} />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{`${candidateRole.candidate?.candidate_first_name} ${candidateRole.candidate?.candidate_last_name}`}</h1>
        <Button
          variant="outline"
          onClick={() =>
            navigate(`/companies/${companyId}/roles/${roleId}/candidates`)
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Candidates
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="candidate_role_status">Status</Label>
            <Select
              value={candidateRole.candidate_role_status || ""}
              onValueChange={(value) => {
                const updatedCandidateRole = {
                  ...candidateRole,
                  candidate_role_status: value as CandidateRoleStatus,
                };
                updateCandidateRole(updatedCandidateRole).then(() => {
                  setCandidateRole(updatedCandidateRole);
                });
              }}
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
          </div>
        </CardContent>
      </Card>

      <ProfessionalLinksCard
        candidate={candidateRole.candidate as CandidateWithId}
      />

      {/* Generated Description */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Role Description</CardTitle>
        </CardHeader>
        <CardContent>
          {candidateRole.candidate_role_generated_description ? (
            <>
              <ScrollArea className="w-full rounded-md p-4 mb-4">
                <Markdown
                  content={candidateRole.candidate_role_generated_description}
                />
              </ScrollArea>
              <Button onClick={generateRoleDescription} disabled={isLoading}>
                {isLoading ? "Regenerating..." : "Regenerate Description"}
              </Button>
            </>
          ) : (
            <div>
              <p className="mb-2">No generated description available.</p>
              <Button onClick={generateRoleDescription} disabled={isLoading}>
                {isLoading ? "Generating..." : "Generate Role Description"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes and Ratings */}
      <Card>
        <CardHeader>
          <CardTitle>Notes and Ratings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Rating</Label>
            <div className="flex items-center space-x-1 mt-1">
              <CriteriaScoresInput
                values={candidateRole.criteria_scores || []}
                onChange={(value) => {
                  const updatedCandidateRole = {
                    ...candidateRole,
                    criteria_scores: value,
                  };
                  updateCandidateRole(updatedCandidateRole).then(() => {
                    setCandidateRole(updatedCandidateRole);
                  });
                }}
              />
            </div>
          </div>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <NotesInput
              value={candidateRole.candidate_role_notes || []}
              onChange={(value) => {
                const updatedCandidateRole = {
                  ...candidateRole,
                  candidate_role_notes: value,
                };
                updateCandidateRole(updatedCandidateRole).then(() => {
                  setCandidateRole(updatedCandidateRole);
                });
              }}
              options={Object.values(CandidateRoleNoteType) || []}
            />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateRolePage;
