"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import FormMultiSelect from "@/components/form/FormMultiSelect";
import FormSwitch from "@/components/form/FormSwitch";
import { ChevronDown } from "lucide-react";
import filter from "@/assets/icons/13.svg";
import ImageWidget from "@/components/widgets/ImageWidget";

const CatalogFilter = ({
  availableOnly,
  onAvailableOnlyChange,
  selectedLanguage,
  onLanguageChange,
  selectedYears,
  onYearChange,
  onReset,
  languages = [],
}) => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(true);
  const isSyncingFromProp = useRef(false);
  const prevAvailableOnlyRef = useRef(availableOnly);
  const prevSelectedYearsRef = useRef(selectedYears);

  const { control, watch, setValue } = useForm({
    defaultValues: {
      availableOnly: availableOnly === true ? 1 : 0,
      selectedYears: selectedYears || [],
    },
  });

  const watchedAvailableOnly = watch("availableOnly");
  const watchedSelectedYears = watch("selectedYears");
  const prevWatchedValueRef = useRef(watchedAvailableOnly);
  const prevWatchedYearsRef = useRef(watchedSelectedYears);

  useEffect(() => {
    if (watchedAvailableOnly !== prevWatchedValueRef.current && !isSyncingFromProp.current && onAvailableOnlyChange) {
      const value = watchedAvailableOnly === 1;
      onAvailableOnlyChange(value);
    }
    prevWatchedValueRef.current = watchedAvailableOnly;
  }, [watchedAvailableOnly, onAvailableOnlyChange]);

  useEffect(() => {
    if (prevAvailableOnlyRef.current !== availableOnly) {
      const formValue = availableOnly === true ? 1 : 0;
      isSyncingFromProp.current = true;
      setValue("availableOnly", formValue, { shouldDirty: false });
      prevAvailableOnlyRef.current = availableOnly;
      prevWatchedValueRef.current = formValue;
    }
  }, [availableOnly, setValue]);

  useEffect(() => {
    if (isSyncingFromProp.current) {
      const expectedValue = availableOnly === true ? 1 : 0;
      if (watchedAvailableOnly === expectedValue) {
        isSyncingFromProp.current = false;
      }
    }
  }, [watchedAvailableOnly, availableOnly]);

  const availableLanguages = languages || [];
  const currentYear = new Date().getFullYear();
  const startYear = 1800;
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => 
    (currentYear - i).toString()
  );

  const handleLanguageToggle = (lang) => {
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  useEffect(() => {
    if (prevWatchedYearsRef.current !== watchedSelectedYears) {
      const prevYears = prevWatchedYearsRef.current || [];
      const currentYears = watchedSelectedYears || [];
      
      const added = currentYears.filter(y => !prevYears.includes(y));
      const removed = prevYears.filter(y => !currentYears.includes(y));
      
      if (added.length > 0 && onYearChange) {
        onYearChange(added[0]);
      } else if (removed.length > 0 && onYearChange) {
        onYearChange(removed[0]);
      }
      
      prevWatchedYearsRef.current = watchedSelectedYears;
    }
  }, [watchedSelectedYears, onYearChange]);

  useEffect(() => {
    if (prevSelectedYearsRef.current !== selectedYears) {
      setValue("selectedYears", selectedYears || []);
      prevWatchedYearsRef.current = selectedYears || [];
      prevSelectedYearsRef.current = selectedYears;
    }
  }, [selectedYears, setValue]);

  return (
    <div className="p-4 sticky top-4">
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <ImageWidget src={filter} alt="Filter" className="w-5 h-5" />
          <span className="font-semibold text-gray-900">Filter</span>
        </div>
        <button
          onClick={onReset}
          className="text-sm text-[#0b63ce] hover:text-[#0a5ab8] font-medium cursor-pointer"
        >
          Reset
        </button>
      </div>

      <div className="mb-6 border-b pb-2 flex items-center justify-between">
        <Label htmlFor="available-only" className="text-sm text-gray-700 cursor-pointer">
          Available Only
        </Label>
        <FormSwitch
          control={control}
          className="data-[state=checked]:bg-[#0B63CE]"
          name="availableOnly"
          label=""
          switchPosition="right"
        />
      </div>

      <Collapsible open={isLanguageOpen} onOpenChange={setIsLanguageOpen} className="mb-4">
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-900">
          <span>Language ({selectedLanguage.length})</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isLanguageOpen ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3">
          <div className="flex flex-wrap gap-2 whitespace-nowrap">
            {availableLanguages.map((lang) => {
              const isSelected = selectedLanguage.includes(lang);
              return (
                <button
                  key={lang}
                  onClick={() => handleLanguageToggle(lang)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#0b63ce] text-white"
                      : "border border-[#E6E6E6] text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
      <div className="mb-4">
        <FormMultiSelect
          control={control}
          name="selectedYears"
          label="Year"
          placeholder="Select year"
          options={years.map((year) => ({ value: year, label: year }))}
          className="px-3 py-2 bg-white border border-[#0b63ce]/30 rounded-lg focus:border-[#0b63ce] focus:outline-none focus:ring-2 focus:ring-[#0b63ce]/20 text-sm font-medium min-h-[44px]"
        />
      </div>
    </div>
  );
};

export default CatalogFilter;
