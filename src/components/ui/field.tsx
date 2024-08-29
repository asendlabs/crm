import * as React from "react";

import { cn } from "@/utils/tailwind";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Field = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Field.displayName = "Input";

export { Field };
