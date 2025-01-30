"use client";

import React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={`h-2 w-full overflow-hidden rounded-full bg-gray-800 ${className}`}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={`h-full w-full transition-all duration-300 ${props.indicatorClass}`}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));

Progress.displayName = "Progress";

export { Progress };