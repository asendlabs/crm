"use client";

import { Account } from "@database/types";
import { Row } from "@tanstack/react-table";
import { Sparkle } from "lucide-react";
import { useRouter } from "@/hooks/use-performance-router";
import React, { useEffect, useRef, useState } from "react";

interface AiScoreFieldProps {
  getValue: () => any;
  row: any;
}

export function AiScoreField({ getValue, row }: AiScoreFieldProps) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const router = useRouter();
  const id = row.original.id;
  const type = row.original.type;
  useEffect(() => {
    setValue(initialValue);
    router.prefetch(`/app/${type}s/${id.toLowerCase()}`);
  }, [initialValue, id, router, type]);

  return (
    <div
      className="select-none border-l border-border px-2 py-1"
      onClick={() => router.push(`/app/${type}s/${id.toLowerCase()}`)}
    >
      <div className="flex items-center gap-1 py-0.5">
        {value ? (
          <>
            <Sparkle className="mr-1 size-4" />
            <span className="underline decoration-muted-foreground decoration-2">
              {value}
            </span>
          </>
        ) : (
          <span className="text-muted-foreground">No AI Score</span>
        )}
      </div>
    </div>
  );
}
