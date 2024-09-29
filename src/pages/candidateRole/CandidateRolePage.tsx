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
import { ArrowLeft } from "lucide-react";
import BreadCrumbs from "../../components/breadcrumbs";
import { CandidateRole, CandidateRoleStatus } from "../../client/types.gen";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { CandidateWithId } from "../../client/types.gen";
import { useCandidateRoles } from "../../hooks/useCandidateRoles";
import { CandidateRoleNotesCard } from "../../components/pageCards/CandidateRoleNotesCard";
import { ProfessionalLinksCard } from "../../components/pageCards/ProfessionalLinksCard";
import { CandidatePageLoading } from "../../components/pageCards/CandidatePageLoading";
import { GeneratedDescriptionCard } from "../../components/pageCards/GeneratedDescriptionCard";
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
    return <CandidatePageLoading />;
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

      <GeneratedDescriptionCard
        candidateRole={candidateRole}
        generateRoleDescription={generateRoleDescription}
        isLoading={isLoading}
      />

      <CandidateRoleNotesCard
        candidateRole={candidateRole}
        updateCandidateRole={updateCandidateRole}
        setCandidateRole={setCandidateRole}
      />
    </div>
  );
};

export default CandidateRolePage;
