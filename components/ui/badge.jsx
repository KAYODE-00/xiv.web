"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const Badge = React.forwardRef(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-md bg-[#6c63ff] px-2 py-1 text-xs font-semibold text-white",
        className
      )}
      {...props}
    />
  )
);

Badge.displayName = "Badge";

export default Badge;
