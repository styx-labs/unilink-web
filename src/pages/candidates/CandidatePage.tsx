import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ArrowLeft } from "lucide-react";
import BreadCrumbs from "../../components/breadcrumbs";
import { useCandidates } from "../../hooks/useCandidates";
import { PersonalInformationCard } from "../../components/PersonalInformationCard";
import { ProfessionalLinksCard } from "../../components/ProfessionalLinksCard";
import { GitHubRatingCard } from "../../components/GitHubRatingCard";
import { PortfolioRatingCard } from "../../components/PortfolioRatingCard";
import { GeneratedInformationCard } from "../../components/GeneratedInformationCard";
import { CandidatePageLoading } from "../../components/CandidatePageLoading";

const CandidatePage: React.FC = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const {
    candidates,
    loading,
    getCandidate,
    generateGitHubDescription,
    generatePortfolioRating,
  } = useCandidates();

  useEffect(() => {
    if (candidateId) {
      getCandidate(candidateId);
    }
  }, [candidateId]);

  const candidate = candidates[0];

  if (!candidate || loading) {
    return <CandidatePageLoading />;
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
              isGeneratingGitHubRating={loading}
              generateGitHubDescription={() =>
                generateGitHubDescription(candidate.candidate_id)
              }
            />
          )}
          {candidate.portfolio && (
            <PortfolioRatingCard
              candidate={candidate}
              isGeneratingPortfolioRating={loading}
              generatePortfolioRating={() =>
                generatePortfolioRating(candidate.candidate_id)
              }
            />
          )}
          <GeneratedInformationCard candidate={candidate} />
        </div>
      </div>
    </div>
  );
};

export default CandidatePage;
