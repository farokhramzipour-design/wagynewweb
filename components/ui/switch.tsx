import * as React from "react";
import { cn } from "@/lib/utils";

export function Switch({ className, checked, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn("relative inline-flex items-center", className)}>
      <input type="checkbox" className="peer sr-only" checked={checked} {...props} />
      <span className="h-6 w-10 rounded-full bg-border transition peer-checked:bg-brand-500" />
      <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-4" />
    </label>
  );
}
