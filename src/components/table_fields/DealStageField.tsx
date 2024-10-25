import React from "react";
import { Circle } from "lucide-react";

interface DealStageFieldProps {
  getValue: any;
}

export function DealStageField({ getValue }: DealStageFieldProps) {
  const value = getValue();

  return (
    <div className="select-none border-l border-border px-2 py-1">
      <div className="flex items-center gap-1 py-0.5">
        {value && (
          <div
            style={{
              color: `#${value.color}`,
              display: "flex",
              alignItems: "center",
              gap: "0.1rem",
            }}
          >
            <Circle className="mr-1 h-3 w-3" strokeWidth={4} />
            <span className="font-medium capitalize">{value.stage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
