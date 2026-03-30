"use client";

import useURLParams from "@/components/custom-hooks/useURLParams";
import FormCalendar from "@/components/form/FormCalendar";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import FormWrapper from "@/components/form/FormWrapper";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import TooltipWidget from "@/components/widgets/TooltipWidget";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Search } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const AdvancedSearchWidget = ({
  searchFields = [],
  title = "Advanced Search",
  triggerIcon: TriggerIcon = Search,
  triggerVariant = "outline",
  triggerClassName = "bg-gray-100 hover:bg-gray-200 text-black p-2 rounded-lg shadow-sm border-0 flex-1 sm:flex-none",
  tooltipText = "Advanced Search",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const additionalParams = searchFields.reduce((acc, field) => {
    acc[field.name] = {
      paramName: field.name,
      defaultValue: field.defaultValue || "",
    };
    return acc;
  }, {});

  const { updateURL, getCurrentParams } = useURLParams({
    additionalParams,
  });

  const currentParams = getCurrentParams();

  const defaultValues = searchFields.reduce((acc, field) => {
    acc[field.name] = currentParams[field.name] || field.defaultValue || "";
    return acc;
  }, {});

  const { control, handleSubmit, reset } = useForm({
    defaultValues,
  });

  const onSubmit = async (data) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    const filterUpdates = {};

    Object.entries(data).forEach(([key, value]) => {
      if (value && value !== "") {
        if (key === "movedDate" && value instanceof Date) {
          filterUpdates[key] = value.toISOString().split("T")[0];
        } else if (typeof value === "string" && value.trim() !== "") {
          filterUpdates[key] = value.trim();
        } else if (value !== null && value !== undefined) {
          filterUpdates[key] = value;
        }
      } else {
        filterUpdates[key] = "";
      }
    });

    updateURL({ page: 0, ...filterUpdates });
    setIsOpen(false);
    setIsSubmitting(false);
  };

  const handleReset = () => {
    if (isSubmitting) return;
    const resetParams = { page: 0 };

    searchFields.forEach((field) => {
      resetParams[field.name] = "";
    });

    updateURL(resetParams);
    reset(resetParams);
    setIsOpen(false);
  };

  const renderField = (field) => {
    const commonProps = {
      control,
      name: field.name,
      label: field.label,
      placeholder: field.placeholder || `Enter ${field.label}`,
    };

    switch (field.type) {
      case "select":
        return <FormSelect {...commonProps} options={field.options || []} />;
      case "date":
        return <FormCalendar {...commonProps} mode="single" />;
      case "number":
        return <FormInput {...commonProps} type="number" min={field.min} max={field.max} step={field.step} />;
      case "email":
        return <FormInput {...commonProps} type="email" />;
      case "tel":
        return <FormInput {...commonProps} type="tel" />;
      default:
        return <FormInput {...commonProps} />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipWidget content={tooltipText}>
        <DialogTrigger asChild>
          <ButtonWidget variant={triggerVariant} className={triggerClassName}>
            <TriggerIcon className="w-4 h-4" />
          </ButtonWidget>
        </DialogTrigger>
      </TooltipWidget>

      <DialogContent className={`${searchFields.length > 5 ? "max-w-3xl" : "max-w-md"} max-h-screen overflow-y-auto border-0`}>
        <DialogHeader className="flex justify-between">
          <DialogTitle className="text-lg font-semibold text-gray-900">{title}</DialogTitle>
          <DialogDescription className="sr-only">{title}</DialogDescription>
        </DialogHeader>

        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          {searchFields.length > 5 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div className="space-y-4">
                {searchFields.slice(0, Math.ceil(searchFields.length / 2)).map((field, index) => (
                  <div key={field.name || index}>{renderField(field)}</div>
                ))}
              </div>

              <div className="space-y-4">
                {searchFields.slice(Math.ceil(searchFields.length / 2)).map((field, index) => (
                  <div key={field.name || index}>{renderField(field)}</div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              {searchFields.map((field, index) => (
                <div key={field.name || index}>{renderField(field)}</div>
              ))}
            </div>
          )}

          <div className="flex justify-center gap-4 mt-6">
            <ButtonWidget
              type="button"
              onClick={handleReset}
              variant="outline"
              className="h-10 px-14 border-[#D9D9D9] hover:bg-[#92DEC2]/10 rounded-[14px]"
              disabled={isSubmitting}
            >
              Reset
            </ButtonWidget>
            <ButtonWidget type="submit" className="bg-[#92DEC2] hover:bg-[#1F263E]/80 h-10 px-14 rounded-[14px]" disabled={isSubmitting}>
              Search
            </ButtonWidget>
          </div>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedSearchWidget;
