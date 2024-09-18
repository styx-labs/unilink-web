import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { FindCandidatesBody } from "../../client/types.gen";

interface FindCandidatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (findCandidatesBody: FindCandidatesBody) => void;
}

export function FindCandidatesDialog({ open, onOpenChange, onSubmit }: FindCandidatesDialogProps) {
  const [numCandidates, setNumCandidates] = useState<number>(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ n: numCandidates });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Find Candidates</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="numCandidates" className="block text-sm font-medium text-gray-700">
              Number of Candidates
            </label>
            <Input
              type="number"
              id="numCandidates"
              value={numCandidates}
              onChange={(e) => setNumCandidates(parseInt(e.target.value))}
              min={1}
              required
            />
          </div>
          <Button type="submit">Find Candidates</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}