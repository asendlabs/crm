import { formatDate } from "@/lib/utils";
import React from "react";

function ActivityTimestamp({ timestamp }: { timestamp: any }) {
  return (
    <span className="flex gap-1 px-3 py-1 text-gray-500">
      {formatDate(timestamp)}
    </span>
  );
}

export default ActivityTimestamp;
