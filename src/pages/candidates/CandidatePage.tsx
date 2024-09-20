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
import {
  ArrowLeft,
  Mail,
  Phone,
  Linkedin,
  Github,
  FileText,
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";

import BreadCrumbs from "../../components/breadcrumbs";
import { Skeleton } from "../../components/ui/skeleton";
import {
  getCandidateEndpointCandidatesCandidateIdGet,
  rateCandidateGithubEndpointCandidatesCandidateIdGithubGet,
  rateCandidatePortfolioEndpointCandidatesCandidateIdPortfolioGet,
} from "../../client/services.gen";
import { Candidate } from "../../client/types.gen";

const CandidateLoading: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    </div>
  </div>
);

const PersonalInformationCard: React.FC<{ candidate: Candidate }> = ({
  candidate,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Personal Information</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {candidate.candidate_first_name ||
          (candidate.candidate_last_name && (
            <div>
              <Label>Name</Label>
              <div className="font-medium">{`${candidate.candidate_first_name} ${candidate.candidate_last_name}`}</div>
            </div>
          ))}
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

const ProfessionalLinksCard: React.FC<{ candidate: Candidate }> = ({
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
              href={candidate.linkedin}
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
              href={candidate.github}
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
              href={candidate.portfolio}
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
              href={candidate.resume}
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

const GitHubRatingCard: React.FC<{
  candidate: Candidate;
  isGeneratingGitHubRating: boolean;
  generateGitHubDescription: () => void;
}> = ({ candidate, isGeneratingGitHubRating, generateGitHubDescription }) => (
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

const PortfolioRatingCard: React.FC<{
  candidate: Candidate;
  isGeneratingPortfolioRating: boolean;
  generatePortfolioRating: () => void;
}> = ({ candidate, isGeneratingPortfolioRating, generatePortfolioRating }) => (
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

const GeneratedInformationCard: React.FC<{ candidate: Candidate }> = ({
  candidate,
}) => (
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

const CandidatePage: React.FC = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingGitHubRating, setIsGeneratingGitHubRating] =
    useState(false);
  const [isGeneratingPortfolioRating, setIsGeneratingPortfolioRating] = useState(false);

  const fetchCandidate = async () => {
    setIsLoading(true);
    const { data, error } = await getCandidateEndpointCandidatesCandidateIdGet({
      path: {
        candidate_id: candidateId || "",
      },
    });
    if (error) {
      console.error("Error fetching candidate:", error);
    } else {
      setCandidate(data!);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCandidate();
  }, [candidateId]);

  const generateGitHubDescription = async () => {
    if (!candidate) return;
    setIsGeneratingGitHubRating(true);
    const { data, error } =
      await rateCandidateGithubEndpointCandidatesCandidateIdGithubGet({
        path: { candidate_id: candidateId || "" },
      });
    if (error) {
      console.error("Error generating GitHub description:", error);
    } else {
      setCandidate({
        ...candidate,
        github_rating: data?.github_rating || {},
      });
    }
    setIsGeneratingGitHubRating(false);
  };

  const generatePortfolioRating = async () => {
    if (!candidate) return;
    setIsGeneratingPortfolioRating(true);
    const { data, error } = await rateCandidatePortfolioEndpointCandidatesCandidateIdPortfolioGet({
      path: { candidate_id: candidateId || "" },
    });
    if (error) {
      console.error("Error generating portfolio rating:", error);
    } else {
      setCandidate({
        ...candidate,
        portfolio_rating: data?.portfolio_rating || {},
      });
    }
    setIsGeneratingPortfolioRating(false);
  };

  if (!candidate || isLoading) {
    return <CandidateLoading />;
  }

  const breadcrumbItems = [
    { label: "Candidates", path: "/candidates" },
    {
      label:
        candidate.candidate_first_name + " " + candidate.candidate_last_name,
      path: "",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <BreadCrumbs items={breadcrumbItems} />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Candidate Details
          </h2>
          <Button variant="outline" onClick={() => navigate("/candidates")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Candidates
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PersonalInformationCard candidate={candidate} />
          <ProfessionalLinksCard candidate={candidate} />
          {candidate.github && (
            <GitHubRatingCard
              candidate={candidate}
              isGeneratingGitHubRating={isGeneratingGitHubRating}
              generateGitHubDescription={generateGitHubDescription}
            />
          )}
          {candidate.portfolio && (
            <PortfolioRatingCard
              candidate={candidate}
              isGeneratingPortfolioRating={isGeneratingPortfolioRating}
              generatePortfolioRating={generatePortfolioRating}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidatePage;
