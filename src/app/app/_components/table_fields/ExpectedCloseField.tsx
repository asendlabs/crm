"use client";

import { ActivityWithContact } from "@/types/entities"; // Adjust according to your project structure
import { formatDate, formatDateAndTime } from "@/lib/utils"; // Assuming the necessary format functions are correctly imported
import React, { useEffect, useState } from "react";

interface ExpectedCloseFieldProps {
  getValue: () => any; // Function that returns an array of activities
}

export function ExpectedCloseField({ getValue }: ExpectedCloseFieldProps) {
  const initialValue: Date = getValue(); // Fetch initial activity data
  const [value, setValue] = useState<string | undefined>(); // State to hold the formatted expectedClose date

  useEffect(() => {
    if (initialValue) {
      // Format the expectedClose date
      setValue(formatDate(initialValue.toString())); // Set formatted expectedClose
    } else {
      setValue(undefined); // Clear value if no expectedClose
    }
  }, [initialValue]); // Effect depends on expectedClose changes

  return (
    <div className="min-w-full max-w-36 select-none border-l border-border px-2 py-1.5 font-medium text-muted-foreground">
      {value || "-"} {/* Display the expectedClose or a placeholder */}
    </div>
  );
}
