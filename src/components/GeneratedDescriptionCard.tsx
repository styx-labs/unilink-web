import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Markdown } from "./Markdown";
import { Button } from "./ui/button";
import { CandidateRole } from "../client/types.gen";
export const GeneratedDescriptionCard: React.FC<{
  candidateRole: CandidateRole;
  generateRoleDescription: () => void;
  isLoading: boolean;
}> = ({ candidateRole, generateRoleDescription, isLoading }) => {
  return (
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
  );
};
