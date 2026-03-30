"use client";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "../custom-hooks/useIsMobile";
import BrowserFullscreenWidget from "./BrowserFullscreenWidget";
import ButtonWidget from "./ButtonWidget";
import ColumnVisibilityWidget from "./ColumnVisibilityWidget";
import CreateButtonWidget from "./CreateButtonWidget";
import DocumentWidget from "./DocumentWidget";
import FilterWidget from "./FilterWidget";
import InstructionWidget from "./InstructionWidget";
import RefreshWidget from "./RefreshWidget";

const ActionFilters = ({
  createHref,
  onDownload,
  columns,
  endpoint,
  fileBaseName,
  isColumnVisible,
  toggleColumnVisibility,
  isInstructionVisible,
  instructionTitle,
  instructionContent,
  className = "",
  createButtonClassName = "bg-gray-100 hover:bg-gray-200 text-black p-2 rounded-sm shadow-sm border-0 flex-1 sm:flex-none",
  tooltipWidth = "w-200",
  hideFilter = false,
}) => {
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const renderWidget = (widgetType) => {
    switch (widgetType) {
      case "create":
        return <CreateButtonWidget key="create" createHref={createHref} className={createButtonClassName} />;

      case "instruction":
        if (!isInstructionVisible) return null;
        return <InstructionWidget key="instruction" title={instructionTitle} content={instructionContent} tooltipWidth={tooltipWidth} />;

      case "document":
        if (!endpoint || !fileBaseName) return null;
        return <DocumentWidget key="document" endpoint={endpoint} fileBaseName={fileBaseName} />;

      case "filter":
        return <FilterWidget key="filter" />;

      // case "columnVisibility":
      //   if (!columns || !isColumnVisible || !toggleColumnVisibility) return null;
      //   return <ColumnVisibilityWidget key="columnVisibility" columns={columns} isColumnVisible={isColumnVisible} toggleColumnVisibility={toggleColumnVisibility} />;

      // case "fullscreen":
      //   return <BrowserFullscreenWidget key="fullscreen" className={createButtonClassName} />;

      // case "refresh":
      //   return <RefreshWidget key="refresh" className={createButtonClassName} />;

      default:
        return null;
    }
  };

  const widgetTypes = hideFilter 
    ? ["document", "create", "instruction", "columnVisibility", "fullscreen", "refresh"]
    : ["filter", "document", "create", "instruction", "columnVisibility", "fullscreen", "refresh"];
  const renderedWidgets = widgetTypes.map(renderWidget).filter(Boolean);

  const MobileSheetContent = () => (
    <div className="flex flex-col gap-4 p-4">
      {renderedWidgets.map((widget, index) => (
        <div key={index} className="flex justify-center">
          {widget}
        </div>
      ))}
    </div>
  );

  if (isMobile) {
    // On mobile, show only the export button directly
    const documentWidget = renderWidget("document");
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {documentWidget}
      </div>
    );
  }

  return <div className={`flex items-center gap-2 ${className}`}>{renderedWidgets}</div>;
};

export default ActionFilters;
