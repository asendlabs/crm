import React from "react";
import { Circle } from "lucide-react";

interface StatusFieldProps {
  getValue: any;
}

export function StatusField({ getValue }: StatusFieldProps) {
  const value = getValue();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "text-purple-800";
      case "contacted":
        return "text-yellow-800";
      case "qualified":
        return "text-blue-800";
      case "unqualified":
        return "text-red-800";
      case "waste":
        return "text-gray-500";
      case "won":
        return "text-green-800";
      default:
        return "";
    }
  };

  return (
    <div className="select-none border-l border-border px-2 py-1">
      <div className="flex items-center gap-1 py-0.5">
        {value && (
          <>
            <Circle
              className={`mr-1 h-3 w-3 ${getStatusColor(value)}`}
              strokeWidth={4}
            />
            <span className={`font-medium capitalize ${getStatusColor(value)}`}>
              {value}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
