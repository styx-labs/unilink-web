import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Mail, Phone } from "lucide-react";
import { CandidateWithId } from "../../client/types.gen";

interface PersonalInformationCardProps {
  candidate: CandidateWithId;
}

export const PersonalInformationCard: React.FC<
  PersonalInformationCardProps
> = ({ candidate }) => (
  <Card>
    <CardHeader>
      <CardTitle>Personal Information</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {(candidate.candidate_first_name || candidate.candidate_last_name) && (
          <div>
            <Label>Name</Label>
            <div className="font-medium">
              {`${candidate.candidate_first_name || ""} ${
                candidate.candidate_last_name || ""
              }`}
            </div>
          </div>
        )}
        {candidate.candidate_desc && (
          <div>
            <Label>Description</Label>
            <div className="font-normal whitespace-pre-wrap">
              {candidate.candidate_desc}
            </div>
          </div>
        )}
        {candidate.email && (
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <a
              href={`mailto:${candidate.email}`}
              className="text-primary hover:underline"
            >
              {candidate.email}
            </a>
          </div>
        )}
        {candidate.phone_number && (
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4" />
            <a
              href={`tel:${candidate.phone_number}`}
              className="text-primary hover:underline"
            >
              {candidate.phone_number}
            </a>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);
