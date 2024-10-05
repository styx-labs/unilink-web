import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import {
  CandidateWithHighlights,
} from "../../client/types.gen";
import DataTable from "../../components/DataTable";
import { Button } from "../../components/ui/button";
import { Loader } from "../../components/ui/loader";
import { Markdown } from "../../components/Markdown";


interface FindCandidatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  findCandidates: () => void;
  addExistingCandidates: (existingCandidates: string[]) => void;
  recommendedCandidates: CandidateWithHighlights[];
}

export function FindCandidatesDialog({
  open,
  onOpenChange,
  findCandidates,
  addExistingCandidates,
  recommendedCandidates
}: FindCandidatesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[80vw] max-w-[1000px]">
        <DialogTitle>Recommended Candidates</DialogTitle>
        <div className="flex justify-end mb-4">
          <Button onClick={findCandidates}>Refresh</Button>
        </div>
        <div
          className="flex-grow overflow-auto"
          style={{ height: "calc(80vh - 40px)" }}
          id="scrollableDivModal"
        >
          {recommendedCandidates.length > 0 ? (
            <DataTable
              columns={[
                { key: "candidate_first_name", label: "First Name" },
                { key: "candidate_last_name", label: "Last Name" },
                { key: "highlights", label: "Highlights", render: (value) => <div className="markdown-content"><Markdown content={value} /></div> },
                { key: "grad_year", label: "Graduation Year", render: (value) => value || "" },
                { key: "linkedin", label: "LinkedIn", render: (value) => value ? <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">LinkedIn</a> : "" },
              ]}
              data={recommendedCandidates}
              idField="candidate_id"
              onAdd={(candidateId) => {
                addExistingCandidates([candidateId]);
                recommendedCandidates.splice(recommendedCandidates.findIndex(c => c.candidate_id === candidateId), 1);
              }}
            />
          ) : (
            <div className="flex justify-center items-center h-full">
              <Loader size={48} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}