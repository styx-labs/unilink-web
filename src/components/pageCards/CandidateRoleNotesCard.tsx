import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { CriteriaScoresInput } from "../inputs/CriteriaScoresInput";
import NotesInput from "../inputs/NotesInput";
import { CandidateRoleNoteType } from "../../client/types.gen";
import { CandidateRole } from "../../client/types.gen";
import { ScrollArea } from "../ui/scroll-area";
import { UpdateCandidateEndpointCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdPutResponse } from "../../client/types.gen";
export const CandidateRoleNotesCard: React.FC<{
  candidateRole: CandidateRole;
  updateCandidateRole: (
    updatedCandidateRole: Partial<CandidateRole>
  ) => Promise<
    | UpdateCandidateEndpointCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdPutResponse
    | undefined
  >;
  setCandidateRole: (candidateRole: CandidateRole) => void;
}> = ({ candidateRole, updateCandidateRole, setCandidateRole }) => {
  return (
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
  );
};
