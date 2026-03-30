"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Controller } from "react-hook-form";

const FormCheckbox = ({
  name,
  control,
  label,
  description,
  disabled = false,
  className = "",
  rules = {},
  error = null,
  labelclassName = "",
  color = "",
  containerClassName = "",
  onCheckedChange,
}) => {
  return (
    <div className={cn("grid w-full items-center gap-1.5", containerClassName)}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={name}
                checked={field.value}
                onCheckedChange={onCheckedChange || field.onChange}
                disabled={disabled}
                className={cn(className, (error || fieldState.invalid) && "border-destructive")}
              />
              <div className="grid gap-1.5 leading-none">
                {label && (
                  <Label htmlFor={name} className={cn("cursor-pointer", color, labelclassName)}>
                    {label}
                  </Label>
                )}
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
              </div>
            </div>
            {(error || fieldState.error) && <p className="font-medium absolute mt-8.5 text-xs ms-6 orange-text-color">{error || fieldState.error?.message}</p>}
          </>
        )}
      />
    </div>
  );
};

export default FormCheckbox;
