import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import BreadCrumbs from "../../components/breadcrumbs";
import DataTable from "../../components/DataTable";
import { CandidateForm } from "../candidates/CandidateForm";
import { useParams } from "react-router-dom";
import { Markdown } from "../../components/Markdown";
import AddExistingCandidatesDialog from "./AddExistingCandidatesDialog";
import { FindCandidatesDialog } from "../candidates/FindCandidatesDialog";
import {
  CandidateRole,
  CandidateWithId,
  CandidateRoleNote,
  CandidateUpdate,
  CandidateCreate,
  FindCandidatesBody,
} from "../../client/types.gen";
import {
  listCandidatesEndpointCompaniesCompanyIdRolesRoleIdCandidatesGet,
  deleteCandidateEndpointCompaniesCompanyIdRolesRoleIdCandidatesCandidateIdDelete,
  createCandidateEndpointCompaniesCompanyIdRolesRoleIdCandidatesCreatePost,
  listCandidatesEndpointCandidatesGet,
  addCandidateEndpointCompaniesCompanyIdRolesRoleIdCandidatesPost,
  findCandidatesEndpointCompaniesCompanyIdRolesRoleIdCandidatesFindPost,
  getCandidateEndpointCandidatesCandidateIdGet,
  updateCandidateEndpointCandidatesCandidateIdPut,
} from "../../client/services.gen";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader } from "../../components/ui/loader";

function CandidateRoleList() {
  const [candidates, setCandidates] = useState<CandidateRole[]>([]);
  const [allCandidates, setAllCandidates] = useState<CandidateWithId[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isAddExistingDialogOpen, setIsAddExistingDialogOpen] =
    useState<boolean>(false);
  const [isFindCandidatesModalOpen, setIsFindCandidatesModalOpen] =
    useState<boolean>(false);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [candidateNotes, setCandidateNotes] = useState<CandidateRoleNote[]>([]);
  const [formData, setFormData] = useState<{
    candidate: Partial<CandidateWithId>;
    isOpen: boolean;
    isEditing: boolean;
  }>({
    candidate: {},
    isOpen: false,
    isEditing: false,
  });
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

  const addExistingCandidates = async () => {
    selectedCandidates.map(async (candidateId) => {
      const { error } =
        await addCandidateEndpointCompaniesCompanyIdRolesRoleIdCandidatesPost({
          path: { company_id: companyId || "", role_id: roleId || "" },
          body: {
            candidate_id: candidateId,
            candidate_role_notes: candidateNotes,
          },
        });
      if (error) {
        console.error("Error adding existing candidates:", error);
      } else {
        fetchCandidates();
        setIsAddExistingDialogOpen(false);
        setSelectedCandidates([]);
        setCandidateNotes([]);
      }
    });
  };

  const findCandidates = async (findCandidatesBody: FindCandidatesBody) => {
    const error =
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

  const openEditForm = async (candidateRole: CandidateRole) => {
    const { data, error } = await getCandidateEndpointCandidatesCandidateIdGet({
      path: {
        candidate_id: candidateRole.candidate_id || "",
      },
    });
    if (error) {
      console.error("Error fetching candidate:", error);
    } else {
      if (data) {
        const candidate = { ...data, candidate_id: candidateRole.candidate_id };
        console.log(candidate);
        setFormData({ candidate, isOpen: true, isEditing: true });
      }
    }
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

  const addCandidate = async (newCandidate: Partial<CandidateWithId>) => {
    const completeCandidate: CandidateCreate = {
      candidate_first_name: newCandidate.candidate_first_name ?? "",
      candidate_last_name: newCandidate.candidate_last_name ?? "",
      linkedin: newCandidate.linkedin ?? "",
      email: newCandidate.email ?? "",
      phone_number: newCandidate.phone_number ?? "",
      github: newCandidate.github ?? "",
      portfolio: newCandidate.portfolio ?? "",
      candidate_desc: newCandidate.candidate_desc ?? "",
      resume: newCandidate.resume ?? "",
      grad_year: newCandidate.grad_year ?? "",
      grad_month: newCandidate.grad_month ?? "",
    };
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

  const updateCandidate = async (newCandidate: Partial<CandidateWithId>) => {
    const completeCandidate: CandidateUpdate = {
      candidate_first_name: newCandidate.candidate_first_name ?? "",
      candidate_last_name: newCandidate.candidate_last_name ?? "",
      linkedin: newCandidate.linkedin ?? "",
      email: newCandidate.email ?? "",
      phone_number: newCandidate.phone_number ?? "",
      github: newCandidate.github ?? "",
      portfolio: newCandidate.portfolio ?? "",
      candidate_desc: newCandidate.candidate_desc ?? "",
      resume: newCandidate.resume ?? "",
      grad_year: newCandidate.grad_year ?? "",
      grad_month: newCandidate.grad_month ?? "",
    };
    const { error } = await updateCandidateEndpointCandidatesCandidateIdPut({
      path: { candidate_id: newCandidate.candidate_id || "" },
      body: completeCandidate as CandidateCreate,
    });
    if (error) {
      console.error("Error adding candidate:", error);
    } else {
      fetchCandidates();
    }
  };

  const toggleCandidateSelection = (candidateId: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId]
    );
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <BreadCrumbs
        items={[
          { label: "Companies", path: "/" },
          { label: "Roles", path: `/companies/${companyId}/roles` },
          {
            label: "Candidates",
            path: `/companies/${companyId}/roles/${roleId}/candidates`,
          },
        ]}
      />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Candidates
          </h2>
          <div className="flex space-x-2">
            <Button onClick={() => setIsFindCandidatesModalOpen(true)}>
              Find Candidates
            </Button>
            <Button onClick={() => setIsAddExistingDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Existing Candidate
            </Button>
            <Button
              onClick={() =>
                setFormData({ isOpen: true, isEditing: false, candidate: {} })
              }
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Candidate
            </Button>
          </div>
        </div>
        <div id="scrollableDiv" style={{ height: "80vh", overflow: "auto" }}>
          <InfiniteScroll
            dataLength={candidates.length}
            next={loadMore}
            hasMore={hasMore}
            loader={
              <div className="flex justify-center items-center p-4">
                <Loader />
              </div>
            }
            scrollableTarget="scrollableDiv"
          >
            <DataTable
              columns={[
                { key: "candidate_role_status", label: "Status" },
                { key: "candidate_first_name", label: "First Name" },
                { key: "candidate_last_name", label: "Last Name" },
                {
                  key: "candidate_role_generated_description",
                  label: "Generated Description",
                  render: (value: string | null) =>
                    value ? (
                      <Markdown content={value} />
                    ) : (
                      "No description generated"
                    ),
                },
              ]}
              data={candidates.map((candidate) => ({
                ...candidate,
                candidate_first_name: candidate.candidate?.candidate_first_name,
                candidate_last_name: candidate.candidate?.candidate_last_name,
              }))}
              onDelete={deleteCandidate}
              onEdit={(candidate) => openEditForm(candidate)}
              detailsPath={(candidate) =>
                `/companies/${companyId}/roles/${roleId}/candidates/${candidate.candidate_id}`
              }
              idField="candidate_id"
              isLoading={loading}
            />
          </InfiniteScroll>
        </div>
      </div>

      <AddExistingCandidatesDialog
        open={isAddExistingDialogOpen}
        onOpenChange={setIsAddExistingDialogOpen}
        allCandidates={allCandidates}
        selectedCandidates={selectedCandidates}
        toggleCandidateSelection={toggleCandidateSelection}
        addExistingCandidates={addExistingCandidates}
        loadMoreAllCandidates={loadMoreAllCandidates}
        allCandidatesHasMore={allCandidatesHasMore}
      />

      <FindCandidatesDialog
        open={isFindCandidatesModalOpen}
        onOpenChange={setIsFindCandidatesModalOpen}
        onSubmit={findCandidates}
      />

      <CandidateForm
        candidate={formData.candidate}
        onSubmit={handleSubmit}
        open={formData.isOpen}
        onOpenChange={closeForm}
        title={formData.isEditing ? "Edit Candidate" : "Add Candidate"}
        description={
          formData.isEditing
            ? "Make changes to the candidate here."
            : "Enter the details for the new candidate here."
        }
      />
    </div>
  );
}

export default CandidateRoleList;
