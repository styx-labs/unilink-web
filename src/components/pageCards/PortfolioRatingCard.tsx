import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Skeleton } from "../ui/skeleton";
import { CandidateWithId } from "../../client/types.gen";

interface PortfolioRatingCardProps {
  candidate: CandidateWithId;
  isGeneratingPortfolioRating: boolean;
  generatePortfolioRating: () => void;
}

export const PortfolioRatingCard: React.FC<PortfolioRatingCardProps> = ({
  candidate,
  isGeneratingPortfolioRating,
  generatePortfolioRating,
}) => (
  <Card className="md:col-span-2">
    <CardHeader>
      <CardTitle>Portfolio Rating</CardTitle>
    </CardHeader>
    <CardContent>
      {isGeneratingPortfolioRating ? (
        <div className="space-y-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <div className="space-y-1">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      ) : candidate.portfolio_rating ? (
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold mb-2">Overall Score</h4>
            <div className="flex items-center space-x-4">
              <Progress
                value={
                  (candidate.portfolio_rating.overall_score as number) * 10
                }
                className="w-full"
              />
              <span className="text-2xl font-bold">
                {(candidate.portfolio_rating.overall_score as number).toFixed(
                  2
                )}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {(candidate.portfolio_rating.skills as string[]).map(
                (skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                )
              )}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Ratings</h4>
            <div className="space-y-2">
              {Object.entries(
                candidate.portfolio_rating.ratings as Record<string, number>
              ).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="capitalize">{key.replace("_", " ")}:</span>
                  <Progress value={value * 10} className="w-1/2" />
                  <span>{value}/10</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Projects</h4>
            <ul className="list-disc list-inside">
              {(candidate.portfolio_rating.projects as string[]).map(
                (project, index) => (
                  <li key={index} className="text-sm">
                    {project}
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Summary</h4>
            <p className="text-sm text-muted-foreground">
              {candidate.portfolio_rating.summary as string}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Comments</h4>
            <p className="text-sm text-muted-foreground">
              {candidate.portfolio_rating.comments as string}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Overall Analysis</h4>
            <p className="text-sm text-muted-foreground">
              {candidate.portfolio_rating.overall_analysis as string}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          No portfolio rating available.
        </div>
      )}
      <Button
        onClick={generatePortfolioRating}
        disabled={isGeneratingPortfolioRating}
        className="mt-4"
      >
        {isGeneratingPortfolioRating
          ? "Generating..."
          : candidate.portfolio_rating
          ? "Regenerate Rating"
          : "Generate Rating"}
      </Button>
    </CardContent>
  </Card>
);
