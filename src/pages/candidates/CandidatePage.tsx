import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import {
  ArrowLeft,
  Mail,
  Phone,
  Linkedin,
  Github,
  FileText,
} from "lucide-react";
import axios from "axios";
import BreadCrumbs from "../../components/breadcrumbs";

interface Candidate {
  candidate_id: string;
  candidate_first_name: string;
  candidate_last_name: string;
  candidate_desc: string;
  email: string;
  phone_number: string;
  linkedin: string;
  github: string;
  resume: string;
  generated_desc: string;
  generated_score: number;
}

interface CandidatePageProps {
  nested: boolean;
}

const CandidatePage: React.FC<CandidatePageProps> = ({ nested }) => {
  const { companyId, roleId, candidateId } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = React.useState<Candidate | null>(null);

  React.useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const url = nested
          ? `${process.env.REACT_APP_API_BASE_URL}/companies/${companyId}/roles/${roleId}/candidates/${candidateId}`
          : `${process.env.REACT_APP_API_BASE_URL}/candidates/${candidateId}`;
        const response = await axios.get(url);
        setCandidate(response.data);
      } catch (error) {
        console.error("Error fetching candidate:", error);
      }
    };

    fetchCandidate();
  }, [companyId, roleId, candidateId, nested]);

  if (!candidate) {
    return <div>Loading...</div>;
  }

  const breadcrumbItems = nested
    ? [
        { label: "Companies", path: "/" },
        { label: "Roles", path: `/companies/${companyId}/roles` },
        {
          label: "Candidates",
          path: `/companies/${companyId}/roles/${roleId}/candidates`,
        },
        { label: candidate.candidate_first_name, path: "" },
      ]
    : [
        { label: "Candidates", path: "/candidates" },
        { label: candidate.candidate_first_name, path: "" },
      ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <BreadCrumbs items={breadcrumbItems} />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Candidate Details
          </h2>
          <Button
            variant="outline"
            onClick={() =>
              navigate(
                nested
                  ? `/companies/${companyId}/roles/${roleId}/candidates`
                  : "/candidates"
              )
            }
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Candidates
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <Label>Name</Label>
                  <div className="font-medium">{`${candidate.candidate_first_name} ${candidate.candidate_last_name}`}</div>
                </div>
                <div>
                  <Label>Description</Label>
                  <div className="font-medium">{candidate.candidate_desc}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <a
                    href={`mailto:${candidate.email}`}
                    className="text-primary hover:underline"
                  >
                    {candidate.email}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <a
                    href={`tel:${candidate.phone_number}`}
                    className="text-primary hover:underline"
                  >
                    {candidate.phone_number}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Professional Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Linkedin className="h-4 w-4" />
                  <a
                    href={candidate.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Github className="h-4 w-4" />
                  <a
                    href={candidate.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    GitHub Profile
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <a
                    href={candidate.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View Resume
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Generated Information</CardTitle>
              <CardDescription>
                AI-generated description and score based on candidate's profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Generated Description</Label>
                  <div className="font-medium mt-1">
                    {candidate.generated_desc ||
                      "No generated description available."}
                  </div>
                </div>
                {nested && (
                  <div>
                    <Label>Generated Score</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${candidate.generated_score}%` }}
                        ></div>
                      </div>
                      <span className="font-medium">
                        {candidate.generated_score}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CandidatePage;
