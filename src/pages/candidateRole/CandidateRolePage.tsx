"use client";

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
import { Textarea } from "../../components/ui/textarea";
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
  getCandidateCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdGet,
  generateCandidateRoleDescriptionCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdGenerateDescriptionPost,
  updateCandidateCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdPut,
} from "../../client/services.gen";
import {
  CandidateRole,
  CandidateRoleNote,
  CandidateRoleUpdate,
} from "../../client/types.gen";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { CandidateRoleNoteType } from "../../client/types.gen";

const CandidateRolePage: React.FC = () => {
  const { companyId, roleId, candidateId } = useParams();
  const navigate = useNavigate();
  const [candidateRole, setCandidateRole] = useState<CandidateRole | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [rating, setRating] = useState(0);
  const [activeTab, setActiveTab] = useState<string>("view");
  const [newNoteType, setNewNoteType] = useState<CandidateRoleNoteType>(
    CandidateRoleNoteType.OTHER
  );

  const fetchCandidateRole = async () => {
    const { data, error } =
      await getCandidateCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdGet({
        path: {
          company_id: companyId || "",
          role_id: roleId || "",
          candidate_id: candidateId || "",
        },
      });
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
      await generateCandidateRoleDescriptionCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdGenerateDescriptionPost(
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
      await updateCandidateCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdPut(
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

  const handleAddNote = async () => {
    if (newNote.trim() && candidateRole) {
      const updatedCandidateRole = {
        ...candidateRole,
        candidate_role_notes: [
          ...(candidateRole.candidate_role_notes || []),
          {
            type: newNoteType,
            notes: newNote,
            created_at: new Date().toISOString(),
          },
        ],
      };
      await updateCandidateRole(updatedCandidateRole);
      setNewNote("");
      setActiveTab("view");
    }
  };

  const handleRatingChange = async (newRating: number) => {
    // Implement API call to update rating
    setRating(newRating);
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
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 cursor-pointer ${
                    star <= rating
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                  onClick={() => handleRatingChange(star)}
                />
              ))}
            </div>
          </div>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="view">View Notes</TabsTrigger>
              <TabsTrigger value="add">Add Note</TabsTrigger>
            </TabsList>
            <TabsContent value="view">
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {candidateRole.candidate_role_notes &&
                candidateRole.candidate_role_notes.length > 0 ? (
                  candidateRole.candidate_role_notes.map(
                    (note: CandidateRoleNote, index: number) => (
                      <Card key={index} className="mb-4 last:mb-0">
                        <CardHeader>
                          <CardTitle className="text-sm font-medium">
                            {note.type} -{" "}
                            {new Date(note.created_at || "").toLocaleString()}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{note.notes}</p>
                        </CardContent>
                      </Card>
                    )
                  )
                ) : (
                  <p>No notes available.</p>
                )}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="add">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="note-type">Note Type</Label>
                  <Select
                    value={newNoteType}
                    onValueChange={(value) =>
                      setNewNoteType(value as CandidateRoleNoteType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select note type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(CandidateRoleNoteType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter a new note..."
                  className="min-h-[100px]"
                />
                <Button onClick={handleAddNote} className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Note
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateRolePage;
