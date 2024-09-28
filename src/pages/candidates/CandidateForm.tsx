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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export function CandidateForm({
  candidate,
  onSubmit,
  open,
  onOpenChange,
  title,
  description,
  internal=true,
}: {
  candidate: Partial<CandidateWithId>;
  onSubmit: (candidate: Partial<CandidateWithId>) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  internal?: boolean;
}) {
  const [formData, setFormData] = useState<Partial<CandidateWithId>>(candidate);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    setFormData(candidate);
  }, [candidate]);

  const handleSubmit = async () => {
    let updatedFormData = { ...formData };
    if (resumeFile) {
      const storageRef = ref(
        storage,
        `resumes/${formData.candidate_first_name}_${
          formData.candidate_last_name
        }_${Date.now()}.pdf`
      );
      await uploadBytes(storageRef, resumeFile);
      const downloadURL = await getDownloadURL(storageRef);
      updatedFormData = { ...updatedFormData, resume: downloadURL };
    }
    onSubmit(updatedFormData);
  };

  const formContent = (
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
      {internal && (
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
      )}
      <div className="space-y-2">
        <Label>Will you now or will you in the future require employment visa sponsorship?</Label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <Input
              type="radio"
              name="requires_sponsorship"
              value="true"
              checked={formData.requires_sponsorship === true}
              onChange={() => setFormData({ ...formData, requires_sponsorship: true })}
              className="mr-2"
            />
            Yes
          </label>
          <label className="flex items-center">
            <Input
              type="radio"
              name="requires_sponsorship"
              value="false"
              checked={formData.requires_sponsorship === false}
              onChange={() => setFormData({ ...formData, requires_sponsorship: false })}
              className="mr-2"
            />
            No
          </label>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Are you legally authorized to work in the United States for any employer?</Label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <Input
              type="radio"
              name="authorized_us"
              value="true"
              checked={formData.authorized_us === true}
              onChange={() => setFormData({ ...formData, authorized_us: true })}
              className="mr-2"
            />
            Yes
          </label>
          <label className="flex items-center">
            <Input
              type="radio"
              name="authorized_us"
              value="false"
              checked={formData.authorized_us === false}
              onChange={() => setFormData({ ...formData, authorized_us: false })}
              className="mr-2"
            />
            No
          </label>
        </div>
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
        <Label htmlFor="portfolio">Portfolio</Label>
        <Input
          id="portfolio"
          type="url"
          value={formData.portfolio || ""}
          onChange={(e) =>
            setFormData({ ...formData, portfolio: e.target.value })
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
          <a
            href={formData.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500"
          >
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
          onChange={(e) =>
            setFormData({ ...formData, grad_year: e.target.value })
          }
          placeholder="Enter graduation year"
        />
      </div>
      <div>
        <Label htmlFor="grad_month">Graduation Month</Label>
        <Select
          value={formData.grad_month || ""}
          onValueChange={(value) =>
            setFormData({ ...formData, grad_month: value })
          }
        >
          <SelectTrigger id="grad_month">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  if (!internal) {
    return (
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
        <p className="text-gray-600">{description}</p>
        {formContent}
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Submit
        </button>
      </form>
    );
  }

  return (
    <DialogForm
      title={title}
      description={description}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
    >
      {formContent}
    </DialogForm>
  );
}
