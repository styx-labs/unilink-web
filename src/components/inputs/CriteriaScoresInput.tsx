'use client'

import React from "react";
import { CriteriaScoringItem } from "../../lib/types";
import { Label } from "../ui/label";
import { Star } from "lucide-react";
import { cn } from "../../lib/utils";

interface CriteriaScoresInputProps {
  values: CriteriaScoringItem[];
  onChange: (newValues: CriteriaScoringItem[]) => void;
}

export function CriteriaScoresInput({
  values,
  onChange,
}: CriteriaScoresInputProps) {
  const handleItemChange = (index: number, score: number) => {
    const newArray = [...values];
    newArray[index] = { ...newArray[index], score };
    onChange(newArray);
  };

  return (
    <div className="space-y-6">
      {values.map((item, index) => (
        <div key={index} className="flex flex-col space-y-2">
          <Label className="text-sm font-medium">{item.criteria_name}</Label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={cn(
                  "p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-full",
                  star <= item.score ? "text-yellow-400" : "text-gray-300"
                )}
                onClick={() => handleItemChange(index, star)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleItemChange(index, star);
                  }
                }}
              >
                <Star
                  className={cn(
                    "w-8 h-8 transition-all",
                    star <= (item.score || 0) ? "fill-current" : "fill-none"
                  )}
                />
                <span className="sr-only">
                  {star} {star === 1 ? 'star' : 'stars'}
                </span>
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-500">
              {item.score} out of 5
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
