"use client";

import { forwardRef, useMemo } from "react";
import { Input } from "@/components/ui/input";

export type JalaliDateInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  locale?: "fa" | "en";
  label?: string;
  helperText?: string;
};

export const JalaliDateInput = forwardRef<HTMLInputElement, JalaliDateInputProps>(
  ({ locale = "fa", label, helperText, className, ...props }, ref) => {
    const placeholder = useMemo(() => {
      if (props.placeholder) return props.placeholder;
      return locale === "fa" ? "۱۳۸۴/۰۷/۲۰" : "1405/07/20";
    }, [locale, props.placeholder]);

    return (
      <div className="space-y-2">
        {label ? <label className="text-sm font-medium">{label}</label> : null}
        <Input
          ref={ref}
          inputMode="numeric"
          className={className}
          placeholder={placeholder}
          aria-label={label}
          {...props}
        />
        <div className="text-xs text-subtle">
          {helperText ?? (locale === "fa" ? "فرمت تاریخ: YYYY/MM/DD (جلالی)" : "Date format: YYYY/MM/DD (Jalali)")}
        </div>
      </div>
    );
  }
);

JalaliDateInput.displayName = "JalaliDateInput";
