import React from "react";
import { Circle } from "lucide-react";

interface DealStageFieldProps {
  getValue: any;
}

export function DealStageField({ getValue }: DealStageFieldProps) {
  const value = getValue();

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "prospecting":
        return "text-blue-700";
      case "negotiation":
        return "text-yellow-700";
      case "closed won":
        return "text-green-700";
      case "closed lost":
        return "text-red-700";
      case "proposal":
        return "text-purple-700";
      case "qualification":
        return "text-teal-700";
      default:
        return "";
    }
  };

  return (
    <div className="select-none border-l border-border px-2 py-1">
      <div className="flex items-center gap-1 py-0.5">
        {value ? (
          <>
            <Circle
              className={`mr-1 h-3 w-3 ${getStageColor(value)}`}
              strokeWidth={4}
            />
            <span className={`font-medium capitalize ${getStageColor(value)}`}>
              {value}
            </span>
          </>
        ) : (
          <span className="py-0.5 text-muted-foreground">-</span>
        )}
      </div>
    </div>
  );
}
