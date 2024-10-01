import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ArrowLeft } from "lucide-react";
import BreadCrumbs from "../../components/breadcrumbs";
import { PersonalInformationCard } from "../../components/pageCards/PersonalInformationCard";
import { ProfessionalLinksCard } from "../../components/pageCards/ProfessionalLinksCard";
import { GitHubRatingCard } from "../../components/pageCards/GitHubRatingCard";
import { PortfolioRatingCard } from "../../components/pageCards/PortfolioRatingCard";
import { GeneratedDescriptionCard } from "../../components/pageCards/GeneratedDescriptionCard";
import { CandidatePageLoading } from "../../components/pageCards/CandidatePageLoading";
import { CandidateWithId } from "../../client/types.gen";
import { getCandidateEndpointCandidatesCandidateIdGet } from "../../client/services.gen";
import { useCandidates } from "../../hooks/useCandidates";

const CandidatePage: React.FC = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<CandidateWithId | null>(null);

  const {
    generateGitHubDescription,
    generatePortfolioRating,
    generateDescription,
    getCandidate,
    loadingStates,
  } = useCandidates();

  useEffect(() => {
    const fetchCandidate = async () => {
      if (candidateId) {
        const returnedCandidate = await getCandidate(candidateId);
        if (returnedCandidate) {
          setCandidate(returnedCandidate);
        }
      }
    };
    fetchCandidate();
  }, [candidateId]);

  const generateCandidateDescription = async () => {
    if (!candidate) return;
    const generatedDesc = await generateDescription(candidate.candidate_id);
    if (generatedDesc) {
      setCandidate((prevCandidate) => ({
        ...prevCandidate!,
        generated_desc: generatedDesc,
      }));
    }
  };

  const generateGitHubRating = async () => {
    if (!candidate) return;
    const generatedGithubRating = await generateGitHubDescription(
      candidate.candidate_id
    );
    if (generatedGithubRating) {
      setCandidate((prevCandidate) => ({
        ...prevCandidate!,
        github_rating: generatedGithubRating,
      }));
    }
  };

  const generatePortfolioRatingHandler = async () => {
    if (!candidate) return;
    await generatePortfolioRating(candidate.candidate_id);
    const { data } = await getCandidateEndpointCandidatesCandidateIdGet({
      path: { candidate_id: candidate.candidate_id },
    });
    if (data) {
      setCandidate(data);
    }
  };

  if (loadingStates.candidate || !candidate) {
    return <CandidatePageLoading />;
  }

  const breadcrumbItems = [
    { label: "Candidates", path: "/candidates" },
    {
      label: `${candidate.candidate_first_name} ${candidate.candidate_last_name}`,
      path: "",
    },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <BreadCrumbs items={breadcrumbItems} />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">
          {`${candidate.candidate_first_name} ${candidate.candidate_last_name}`}
        </h2>
        <Button variant="outline" onClick={() => navigate("/candidates")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Candidates
        </Button>
      </div>
      <PersonalInformationCard candidate={candidate} />
      <ProfessionalLinksCard candidate={candidate} />
      <GeneratedDescriptionCard
        description={candidate.generated_desc || ""}
        generateDescription={generateCandidateDescription}
        isLoading={loadingStates.description}
      />
      {candidate.github && (
        <GitHubRatingCard
          candidate={candidate}
          isGeneratingGitHubRating={loadingStates.gitHubRating}
          generateGitHubDescription={generateGitHubRating}
        />
      )}
      {candidate.portfolio && (
        <PortfolioRatingCard
          candidate={candidate}
          isGeneratingPortfolioRating={loadingStates.portfolioRating}
          generatePortfolioRating={generatePortfolioRatingHandler}
        />
      )}
    </div>
  );
};

export default CandidatePage;
