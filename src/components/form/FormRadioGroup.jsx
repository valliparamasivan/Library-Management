"use client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Controller } from "react-hook-form";

const FormRadioGroup = ({ name, control, label, options = [], disabled = false, className = "", rules = {}, error = null, orientation = "vertical" }) => {
  return (
    <div className="grid w-full items-center gap-1.5">
      {label && <Label>{label}</Label>}
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <>
            <RadioGroup className={cn(orientation === "horizontal" ? "flex gap-4" : "grid gap-2", className)}>
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`${name}-${option.value}`}
                    name={name}
                    checked={field.value === option.value}
                    onChange={field.onChange}
                    disabled={disabled}
                    className={cn((error || fieldState.invalid) && "border-destructive text-destructive ")}
                  />
                  <Label htmlFor={`${name}-${option.value}`} className={"text-sm 3xl:text-lg leading-6 3xl:leading-[26px]"}>
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {(error || fieldState.error) && <p className="font-medium orange-text-color absolute mt-14 text-xs ms-4">{error || fieldState.error?.message}</p>}
          </>
        )}
      />
    </div>
  );
};

export default FormRadioGroup;
