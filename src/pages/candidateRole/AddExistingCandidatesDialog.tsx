import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { CandidateWithId } from "../../client/types.gen";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader } from "../../components/ui/loader";

interface AddExistingCandidatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allCandidates: CandidateWithId[];
  selectedCandidates: string[];
  toggleCandidateSelection: (candidateId: string) => void;
  addExistingCandidates: () => void;
  loadMoreAllCandidates: () => void;
  allCandidatesHasMore: boolean;
}

function AddExistingCandidatesDialog({
  open,
  onOpenChange,
  allCandidates,
  selectedCandidates,
  toggleCandidateSelection,
  addExistingCandidates,
  loadMoreAllCandidates,
  allCandidatesHasMore,
}: AddExistingCandidatesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Existing Candidates</DialogTitle>
          <DialogDescription>
            Select candidates to add to this role.
          </DialogDescription>
        </DialogHeader>
        <div
          className="flex-grow overflow-auto"
          style={{ height: "80vh" }}
          id="scrollableDivModal"
        >
          <InfiniteScroll
            dataLength={allCandidates.length}
            next={loadMoreAllCandidates}
            hasMore={allCandidatesHasMore}
            loader={
              <div className="flex justify-center items-center p-4">
                <Loader />
              </div>
            }
            scrollableTarget="scrollableDivModal"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Select</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>LinkedIn</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allCandidates.map((candidate) => (
                  <TableRow key={candidate.candidate_id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCandidates.includes(
                          candidate.candidate_id
                        )}
                        onCheckedChange={() =>
                          toggleCandidateSelection(candidate.candidate_id)
                        }
                      />
                    </TableCell>
                    <TableCell>{candidate.candidate_first_name}</TableCell>
                    <TableCell>{candidate.candidate_last_name}</TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell>{candidate.linkedin}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </InfiniteScroll>
        </div>
        <DialogFooter>
          <Button
            onClick={addExistingCandidates}
            disabled={selectedCandidates.length === 0}
          >
            Add Selected Candidates
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddExistingCandidatesDialog;
