import React, { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { cn } from "../../lib/utils";
import {
  CandidateRoleNote,
  CandidateRoleNoteType,
} from "../../client/types.gen";
import { Edit, Plus, Trash2 } from "lucide-react";

interface NotesInputProps {
  value: CandidateRoleNote[];
  onChange: (notes: CandidateRoleNote[]) => void;
  options: string[];
  className?: string;
}

const NotesInput: React.FC<NotesInputProps> = ({
  value,
  onChange,
  options,
  className,
}) => {
  const [currentNote, setCurrentNote] = useState<CandidateRoleNote>({
    type: CandidateRoleNoteType.PHONE_SCREEN,
    notes: "",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addOrUpdateNote = () => {
    if (currentNote.type && currentNote.notes) {
      if (editingIndex !== null) {
        const updatedNotes = [...value];
        updatedNotes[editingIndex] = currentNote;
        onChange(updatedNotes);
        setEditingIndex(null);
      } else {
        onChange([...value, currentNote]);
      }
      setCurrentNote({ type: CandidateRoleNoteType.PHONE_SCREEN, notes: "" });
      setIsDialogOpen(false);
    }
  };

  const editNote = (index: number) => {
    setCurrentNote(value[index]);
    setEditingIndex(index);
    setIsDialogOpen(true);
  };

  const deleteNote = (index: number) => {
    const updatedNotes = value.filter((_, i) => i !== index);
    onChange(updatedNotes);
  };

  const openNewNoteDialog = () => {
    setCurrentNote({ type: CandidateRoleNoteType.PHONE_SCREEN, notes: "" });
    setEditingIndex(null);
    setIsDialogOpen(true);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {value.map((note, index) => (
          <Card key={index} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {note.type} -{" "}
                {new Date(note.created_at || "").toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400 overflow-hidden">
                {note.notes}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => editNote(index)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteNote(index)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Button onClick={openNewNoteDialog}>
        <Plus className="h-4 w-4 mr-2" />
        Add New Note
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? "Edit Note" : "Add New Note"}
            </DialogTitle>
            <DialogDescription>
              {editingIndex !== null
                ? "Make changes to the existing note."
                : "Enter details for the new note."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="note-type" className="text-right">
                Type
              </Label>
              <Select
                value={currentNote.type}
                onValueChange={(type) =>
                  setCurrentNote({
                    ...currentNote,
                    type: type as CandidateRoleNoteType,
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select note type" />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="note-content" className="text-right pt-2">
                Note
              </Label>
              <Textarea
                id="note-content"
                value={currentNote.notes}
                onChange={(e) =>
                  setCurrentNote({ ...currentNote, notes: e.target.value })
                }
                placeholder="Enter note content"
                className="col-span-3 h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addOrUpdateNote}>
              {editingIndex !== null ? "Update Note" : "Add Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotesInput;
