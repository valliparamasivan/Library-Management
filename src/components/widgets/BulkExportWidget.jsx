"use client";

import { Upload } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { errorToast, successToast } from "@/helpers/ErrorHelpers";

const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

const generateFileName = (baseName, extension) => {
  const date = new Date();
  const dateStr = date.toISOString().split("T")[0];
  return `${baseName}-${dateStr}.${extension}`;
};

const BulkExportWidget = ({
  title = "Export",
  className = "",
  exportFn,
  selectedItems = [],
  allData = [],
  getItemId = (item) => item.id,
  params = {},
  filenameBase = "export",
  filenameExtension = "xlsx",
  successMessage = "Export completed successfully!",
  loading = false,
  disabled = false,
  requireSelection = false,
  keyName = "selectedIds",
  moduleType,
  downloadType,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const hasSelectedItems = selectedItems.length > 0;
  const isDisabled =
    disabled || loading || (requireSelection && !hasSelectedItems);

  const handleExport = async () => {
    if (!exportFn) {
      console.error("Export function is required");
      return;
    }

    if (requireSelection && !hasSelectedItems) {
      console.warn("No items selected for export");
      return;
    }

    setOpen(false);

    try {
      const selectedIds = requireSelection
        ? selectedItems.join(",")
        : hasSelectedItems
          ? selectedItems.join(",")
          : allData.map((item) => getItemId(item)).join(",");
      const { status, fromDate, toDate, ...restParams } = params;
      const exportParams = {
        ...restParams,
        ...(status !== undefined && status !== "" && { type: status }),
        ...(fromDate !== undefined && fromDate !== "" && { startDate: fromDate }),
        ...(toDate !== undefined && toDate !== "" && { endDate: toDate }),
        [keyName]: selectedIds || "",
        ...(moduleType !== undefined && { moduleType }),
        ...(downloadType !== undefined && { downloadType }),
      };

      const blob = await exportFn(exportParams);

      const filename = generateFileName(filenameBase, filenameExtension);
      downloadFile(blob, filename);

      successToast(successMessage);
    } catch (error) {
      errorToast(error);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ButtonWidget
          variant="outline"
          className={`text-[#1A1A1A] text-[13.5px] font-medium rounded-md border-[#E6E6E6] ${className}`}
          disabled={isDisabled}
          {...props}
        >
          <Upload className="w-4 h-4 text-[#00796B]" />
          {title}
        </ButtonWidget>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="start">
        <button
          onClick={handleExport}
          disabled={isDisabled || loading}
          className="w-full flex cursor-pointer items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Export as Excel</span>
          {loading && (
            <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          )}
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default BulkExportWidget;
