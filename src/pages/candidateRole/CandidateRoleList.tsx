import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Plus, ClipboardCopy } from "lucide-react";
import BreadCrumbs from "../../components/breadcrumbs";
import DataTable from "../../components/DataTable";
import { CandidateForm } from "../candidates/CandidateForm";
import { useParams } from "react-router-dom";
import { Markdown } from "../../components/Markdown";
import AddExistingCandidatesDialog from "./AddExistingCandidatesDialog";
import { FindCandidatesDialog } from "../candidates/FindCandidatesDialog";
import { CandidateWithId } from "../../client/types.gen";
import { useCandidateRoles } from "../../hooks/useCandidateRoles";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader } from "../../components/ui/loader";
import { CandidateRole, RoleWithId } from "../../client/types.gen";
import { useCandidates } from "../../hooks/useCandidates";
import { useRoles } from "../../hooks/useRoles";

function RoleInfo({ role }: { role: RoleWithId }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {role.role_name}
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-2">{role.role_desc}</p>
      <p className="text-gray-600 dark:text-gray-300 mb-2">
        {role.role_requirements}
      </p>
      <p className="text-gray-600 dark:text-gray-300 mb-2">
        {role.candidates_interview_count}
      </p>
      <p className="text-gray-600 dark:text-gray-300 mb-2">
        {role.candidates_sent_count}
      </p>
    </div>
  );
}

function CandidateRoleList() {
  const {
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
    loadMore,
    loadMoreAllCandidates,
    updateCandidateInRole,
    findCandidates,
  } = useCandidateRoles();
  const { updateCandidate } = useCandidates();
  const { getRole } = useRoles();
  const [role, setRole] = useState<RoleWithId | null>(null);
  const [isAddExistingDialogOpen, setIsAddExistingDialogOpen] =
    useState<boolean>(false);
  const [isFindCandidatesModalOpen, setIsFindCandidatesModalOpen] =
    useState<boolean>(false);
  const [hasFetchedRecommendedCandidates, setHasFetchedRecommendedCandidates] = 
    useState<boolean>(false);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [formData, setFormData] = useState<{
    candidate: Partial<CandidateWithId>;
    isOpen: boolean;
    isEditing: boolean;
  }>({
    candidate: {},
    isOpen: false,
    isEditing: false,
  });

  const { companyId, roleId } = useParams();

  useEffect(() => {
    if (isFindCandidatesModalOpen && !hasFetchedRecommendedCandidates) {
      findCandidates();
      setHasFetchedRecommendedCandidates(true);
    }
  }, [isFindCandidatesModalOpen]);

  useEffect(() => {
    if (roleId) {
      getRole(roleId).then((fetchedRole) => {
        if (fetchedRole) {
          setRole(fetchedRole as RoleWithId);
        }
      });
    }
  }, [roleId]);
  const toggleCandidateSelection = (candidateId: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const copyExternalLink = () => {
    const externalUrl = `${window.location.origin}/companies/${companyId}/roles/${roleId}/external`;
    navigator.clipboard.writeText(externalUrl);
  };

  const openEditForm = async (candidateRole: CandidateRole) => {
    const candidateDetails = await getCandidateDetails(
      candidateRole.candidate_id
    );
    if (candidateDetails) {
      setFormData({
        candidate: {
          ...candidateDetails,
          candidate_id: candidateRole.candidate_id,
        },
        isOpen: true,
        isEditing: true,
      });
    }
  };

  const handleSubmit = async (submittedCandidate: Partial<CandidateWithId>) => {
    if (formData.isEditing) {
      await updateCandidate(submittedCandidate as CandidateWithId);
      await updateCandidateInRole(submittedCandidate as CandidateWithId);
    } else {
      await addCandidate(submittedCandidate);
    }
    closeForm();
  };

  const closeForm = () => {
    setFormData({ candidate: {}, isOpen: false, isEditing: false });
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
        {role && <RoleInfo role={role} />}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Candidates
          </h2>
          <div className="flex space-x-2">
            <Button onClick={() => copyExternalLink()}>
              <ClipboardCopy className="mr-2 h-4 w-4" /> Copy External Link
            </Button>
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
        addExistingCandidates={(existingCandidates: string[]) =>
          addExistingCandidates(existingCandidates)
        }
        loadMoreAllCandidates={loadMoreAllCandidates}
        allCandidatesHasMore={allCandidatesHasMore}
      />

      <FindCandidatesDialog
        open={isFindCandidatesModalOpen}
        onOpenChange={setIsFindCandidatesModalOpen}
        findCandidates={findCandidates}
        addExistingCandidates={addExistingCandidates}
        recommendedCandidates={recommendedCandidates}
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
