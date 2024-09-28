import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  CandidateRole,
  CandidateWithId,
  CandidateCreate,
  FindCandidatesBody,
  CandidateUpdate,
} from "../client/types.gen";
import {
  listCandidatesEndpointCompaniesCompanyIdRolesRoleIdCandidatesGet,
  deleteCandidateEndpointCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdDelete,
  createCandidateEndpointCompaniesCompanyIdRolesRoleIdCandidatesCreatePost,
  listCandidatesEndpointCandidatesGet,
  addCandidateEndpointCompaniesCompanyIdRolesRoleIdCandidatesPost,
  findCandidatesEndpointCompaniesCompanyIdRolesRoleIdCandidatesFindPost,
  getCandidateEndpointCandidatesCandidateIdGet,
  updateCandidateEndpointCandidatesCandidateIdPut,
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

  const findCandidates = async (findCandidatesBody: FindCandidatesBody) => {
    const { error } =
      await findCandidatesEndpointCompaniesCompanyIdRolesRoleIdCandidatesFindPost(
        {
          path: { company_id: companyId || "", role_id: roleId || "" },
          body: findCandidatesBody,
        }
      );

    if (error) {
      console.error("Error finding candidates:", error);
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

  const updateCandidate = async (
    updatedCandidate: Partial<CandidateWithId>
  ) => {
    const completeCandidate: CandidateUpdate = {
      candidate_first_name: updatedCandidate.candidate_first_name ?? "",
      candidate_last_name: updatedCandidate.candidate_last_name ?? "",
      linkedin: updatedCandidate.linkedin ?? "",
      email: updatedCandidate.email ?? "",
      phone_number: updatedCandidate.phone_number ?? "",
      github: updatedCandidate.github ?? "",
      portfolio: updatedCandidate.portfolio ?? "",
      candidate_desc: updatedCandidate.candidate_desc ?? "",
      resume: updatedCandidate.resume ?? "",
      grad_year: updatedCandidate.grad_year ?? "",
      grad_month: updatedCandidate.grad_month ?? "",
    };
    const { error } = await updateCandidateEndpointCandidatesCandidateIdPut({
      path: { candidate_id: updatedCandidate.candidate_id || "" },
      body: completeCandidate as CandidateUpdate,
    });
    if (error) {
      console.error("Error updating candidate:", error);
    } else {
      fetchCandidates();
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

  return {
    candidates,
    allCandidates,
    loading,
    hasMore,
    allCandidatesHasMore,
    deleteCandidate,
    addExistingCandidates,
    findCandidates,
    getCandidateDetails,
    addCandidate,
    updateCandidate,
    loadMore,
    loadMoreAllCandidates,
  };
};
