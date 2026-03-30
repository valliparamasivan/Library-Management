"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, Download, Loader2Icon } from "lucide-react";
import { useState } from "react";
import ButtonWidget from "./ButtonWidget";
import TooltipWidget from "./TooltipWidget";

const DocumentWidget = ({
  onExport,
  endpoint,
  fileBaseName = "download",
  extraParams = {},
  formatOptions = [
    { label: "MS Excel", value: "xlsx" },
    // { label: "CSV", value: "csv" },
    // { label: "PDF", value: "pdf" },
  ],
}) => {
  const [loadingFormat, _setLoadingFormat] = useState(null);

  const handleExport = async (value) => {};

  return (
    <Popover>
      <PopoverTrigger asChild>
        <ButtonWidget variant="outline" size="sm" className="h-9 px-3 rounded-sm text-gray-600 bg-white hover:bg-gray-50 border border-gray-300 flex items-center gap-2 w-full sm:w-auto">
          <Download className="w-4 h-4 text-[#00796B]" />
          <span className="text-sm text-gray-600">Export</span>
        </ButtonWidget>
      </PopoverTrigger>

      <PopoverContent className="w-48 p-2" align="start">
        <div className="space-y-1">
          {formatOptions.map((option) => {
            const isLoading = loadingFormat === option.value;
            return (
              <button
                key={option.value}
                onClick={() => handleExport(option.value)}
                disabled={isLoading}
                className="w-full flex cursor-pointer items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{option.label}</span>
                {isLoading ? <Loader2Icon className="h-4 w-4 text-muted-foreground animate-spin" /> : <Download className="h-4 w-4 text-muted-foreground" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DocumentWidget;
