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
import {
  Star,
  ArrowLeft,
  Mail,
  Phone,
  Linkedin,
  Github,
  FileText,
} from "lucide-react";
import { Markdown } from "../../components/Markdown";
import BreadCrumbs from "../../components/breadcrumbs";
import {
  getCandidateEndpointCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdGet,
  generateCandidateRoleDescriptionEndpointCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdGenerateDescriptionPost,
  updateCandidateEndpointCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdPut,
} from "../../client/services.gen";
import {
  CandidateRole,
  CandidateRoleUpdate,
  CandidateRoleStatus,
} from "../../client/types.gen";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { CandidateRoleNoteType } from "../../client/types.gen";
import NotesInput from "../../components/inputs/NotesInput";
import { CriteriaScoresInput } from "../../components/inputs/CriteriaScoresInput";

const CandidateRolePage: React.FC = () => {
  const { companyId, roleId, candidateId } = useParams();
  const navigate = useNavigate();
  const [candidateRole, setCandidateRole] = useState<CandidateRole | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchCandidateRole = async () => {
    const { data, error } =
      await getCandidateEndpointCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdGet(
        {
          path: {
            company_id: companyId || "",
            role_id: roleId || "",
            candidate_id: candidateId || "",
          },
        }
      );
    if (error) {
      console.error("Error fetching candidate role:", error);
    } else {
      setCandidateRole(data!);
    }
  };

  useEffect(() => {
    fetchCandidateRole();
  }, [companyId, roleId, candidateId]);

  const generateRoleDescription = async () => {
    if (!candidateRole) return;
    setIsLoading(true);
    const { data, error } =
      await generateCandidateRoleDescriptionEndpointCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdGenerateDescriptionPost(
        {
          path: {
            company_id: companyId || "",
            role_id: roleId || "",
            candidate_id: candidateId || "",
          },
        }
      );
    if (error) {
      console.error("Error generating role description:", error);
    } else {
      setCandidateRole({
        ...candidateRole,
        candidate_role_generated_description: data,
      });
    }
    setIsLoading(false);
  };

  const updateCandidateRole = async (
    updatedCandidateRole: Partial<CandidateRole>
  ) => {
    const { data, error } =
      await updateCandidateEndpointCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdPut(
        {
          path: {
            company_id: companyId || "",
            role_id: roleId || "",
            candidate_id: candidateId || "",
          },
          body: updatedCandidateRole as CandidateRoleUpdate,
        }
      );
    if (error) {
      console.error("Error updating candidate role:", error);
    } else {
      setCandidateRole(data!);
    }
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
                updateCandidateRole(updatedCandidateRole);
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

      {/* General Information */}
      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {candidateRole.candidate?.email && (
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <a
                href={`mailto:${candidateRole.candidate.email}`}
                className="text-primary hover:underline"
              >
                {candidateRole.candidate.email}
              </a>
            </div>
          )}
          {candidateRole.candidate?.phone_number && (
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <a
                href={`tel:${candidateRole.candidate.phone_number}`}
                className="text-primary hover:underline"
              >
                {candidateRole.candidate.phone_number}
              </a>
            </div>
          )}
          {candidateRole.candidate?.linkedin && (
            <div className="flex items-center space-x-2">
              <Linkedin className="h-4 w-4" />
              <a
                href={candidateRole.candidate.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                LinkedIn Profile
              </a>
            </div>
          )}
          {candidateRole.candidate?.github && (
            <div className="flex items-center space-x-2">
              <Github className="h-4 w-4" />
              <a
                href={candidateRole.candidate.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GitHub Profile
              </a>
            </div>
          )}
          {candidateRole.candidate?.resume && (
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <a
                href={candidateRole.candidate.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View Resume
              </a>
            </div>
          )}
        </CardContent>
      </Card>

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
                  updateCandidateRole(updatedCandidateRole);
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
                updateCandidateRole(updatedCandidateRole);
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
