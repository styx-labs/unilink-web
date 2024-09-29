import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Skeleton } from "./ui/skeleton";
import { CandidateWithId } from "../client/types.gen";
import { Label } from "./ui/label";
interface GitHubRatingCardProps {
  candidate: CandidateWithId;
  isGeneratingGitHubRating: boolean;
  generateGitHubDescription: () => void;
}

export const GitHubRatingCard: React.FC<GitHubRatingCardProps> = ({
  candidate,
  isGeneratingGitHubRating,
  generateGitHubDescription,
}) => (
  <Card className="md:col-span-2">
    <CardHeader>
      <CardTitle>GitHub Rating</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      {isGeneratingGitHubRating ? (
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
      ) : candidate.github_rating ? (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-2">Overall Score</h3>
            <div className="flex items-center space-x-4">
              <Progress
                value={(candidate.github_rating.overall_score as number) * 10}
                className="w-full"
              />
              <span className="text-2xl font-bold">
                {(candidate.github_rating.overall_score as number).toFixed(2)}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Language Proficiency</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(
                candidate.github_rating.language_proficiency || {}
              ).map(([language, level]) => (
                <Badge
                  key={language}
                  variant={level === "Intermediate" ? "default" : "secondary"}
                >
                  {language}: {level}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Top Repositories Analysis
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {(candidate.github_rating.top_repos_analysis as any[]).map(
                (repo: any, index: number) => {
                  const analysis =
                    typeof repo.analysis === "string"
                      ? JSON.parse(repo.analysis)
                      : repo.analysis;
                  return (
                    <AccordionItem value={`repo-${index}`} key={index}>
                      <AccordionTrigger>{repo.repo_name}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Complexity:</span>
                            <Badge variant="outline">
                              {analysis.complexity_rating}/10
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Quality:</span>
                            <Badge variant="outline">
                              {analysis.quality_rating}/10
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Impact:</span>
                            <Badge variant="outline">
                              {analysis.impact_rating}/10
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {analysis.comments}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                }
              )}
            </Accordion>
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <Label>No GitHub rating available.</Label>
        </div>
      )}
      <Button
        onClick={generateGitHubDescription}
        disabled={isGeneratingGitHubRating}
        className="mt-2"
      >
        {isGeneratingGitHubRating
          ? "Generating..."
          : candidate.github_rating
          ? "Regenerate Description"
          : "Generate Description"}
      </Button>
    </CardContent>
  </Card>
);
