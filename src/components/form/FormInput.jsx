"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Controller } from "react-hook-form";

const FormInput = ({
  name,
  control,
  label,
  type = "text",
  placeholder = "",
  disabled = false,
  className = "bg-white border border-[#D9D9D9] min-h-[44px] rounded-sm px-4",
  rules = {},
  error = null,
  required = false,
  prefix = null,
  suffix = null,
  readOnly = false,
}) => {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <Label htmlFor={name} className="mb-2">
          {label}
          {required && <span className="text-red-600 ml-[-5px]">*</span>}
        </Label>
      )}
      <div className="relative w-full">
        {prefix && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-600 pointer-events-none">{prefix}</div>}
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field, fieldState }) => (
            <>
              <Input
                {...field}
                value={field.value ?? ""}
                id={name}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                className={cn(className, prefix && "pl-10", suffix && "pr-16!", (error || fieldState.invalid) && "border-red-600", readOnly && "bg-gray-100")}
              />
              {(error || fieldState.error) && <p className="font-medium text-red-600 relative mt-1 text-xs ms-4">{error || fieldState.error?.message}</p>}
            </>
          )}
        />
        {suffix && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 pointer-events-none">{suffix}</div>}
      </div>
    </div>
  );
};

export default FormInput;
