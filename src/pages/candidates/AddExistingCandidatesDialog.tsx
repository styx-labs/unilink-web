import React from "react";
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
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Candidate } from "./CandidateList";
import NotesInput from "../../components/NotesInput";
import { CandidateRoleNote, CandidateRoleNoteType } from "../../lib/types";

interface AddExistingCandidatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allCandidates: Candidate[];
  selectedCandidates: string[];
  toggleCandidateSelection: (candidateId: string) => void;
  candidateNotes: CandidateRoleNote[];
  setCandidateNotes: (notes: CandidateRoleNote[]) => void;
  addExistingCandidates: () => void;
}

function AddExistingCandidatesDialog({
  open,
  onOpenChange,
  allCandidates,
  selectedCandidates,
  toggleCandidateSelection,
  candidateNotes,
  setCandidateNotes,
  addExistingCandidates,
}: AddExistingCandidatesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add Existing Candidates</DialogTitle>
          <DialogDescription>
            Select candidates to add to this role.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="candidateNotes">Notes</Label>
            <NotesInput
              value={candidateNotes}
              onChange={setCandidateNotes}
              options={Object.values(CandidateRoleNoteType)}
              className="w-full"
            />
          </div>
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
