import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "../../components/DataTable";
import { CandidateForm } from "./CandidateForm";
import InfiniteScroll from "react-infinite-scroll-component";
import { useCandidates } from "../../hooks/useCandidates";
import { Loader } from "../../components/ui/loader";
import { checkURL } from "../../lib/utils";
function CandidateList() {
  const {
    candidates,
    loadingStates,
    hasMore,
    formData,
    deleteCandidate,
    openAddForm,
    openEditForm,
    closeForm,
    handleSubmit,
    loadMore,
  } = useCandidates();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Candidates
          </h2>
          <div className="flex space-x-2">
            <Button onClick={openAddForm}>
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
                { key: "candidate_first_name", label: "First Name" },
                { key: "candidate_last_name", label: "Last Name" },
                {
                  key: "linkedin",
                  label: "LinkedIn",
                  render: (value) =>
                    value ? (
                      <a
                        href={checkURL(value)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {value}
                      </a>
                    ) : (
                      ""
                    ),
                },
                {
                  key: "github",
                  label: "Github",
                  render: (value) =>
                    value ? (
                      <a
                        href={checkURL(value)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {value}
                      </a>
                    ) : (
                      ""
                    ),
                },
                {
                  key: "portfolio",
                  label: "Portfolio",
                  render: (value) =>
                    value ? (
                      <a
                        href={checkURL(value)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {value}
                      </a>
                    ) : (
                      ""
                    ),
                },
                {
                  key: "resume",
                  label: "Resume",
                  render: (value) =>
                    value ? (
                      <a
                        href={checkURL(value)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Resume
                      </a>
                    ) : (
                      ""
                    ),
                },
                {
                  key: "email",
                  label: "Email",
                  render: (value) =>
                    value ? (
                      <a
                        href={`mailto:${value}`}
                        className="text-blue-600 hover:underline"
                      >
                        {value}
                      </a>
                    ) : (
                      ""
                    ),
                },
                {
                  key: "phone_number",
                  label: "Phone Number",
                  render: (value) =>
                    value ? (
                      <a
                        href={`tel:${value}`}
                        className="text-blue-600 hover:underline"
                      >
                        {value}
                      </a>
                    ) : (
                      ""
                    ),
                },
              ]}
              data={candidates}
              onEdit={openEditForm}
              onDelete={deleteCandidate}
              detailsPath={(candidate) =>
                `/candidates/${candidate.candidate_id}`
              }
              idField="candidate_id"
              isLoading={loadingStates.candidate}
            />
          </InfiniteScroll>
        </div>
      </div>
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

export default CandidateList;
