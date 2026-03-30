"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Controller } from "react-hook-form";

const FormValueCheckbox = ({ name, control, label, value, description, disabled = false, className = "", rules = {}, error = null, labelclassName = "" }) => {
  return (
    <div className="grid w-full items-center gap-1.5">
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => {
          const isChecked = Array.isArray(field.value) ? field.value.includes(value) : field.value === value;

          return (
            <>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${name}-${value}`}
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    if (Array.isArray(field.value)) {
                      const newValue = checked ? [...field.value, value] : field.value.filter((v) => v !== value);
                      field.onChange(newValue);
                    } else {
                      field.onChange(checked ? value : null);
                    }
                  }}
                  disabled={disabled}
                  className={cn(className, (error || fieldState.invalid) && "border-destructive")}
                />
                <div className="grid gap-1.5 leading-none">
                  {label && (
                    <Label htmlFor={`${name}-${value}`} className={cn("cursor-pointer", labelclassName)}>
                      {label}
                    </Label>
                  )}
                  {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
              </div>
              {(error || fieldState.error) && <p className="font-medium absolute mt-8.5 text-xs ms-6 orange-text-color">{error || fieldState.error?.message}</p>}
            </>
          );
        }}
      />
    </div>
  );
};

export default FormValueCheckbox;
