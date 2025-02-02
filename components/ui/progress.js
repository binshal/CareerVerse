"use client";

import React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-800 ${className}`}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={`h-full w-full flex-1 transition-all bg-green-500 duration-300 ease-in-out ${props.indicatorClass}`}
      style={{
        transform: `translateX(-${100 - (value || 0)}%)`
      }}
    />
  </ProgressPrimitive.Root>
));

Progress.displayName = "Progress";

export { Progress };