"use client";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export type StepField = {
  name: string;
  label: string;
  type: "string" | "number" | "boolean" | "text";
  required?: boolean;
  placeholder?: string;
};

export type StepSchema = {
  title?: string;
  description?: string;
  fields?: StepField[];
};

export function StepFormRenderer({
  schema,
  values,
  onChange
}: {
  schema: StepSchema;
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
}) {
  if (!schema?.fields?.length) {
    return <div className="text-sm text-subtle">این مرحله فرم مشخصی ندارد.</div>;
  }

  return (
    <div className="space-y-4">
      {schema.fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <label className="text-sm font-medium">{field.label}</label>
          {field.type === "boolean" ? (
            <Switch
              checked={Boolean(values[field.name])}
              onChange={(event) => onChange(field.name, event.target.checked)}
            />
          ) : field.type === "text" ? (
            <Textarea
              value={values[field.name] ?? ""}
              placeholder={field.placeholder}
              onChange={(event) => onChange(field.name, event.target.value)}
            />
          ) : (
            <Input
              type={field.type === "number" ? "number" : "text"}
              value={values[field.name] ?? ""}
              placeholder={field.placeholder}
              onChange={(event) => onChange(field.name, event.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
