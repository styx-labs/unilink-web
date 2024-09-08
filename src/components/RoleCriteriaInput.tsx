import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RoleCriteria } from "../lib/types";

export const RoleCriteriaInput = ({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: RoleCriteria[];
  onChange: (id: string, value: RoleCriteria[]) => void;
}) => {
  const handleItemChange = (index: number, newValue: string) => {
    const newArray = [...value];
    newArray[index] = { criteria_name: newValue };
    onChange(id, newArray);
  };

  const handleRemoveItem = (index: number) => {
    const newArray = [...value];
    newArray.splice(index, 1);
    onChange(id, newArray);
  };

  const handleAddItem = () => {
    const newArray = [...value, { criteria_name: "" }];
    onChange(id, newArray);
  };

  return (
    <div className="col-span-3">
      <Label htmlFor={id} className="mb-2 block">
        {label}
      </Label>
      {value.map((item, index) => (
        <div key={index} className="flex items-center mb-2">
          <Input
            type="text"
            value={item.criteria_name}
            onChange={(e) => handleItemChange(index, e.target.value)}
            className="flex-grow mr-2"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleRemoveItem(index)}
            className="ml-2"
          >
            Remove
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
        Add {label}
      </Button>
    </div>
  );
};
