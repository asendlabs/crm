import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full min-w-full border px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default: "border-transparent text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground ",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {}

function StatusBadge({ className, variant, ...props }: StatusBadgeProps) {
  let colorClass: string = "";
  if (props.children === "Closed") {
    colorClass = "bg-[#e0f4e0]";
  } else if (props.children === "Lost") {
    colorClass = "bg-[#f4e0e0]";
  }
  return (
    <div
      className={cn(statusBadgeVariants({ variant }), className, colorClass)}
      {...props}
    >
      {props.children}
    </div>
  );
}

export { StatusBadge, statusBadgeVariants };
