import * as React from "react";
import { cn } from "@/lib/utils";

export function FormError({ message, className }: { message?: string; className?: string }) {
  if (!message) return null;
  return <div className={cn("text-xs text-danger", className)}>{message}</div>;
}
