import * as React from "react";
import { cn } from "@/lib/utils";

export function ErrorState({ title, description, className }: { title: string; description?: string; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-danger/30 bg-red-50 p-6 text-sm text-danger", className)}>
      <div className="font-semibold">{title}</div>
      {description && <div className="mt-2 text-xs">{description}</div>}
    </div>
  );
}
