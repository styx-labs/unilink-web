import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CriteriaScoringItem } from "../../lib/types";

interface CriteriaScoresInputProps {
  values: CriteriaScoringItem[];
  onChange: (newValues: CriteriaScoringItem[]) => void;
}

export function CriteriaScoresInput({
  values,
  onChange,
}: CriteriaScoresInputProps) {
  const handleItemChange = (
    index: number,
    field: keyof CriteriaScoringItem,
    value: string | number
  ) => {
    const newArray = [...values];
    newArray[index] = { ...newArray[index], [field]: value };
    onChange(newArray);
  };

  const handleRemoveItem = (index: number) => {
    const newArray = [...values];
    newArray.splice(index, 1);
    onChange(newArray);
  };

  const handleAddItem = () => {
    const newArray = [...values, { criteria_name: "", score: 0 }];
    onChange(newArray);
  };

  return (
    <div className="col-span-3">
      {values.map((item, index) => (
        <div key={index} className="flex items-center mb-2">
          <Input
            type="text"
            value={item.criteria_name}
            onChange={(e) =>
              handleItemChange(index, "criteria_name", e.target.value)
            }
            className="flex-grow mr-2"
          />
          <Input
            type="number"
            value={item.score}
            onChange={(e) =>
              handleItemChange(index, "score", parseFloat(e.target.value))
            }
            className="w-24"
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
        Add Criteria Score
      </Button>
    </div>
  );
}
