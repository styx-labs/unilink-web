import { useState, useEffect } from "react";
import { CandidateWithId } from "../../client/types.gen";
import DialogForm from "../../components/DialogForm";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { storage } from "../../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";


export function CandidateForm({
  candidate,
  onSubmit,
  open,
  onOpenChange,
  title,
  description,
}: {
  candidate: Partial<CandidateWithId>;
  onSubmit: (candidate: Partial<CandidateWithId>) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
}) {
  const [formData, setFormData] = useState<Partial<CandidateWithId>>(candidate);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    setFormData(candidate);
  }, [candidate]);

  const handleSubmit = async () => {
    let updatedFormData = { ...formData };
    if (resumeFile) {
      const storageRef = ref(storage, `resumes/${formData.candidate_first_name}_${formData.candidate_last_name}_${Date.now()}.pdf`);
      await uploadBytes(storageRef, resumeFile);
      const downloadURL = await getDownloadURL(storageRef);
      updatedFormData = { ...updatedFormData, resume: downloadURL };
    }
    onSubmit(updatedFormData);
  };

  return (
    <DialogForm
      title={title}
      description={description}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="candidate_first_name">First Name</Label>
          <Input
            id="candidate_first_name"
            value={formData.candidate_first_name || ""}
            onChange={(e) =>
              setFormData({ ...formData, candidate_first_name: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="candidate_last_name">Last Name</Label>
          <Input
            id="candidate_last_name"
            value={formData.candidate_last_name || ""}
            onChange={(e) =>
              setFormData({ ...formData, candidate_last_name: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="candidate_desc">Description</Label>
          <Textarea
            id="candidate_desc"
            value={formData.candidate_desc || ""}
            onChange={(e) =>
              setFormData({ ...formData, candidate_desc: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            type="url"
            value={formData.linkedin || ""}
            onChange={(e) =>
              setFormData({ ...formData, linkedin: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="github">GitHub</Label>
          <Input
            id="github"
            type="url"
            value={formData.github || ""}
            onChange={(e) =>
              setFormData({ ...formData, github: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="resume">Resume</Label>
          <Input
            id="resume"
            type="file"
            accept=".pdf"
            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
          />
          {formData.resume && (
            <a href={formData.resume} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500">
              View current resume
            </a>
          )}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ""}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="phone_number">Phone Number</Label>
          <PhoneInput
            id="candidate-phone"
            value={formData.phone_number}
            onChange={(value) =>
              setFormData({
                ...formData,
                phone_number: value || "",
              })
            }
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            defaultCountry="US"
          />
        </div>
        <div>
          <Label htmlFor="grad_year">Graduation Year</Label>
          <Input
            id="grad_year"
            type="number"
            value={formData.grad_year || ""}
            onChange={(e) => setFormData({ ...formData, grad_year: e.target.value })}
            placeholder="Enter graduation year"
          />
        </div>
        <div>
          <Label htmlFor="grad_month">Graduation Month</Label>
          <Select
            value={formData.grad_month || ""}
            onValueChange={(value) => setFormData({ ...formData, grad_month: value })}
          >
            <SelectTrigger id="grad_month">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </DialogForm>
  );
}
