import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Linkedin, Github, FileText } from "lucide-react";
import { CandidateWithId } from "../../client/types.gen";
import { checkURL } from "../../lib/utils";
interface ProfessionalLinksCardProps {
  candidate: CandidateWithId;
}

export const ProfessionalLinksCard: React.FC<ProfessionalLinksCardProps> = ({
  candidate,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Professional Links</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {candidate.linkedin && (
          <div className="flex items-center space-x-2">
            <Linkedin className="h-4 w-4" />
            <a
              href={checkURL(candidate.linkedin)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              LinkedIn Profile
            </a>
          </div>
        )}
        {candidate.github && (
          <div className="flex items-center space-x-2">
            <Github className="h-4 w-4" />
            <a
              href={checkURL(candidate.github)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GitHub Profile
            </a>
          </div>
        )}
        {candidate.portfolio && (
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <a
              href={checkURL(candidate.portfolio)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Portfolio
            </a>
          </div>
        )}
        {candidate.resume && (
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <a
              href={checkURL(candidate.resume)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              View Resume
            </a>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);
