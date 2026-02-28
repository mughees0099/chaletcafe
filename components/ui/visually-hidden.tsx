"use client";

import * as React from "react";

type VisuallyHiddenProps = React.HTMLAttributes<HTMLSpanElement>;

export function VisuallyHidden({ children, className, ...props }: VisuallyHiddenProps) {
  return (
    <span className={["sr-only", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </span>
  );
}
