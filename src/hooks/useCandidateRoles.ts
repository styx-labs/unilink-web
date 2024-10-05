import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  CandidateRole,
  CandidateWithId,
  CandidateCreate,
  CandidateRoleUpdate,
  CandidateWithHighlights,
} from "../client/types.gen";
import {
  listCandidatesEndpointCompaniesCompanyIdRolesRoleIdCandidatesGet,
  deleteCandidateEndpointCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdDelete,
  createCandidateEndpointCompaniesCompanyIdRolesRoleIdCandidatesCreatePost,
  listCandidatesEndpointCandidatesGet,
  addCandidateEndpointCompaniesCompanyIdRolesRoleIdCandidatesPost,
  findCandidatesEndpointCompaniesCompanyIdRolesRoleIdCandidatesFindPost,
  getCandidateEndpointCandidatesCandidateIdGet,
  updateCandidateEndpointCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdPut,
  getCandidateEndpointCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdGet,
  generateCandidateRoleDescriptionEndpointCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdGenerateDescriptionPost,
} from "../client/services.gen";
import { CandidateCreateSchema } from "../client/schemas.gen";

export const useCandidateRoles = () => {
  const [candidates, setCandidates] = useState<CandidateRole[]>([]);
  const [allCandidates, setAllCandidates] = useState<CandidateWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [allCandidatesNextCursor, setAllCandidatesNextCursor] = useState<
    string | null
  >(null);
  const [allCandidatesHasMore, setAllCandidatesHasMore] =
    useState<boolean>(true);
  const { companyId, roleId } = useParams();
  const [recommendedCandidates, setRecommendedCandidates] = useState<CandidateWithHighlights[]>([]);

  useEffect(() => {
    fetchCandidates();
  }, [companyId, roleId]);

  useEffect(() => {
    fetchAllCandidates();
  }, [candidates]);

  const fetchCandidates = async (cursorParam?: string | null) => {
    setLoading(true);
    const { data, error } =
      await listCandidatesEndpointCompaniesCompanyIdRolesRoleIdCandidatesGet({
        path: { company_id: companyId || "", role_id: roleId || "" },
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
  };

  const fetchAllCandidates = async (cursorParam?: string | null) => {
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
      const existingCandidateIds = candidates.map(
        (candidate) => candidate.candidate_id
      );
      const filteredNewCandidates = newCandidates.filter(
        (candidate) => !existingCandidateIds.includes(candidate.candidate_id)
      );
      setAllCandidates((prev) =>
        cursorParam
          ? [...prev, ...filteredNewCandidates]
          : filteredNewCandidates
      );
      setAllCandidatesNextCursor(newNextCursor);
      setAllCandidatesHasMore(!!newNextCursor);
    }
  };

  const deleteCandidate = async (id: string) => {
    const { error } =
      await deleteCandidateEndpointCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdDelete(
        {
          path: {
            company_id: companyId || "",
            role_id: roleId || "",
            candidate_id: id,
          },
        }
      );
    if (error) {
      console.error("Error deleting candidate:", error);
    } else {
      fetchCandidates();
    }
  };

  const addExistingCandidates = async (selectedCandidates: string[]) => {
    const promises = selectedCandidates.map((candidateId) =>
      addCandidateEndpointCompaniesCompanyIdRolesRoleIdCandidatesPost({
        path: { company_id: companyId || "", role_id: roleId || "" },
        body: {
          candidate_id: candidateId,
          candidate_role_notes: [],
        },
      })
    );

    const results = await Promise.all(promises);
    const errors = results.filter((result) => result.error);

    if (errors.length > 0) {
      console.error("Error adding existing candidates:", errors);
    } else {
      fetchCandidates();
    }
  };

  const getCandidateDetails = async (candidateId: string) => {
    const { data, error } = await getCandidateEndpointCandidatesCandidateIdGet({
      path: { candidate_id: candidateId },
    });
    if (error) {
      console.error("Error fetching candidate:", error);
      return null;
    }
    return data;
  };

  const addCandidate = async (newCandidate: Partial<CandidateWithId>) => {
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
          (newCandidate[key as keyof CandidateCreate] as any) ?? "";
      }
      return acc;
    }, {} as Partial<CandidateCreate>);

    const { error } =
      await createCandidateEndpointCompaniesCompanyIdRolesRoleIdCandidatesCreatePost(
        {
          path: { company_id: companyId || "", role_id: roleId || "" },
          body: completeCandidate as CandidateCreate,
        }
      );
    if (error) {
      console.error("Error adding candidate:", error);
    } else {
      fetchCandidates();
    }
  };

  const updateCandidateRole = async (
    updatedCandidateRole: Partial<CandidateRole>
  ) => {
    const { data, error } =
      await updateCandidateEndpointCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdPut(
        {
          path: {
            company_id: companyId || "",
            role_id: roleId || "",
            candidate_id: updatedCandidateRole.candidate_id || "",
          },
          body: updatedCandidateRole as CandidateRoleUpdate,
        }
      );
    if (error) {
      console.error("Error updating candidate role:", error);
    } else {
      return data;
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchCandidates(nextCursor);
    }
  };

  const loadMoreAllCandidates = () => {
    if (!loading && allCandidatesHasMore) {
      fetchAllCandidates(allCandidatesNextCursor);
    }
  };

  const getCandidateRole = async (candidateId: string) => {
    const { data, error } =
      await getCandidateEndpointCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdGet(
        {
          path: {
            company_id: companyId || "",
            role_id: roleId || "",
            candidate_id: candidateId,
          },
        }
      );
    if (error) {
      console.error("Error fetching candidate role:", error);
      return null;
    }
    return data;
  };

  const generateCandidateRoleDescription = async (candidateId: string) => {
    const { data, error } =
      await generateCandidateRoleDescriptionEndpointCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdGenerateDescriptionPost(
        {
          path: {
            company_id: companyId || "",
            role_id: roleId || "",
            candidate_id: candidateId,
          },
        }
      );
    if (error) {
      console.error("Error generating candidate role description:", error);
      return null;
    }
    return data;
  };

  const updateCandidateInRole = async (updatedCandidate: CandidateWithId) => {
    const updatedCandidates = candidates.map((candidateRole) => {
      if (candidateRole.candidate_id === updatedCandidate.candidate_id) {
        return {
          ...candidateRole,
          candidate: updatedCandidate,
        };
      }
      return candidateRole;
    });
    setCandidates(updatedCandidates);
  };

  const findCandidates = async () => {
    setRecommendedCandidates([]);
    const { data, error } =
      await findCandidatesEndpointCompaniesCompanyIdRolesRoleIdCandidatesFindPost(
        {
          path: { company_id: companyId || "", role_id: roleId || "" }
        }
      );

    if (error) {
      console.error("Error finding candidates:", error);
      return null;
    } else {
      setRecommendedCandidates(data!);
    }
  };

  return {
    candidates,
    allCandidates,
    loading,
    hasMore,
    allCandidatesHasMore,
    recommendedCandidates,
    deleteCandidate,
    addExistingCandidates,
    getCandidateDetails,
    addCandidate,
    updateCandidateRole,
    loadMore,
    loadMoreAllCandidates,
    getCandidateRole,
    generateCandidateRoleDescription,
    updateCandidateInRole,
    findCandidates,
  };
};
