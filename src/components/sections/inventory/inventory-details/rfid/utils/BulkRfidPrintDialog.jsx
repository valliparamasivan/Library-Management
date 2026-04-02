"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BarcodeDisplay from "./BarcodeDisplay";
import { generateBarcodeHtml, openPrintWindow } from "./generateBarcodeHtml";
import FormSelect from "@/components/form/FormSelect";
import { useForm } from "react-hook-form";
import { useUpdateRfidPrintStatus, useReprintRfid } from "@/store/hooks/InventoryHooks";
import useErrorHandler from "@/components/custom-hooks/useErrorHandler";

const reasonOptions = [
  { value: "damaged", label: "Damaged" },
  { value: "lost", label: "Lost" },
  { value: "replacement", label: "Replacement" },
  { value: "other", label: "Other" },
];

const BulkRfidPrintDialog = ({
  isOpen,
  onOpenChange,
  selectedCount = 0,
  eligibleCount = 0,
  skippedCount = 0,
  tagsToPrint = [],
  rfidIds = [],
  reprintRecords = [],
}) => {
  const router = useRouter();
  const { mutateAsync: updatePrintStatus, isPending: isPrintPending } = useUpdateRfidPrintStatus();
  const { mutateAsync: reprintRfidApi, isPending: isReprintPending } = useReprintRfid();
  const { showSuccessToast, showErrorToast } = useErrorHandler();
  const { control, watch, reset } = useForm({ defaultValues: { reason: "" } });
  const selectedReason = watch("reason");

  const isPending = isPrintPending || isReprintPending;
  const hasReprintRecords = reprintRecords.length > 0;
  const reprintTags = reprintRecords.map((r) => r.rfidTagId).filter(Boolean);
  const allTags = [...tagsToPrint, ...reprintTags];
  const canPrint = allTags.length > 0 && (!hasReprintRecords || selectedReason);

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const handleClose = () => {
    if (isPending) return;
    onOpenChange(false);
  };

  const handlePrint = async () => {
    if (allTags.length === 0) return;

    openPrintWindow(allTags.map((tag) => generateBarcodeHtml(tag)), "Print RFID Tags");

    try {
      if (rfidIds.length > 0) {
        const response = await updatePrintStatus(rfidIds);
        showSuccessToast(response?.message || "RFID status updated to Printed");
      }

      if (selectedReason && reprintRecords.length > 0) {
        const reasonLabel = reasonOptions.find((o) => o.value === selectedReason)?.label || selectedReason;
        for (const record of reprintRecords) {
          if (record.rfidId) {
            await reprintRfidApi({ rfidId: record.rfidId, reason: reasonLabel });
          }
        }
        showSuccessToast("Reprinted tags updated successfully");
      }

      router.refresh();
    } catch (error) {
      showErrorToast(error?.data?.message || error?.message || "Failed to update RFID status");
    }

    handleClose();
  };

  const handleOpenChangeInternal = (open) => {
    onOpenChange(open);
  };

  const isSingleTag = allTags.length === 1;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChangeInternal}>
      <DialogContent
        hideClose
        className="w-[calc(100%-2rem)] sm:max-w-2xl rounded-2xl p-0 border-0 max-h-[90vh] overflow-hidden flex flex-col shadow-lg"
      >
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 pt-4 sm:pt-6">
          <DialogTitle className="text-base sm:text-lg font-semibold text-gray-900">
            Bulk Print RFID Tags
          </DialogTitle>
          <button
            onClick={handleClose}
            className="shrink-0 rounded-md text-[#1A1A1A] hover:text-[#42434B] focus:outline-none"
            type="button"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
          </button>
        </div>

        <div className="px-4 sm:px-6 md:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
            <p>
              <span className="mr-2">•</span>
              Selected: <span className="font-semibold text-gray-900">{String(selectedCount).padStart(2, "0")}</span> rows
            </p>
            <p>
              <span className="mr-2">•</span>
              Eligible (Unprinted): <span className="font-semibold text-gray-900">{String(eligibleCount).padStart(2, "0")}</span> rows
            </p>
            <p>
              <span className="mr-2">•</span>
              Already Printed: <span className="font-semibold text-gray-900">{String(skippedCount).padStart(2, "0")}</span> rows
            </p>
          </div>
        </div>

        {hasReprintRecords && (
          <div className="px-4 sm:px-6 md:px-8 pt-2">
            <div className="border border-amber-200 bg-amber-50 rounded-lg p-3">
              <p className="text-xs sm:text-sm text-amber-800 mb-2">
                <span className="font-semibold">{reprintRecords.length}</span> tag(s) have already been printed. Please select a reason to proceed with reprinting.
              </p>
              <div className="max-w-xs">
                <FormSelect
                  control={control}
                  name="reason"
                  placeholder="Select Reprint Reason"
                  options={reasonOptions}
                />
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 my-2" />

        <div className="px-4 sm:px-6 md:px-8 overflow-y-auto flex-1 min-h-0 max-h-[300px] sm:max-h-[400px] md:max-h-[500px]">
          {allTags.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 bg-white">
              <p className="text-sm text-gray-500">No tags to display</p>
            </div>
          ) : isSingleTag ? (
            <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-white">
              <div className="transform scale-110 sm:scale-125 md:scale-150">
                <BarcodeDisplay value={allTags[0] || ""} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pb-2">
              {allTags.map((code) => (
                <div key={code} className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white">
                  <BarcodeDisplay value={code || ""} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 pt-3 sm:pt-4 border-t border-gray-100">
          <ButtonWidget
            className="w-full sm:flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md text-sm sm:text-base py-2 sm:py-2.5"
            onClick={handleClose}
            disabled={isPending}
            loader={false}
          >
            Cancel
          </ButtonWidget>
          <ButtonWidget
            className="w-full sm:flex-1 bg-[#00796B] hover:bg-[#00796B]/90 text-white rounded-md border-0 text-sm sm:text-base py-2 sm:py-2.5"
            onClick={handlePrint}
            disabled={isPending || !canPrint}
            loader={isPending}
          >
            Print Tag
          </ButtonWidget>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkRfidPrintDialog;
