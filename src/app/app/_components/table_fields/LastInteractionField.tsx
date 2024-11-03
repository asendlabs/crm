"use client";

import { ActivityWithContact } from "@/types/entities"; // Adjust according to your project structure
import { formatDate, formatDateAndTime } from "@/lib/utils";
import { Activity } from "@database/types"; // Adjust according to your project structure
import React, { useEffect, useState } from "react";

interface LastInteractionFieldProps {
  getValue: () => any; // Function that returns an array of activities
}

export function LastInteractionField({ getValue }: LastInteractionFieldProps) {
  const initialValue: ActivityWithContact[] = getValue(); // Fetch initial activity data
  const [value, setValue] = useState<string | undefined>(); // State to hold the time ago string

  useEffect(() => {
    if (initialValue && initialValue.length > 0) {
      // Sort and find the most recent activity
      const mostRecentActivity = initialValue.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];
      setValue(
        mostRecentActivity
          ? formatDate(mostRecentActivity.createdAt)
          : undefined,
      ); // Set formatted time ago
    } else {
      setValue(undefined); // Clear value if no activities
    }
  }, [initialValue]); // Effect depends on initialValue changes

  return (
    <div className="min-w-full max-w-36 select-none border-l border-border px-2 py-1.5 font-medium capitalize text-muted-foreground">
      {value || "-"} {/* Display the time ago or a placeholder */}
    </div>
  );
}
