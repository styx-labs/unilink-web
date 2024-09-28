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
} from "../client/services.gen";
import {
  CandidateCreateSchema,
  CandidateUpdateSchema,
} from "../client/schemas.gen";

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<CandidateWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
    setLoading(true);
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
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const loadMore = () => {
    if (!loading && hasMore) {
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
        key !== "github_rating"
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
      fetchCandidates();
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

  return {
    candidates,
    loading,
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
  };
};
