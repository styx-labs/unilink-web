import { useEffect, useState, useCallback } from "react";
import {
  CandidateWithId,
  CandidateCreate,
  CandidateUpdate,
} from "../client/types.gen";
import {
  listCandidatesEndpointCandidatesGet,
  createCandidateEndpointCandidatesPost,
  updateCandidateEndpointCandidatesCandidateIdPut,
  deleteCandidateEndpointCandidatesCandidateIdDelete,
  getCandidateEndpointCandidatesCandidateIdGet,
  rateCandidateGithubEndpointCandidatesCandidateIdGithubGet,
  rateCandidatePortfolioEndpointCandidatesCandidateIdPortfolioGet,
  generateCandidateDescriptionEndpointCandidatesCandidateIdGenerateDescriptionGet,
} from "../client/services.gen";
import {
  CandidateCreateSchema,
  CandidateUpdateSchema,
} from "../client/schemas.gen";

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<CandidateWithId[]>([]);
  const [loadingStates, setLoadingStates] = useState({
    candidate: false,
    description: false,
    gitHubRating: false,
    portfolioRating: false,
  });
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [formData, setFormData] = useState<{
    candidate: Partial<CandidateWithId>;
    isOpen: boolean;
    isEditing: boolean;
  }>({
    candidate: {},
    isOpen: false,
    isEditing: false,
  });

  const fetchCandidates = useCallback(async (cursorParam?: string | null) => {
    setLoadingStates((prev) => ({ ...prev, candidate: true }));
    const { data, error } = await listCandidatesEndpointCandidatesGet({
      query: {
        cursor: cursorParam || undefined,
        limit: 20,
      },
    });
    if (error) {
      console.error("Error fetching candidates:", error);
    } else {
      const [newCandidates, newNextCursor] = data!;

      setCandidates((prev) =>
        cursorParam ? [...prev, ...newCandidates] : newCandidates
      );
      setNextCursor(newNextCursor);
      setHasMore(!!newNextCursor);
    }
    setLoadingStates((prev) => ({ ...prev, candidate: false }));
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const loadMore = () => {
    if (!loadingStates.candidate && hasMore) {
      fetchCandidates(nextCursor);
    }
  };

  const addCandidate = async (candidate: Partial<CandidateWithId>) => {
    const completeCandidate = Object.keys(
      CandidateCreateSchema.properties
    ).reduce((acc, key) => {
      if (
        key !== "created_at" &&
        key !== "updated_at" &&
        key !== "github_rating" &&
        key !== "portfolio_rating" &&
        key !== "requires_sponsorship" &&
        key !== "authorized_us"
      ) {
        acc[key as keyof CandidateCreate] =
          (candidate[key as keyof CandidateCreate] as any) ?? "";
      }
      return acc;
    }, {} as Partial<CandidateCreate>);

    const { error } = await createCandidateEndpointCandidatesPost({
      body: completeCandidate as CandidateCreate,
    });
    if (error) {
      console.error("Error adding candidate:", error);
    } else {
      fetchCandidates();
    }
  };

  const updateCandidate = async (candidate: CandidateWithId) => {
    const completeCandidate = Object.keys(
      CandidateUpdateSchema.properties
    ).reduce((acc, key) => {
      if (
        key !== "created_at" &&
        key !== "updated_at" &&
        key !== "github_rating" &&
        key !== "portfolio_rating" &&
        key !== "requires_sponsorship" &&
        key !== "authorized_us"
      ) {
        acc[key as keyof CandidateUpdate] =
          (candidate[key as keyof CandidateUpdate] as any) ?? "";
      }
      return acc;
    }, {} as Partial<CandidateUpdate>);
    const { error } = await updateCandidateEndpointCandidatesCandidateIdPut({
      body: completeCandidate as CandidateUpdate,
      path: { candidate_id: candidate.candidate_id },
    });
    if (error) {
      console.error("Error updating candidate:", error);
    } else {
      fetchCandidates();
    }
  };

  const deleteCandidate = async (id: string) => {
    const { error } = await deleteCandidateEndpointCandidatesCandidateIdDelete({
      path: { candidate_id: id },
    });
    if (error) {
      console.error("Error deleting candidate:", error);
    } else {
      setCandidates((prev) =>
        prev.filter((candidate) => candidate.candidate_id !== id)
      );
    }
  };

  const openAddForm = () => {
    setFormData({ candidate: {}, isOpen: true, isEditing: false });
  };

  const openEditForm = (candidate: CandidateWithId) => {
    setFormData({ candidate, isOpen: true, isEditing: true });
  };

  const closeForm = () => {
    setFormData({ candidate: {}, isOpen: false, isEditing: false });
  };

  const handleSubmit = async (submittedCandidate: Partial<CandidateWithId>) => {
    if (formData.isEditing) {
      await updateCandidate(submittedCandidate as CandidateWithId);
    } else {
      await addCandidate(submittedCandidate);
    }
    closeForm();
  };

  const getCandidate = async (candidateId: string) => {
    setLoadingStates((prev) => ({ ...prev, candidate: true }));
    const { data, error } = await getCandidateEndpointCandidatesCandidateIdGet({
      path: {
        candidate_id: candidateId,
      },
    });
    if (error) {
      console.error("Error fetching candidate:", error);
    } else {
      return data;
    }
    setLoadingStates((prev) => ({ ...prev, candidate: false }));
  };

  const generateGitHubDescription = async (candidateId: string) => {
    try {
      setLoadingStates((prev) => ({ ...prev, gitHubRating: true }));
      const { data, error } =
        await rateCandidateGithubEndpointCandidatesCandidateIdGithubGet({
          path: { candidate_id: candidateId },
        });
      if (error) {
        console.error("Error generating GitHub description:", error);
      } else {
        return data || "";
      }
    } catch (error) {
      console.error("Unexpected error generating GitHub rating:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, gitHubRating: false }));
    }
  };

  const generatePortfolioRating = async (candidateId: string) => {
    setLoadingStates((prev) => ({ ...prev, portfolioRating: true }));
    try {
      const { data, error } =
        await rateCandidatePortfolioEndpointCandidatesCandidateIdPortfolioGet({
          path: { candidate_id: candidateId },
        });
      if (error) {
        console.error("Error generating portfolio rating:", error);
      } else {
        setCandidates((prevCandidates) =>
          prevCandidates.map((candidate) =>
            candidate.candidate_id === candidateId
              ? { ...candidate, portfolio_rating: data?.portfolio_rating || {} }
              : candidate
          )
        );
      }
    } catch (error) {
      console.error("Unexpected error generating portfolio rating:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, portfolioRating: false }));
    }
  };

  const generateDescription = async (candidateId: string) => {
    setLoadingStates((prev) => ({ ...prev, description: true }));
    try {
      const { data, error } =
        await generateCandidateDescriptionEndpointCandidatesCandidateIdGenerateDescriptionGet(
          {
            path: { candidate_id: candidateId },
          }
        );
      if (error) {
        console.error("Error generating description:", error);
        return null;
      } else {
        return data || "";
      }
    } catch (error) {
      console.error("Unexpected error generating description:", error);
      return null;
    } finally {
      setLoadingStates((prev) => ({ ...prev, description: false }));
    }
  };

  return {
    candidates,
    loadingStates,
    hasMore,
    formData,
    fetchCandidates,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    openAddForm,
    openEditForm,
    closeForm,
    handleSubmit,
    loadMore,
    getCandidate,
    generateGitHubDescription,
    generatePortfolioRating,
    generateDescription,
  };
};
