"use client";
import One from "@/assets/icons/4.svg";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { endOfDay, format, startOfDay } from "date-fns";
import { useState } from "react";
import { Controller } from "react-hook-form";
import ImageWidget from "../widgets/ImageWidget";

const FormCalendar = ({
  control,
  name,
  label,
  placeholder = "Pick a date",
  className,
  disabled = false,
  required = false,
  dateFormat = "PPP",
  iconPosition = "left",
  minDate,
  maxDate,
}) => {
  const [open, setOpen] = useState(false);
  const disabledMatchers = [];
  if (minDate instanceof Date) {
    disabledMatchers.push({ before: startOfDay(minDate) });
  }
  if (maxDate instanceof Date) {
    disabledMatchers.push({ after: endOfDay(maxDate) });
  }
  const calendarDisabled = disabledMatchers.length > 0 ? disabledMatchers : undefined;
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full text-left font-normal border border-[#D9D9D9] min-h-[44px] rounded-sm px-4",
                    iconPosition === "right" ? "justify-between" : "justify-start",
                    !field.value && "text-muted-foreground",
                    error && "border-red-500",
                    className,
                  )}
                  disabled={disabled}
                >
                  {iconPosition === "left" && <ImageWidget src={One} alt="Assets" className="w-8 h-8 sm:w-7 sm:h-7" />}
                  {field.value ? format(field.value, dateFormat) : <span>{placeholder}</span>}
                  {iconPosition === "right" && <ImageWidget src={One} alt="Assets" className="w-8 h-8 sm:w-7 sm:h-7" />}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Calendar
                  className="w-full"
                  classNames={{ root: "w-full" }}
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    field.onChange(date);
                    if (date) setOpen(false);
                  }}
                  disabled={calendarDisabled}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
          </>
        )}
      />
    </div>
  );
};

export default FormCalendar;
