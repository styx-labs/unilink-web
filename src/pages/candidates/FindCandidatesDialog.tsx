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
  const [graduationYears, setGraduationYears] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ n: numCandidates, grad_years: graduationYears });
    onOpenChange(false);
  };

  const addGraduationYear = () => {
    setGraduationYears([...graduationYears, ""]);
  };

  const updateGraduationYear = (index: number, value: string) => {
    const updatedYears = [...graduationYears];
    updatedYears[index] = value;
    setGraduationYears(updatedYears);
  };

  const removeGraduationYear = (index: number) => {
    setGraduationYears(graduationYears.filter((_, i) => i !== index));
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Graduation Years</label>
            {graduationYears.map((year, index) => (
              <div key={index} className="flex items-center mt-2">
                <Input
                  type="text"
                  value={year}
                  onChange={(e) => updateGraduationYear(index, e.target.value)}
                  placeholder="e.g., 2023"
                  className="mr-2"
                />
                <Button type="button" onClick={() => removeGraduationYear(index)} variant="destructive">
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" onClick={addGraduationYear} className="mt-2">
              Add Graduation Year
            </Button>
          </div>
          <Button type="submit">Find Candidates</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}