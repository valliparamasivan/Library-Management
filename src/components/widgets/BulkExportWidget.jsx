"use client";

import { Upload } from "lucide-react";
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

    try {
      const selectedIds = hasSelectedItems ? selectedItems : [];
      const { status, fromDate, toDate, ...restParams } = params;
      const exportParams = {
        ...restParams,
        ...(status !== undefined && status !== "" && { type: status }),
        ...(fromDate !== undefined && fromDate !== "" && { startDate: fromDate }),
        ...(toDate !== undefined && toDate !== "" && { endDate: toDate }),
        ...(selectedIds.length > 0 ? { [keyName]: selectedIds } : {}),
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
    <ButtonWidget
      variant="outline"
      className={`text-[#1A1A1A] text-[13.5px] font-medium rounded-md border-[#E6E6E6] ${className}`}
      disabled={isDisabled}
      onClick={handleExport}
      {...props}
    >
      <Upload className="w-4 h-4 text-[#00796B]" />
      {title}
    </ButtonWidget>
  );
};

export default BulkExportWidget;
