import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Candidate } from "../../client/types.gen";

interface GeneratedInformationCardProps {
  candidate: Candidate;
}

export const GeneratedInformationCard: React.FC<
  GeneratedInformationCardProps
> = ({ candidate }) => (
  <Card className="md:col-span-2">
    <CardHeader>
      <CardTitle>Generated Information</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <Label>Generated Description</Label>
          <div className="font-medium mt-1">
            {candidate.generated_desc || "No generated description available."}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
