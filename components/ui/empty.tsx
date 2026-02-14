import * as React from "react";
import { cn } from "@/lib/utils";

export function EmptyState({ title, description, className }: { title: string; description?: string; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-white p-6 text-sm", className)}>
      <div className="font-semibold">{title}</div>
      {description && <div className="mt-2 text-subtle">{description}</div>}
    </div>
  );
}
