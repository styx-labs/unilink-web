import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const InputField = ({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (id: string, value: string) => void;
}) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor={id} className="text-right">
      {label}
    </Label>
    <Input
      id={id}
      value={value}
      onChange={(e) => onChange(id, e.target.value)}
      className="col-span-3"
    />
  </div>
);

export const TextareaField = ({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (id: string, value: string) => void;
}) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor={id} className="text-right">
      {label}
    </Label>
    <Textarea
      id={id}
      value={value}
      onChange={(e) => onChange(id, e.target.value)}
      className="col-span-3"
      rows={4}
    />
  </div>
);

export const SelectField = ({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (id: string, value: string) => void;
  options: string[];
}) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor={id} className="text-right">
      {label}
    </Label>
    <Select value={value} onValueChange={(value) => onChange(id, value)}>
      <SelectTrigger className="col-span-3">
        <SelectValue placeholder="Select an option" />
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
);
