"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import BarcodeDisplay from "./BarcodeDisplay";
import { generateBarcodeHtml, openPrintWindow } from "./generateBarcodeHtml";
import { useUpdateRfidPrintStatus } from "@/store/hooks/InventoryHooks";
import useErrorHandler from "@/components/custom-hooks/useErrorHandler";

const PrintRfidTag = ({ isOpen, onOpenChange, rfidTagId, rfidId }) => {
    const router = useRouter();
    const { mutateAsync: updatePrintStatus, isPending } = useUpdateRfidPrintStatus();
    const { showSuccessToast, showErrorToast } = useErrorHandler();

    const handleClose = () => {
        onOpenChange(false);
    };

    const handlePrint = async () => {
        if (rfidTagId) {
            openPrintWindow(generateBarcodeHtml(rfidTagId), "Print RFID Tag");
        }

        if (rfidId) {
            try {
                const response = await updatePrintStatus([rfidId]);
                showSuccessToast(response?.message || "RFID status updated to Printed");
                router.refresh();
            } catch (error) {
                showErrorToast(error?.data?.message || error?.message || "Failed to update RFID status");
            }
        }

        handleClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                hideClose
                className="w-[calc(100%-2rem)] sm:max-w-md rounded-2xl p-0 border-0 max-h-[90vh] overflow-hidden flex flex-col shadow-lg"
            >
                <div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-6">
                    <DialogTitle className="text-base sm:text-lg font-semibold text-gray-900">
                        Print RFID Tag
                    </DialogTitle>
                    <button
                        onClick={handleClose}
                        className="shrink-0 rounded-md text-[#1A1A1A] hover:text-[#42434B] focus:outline-none"
                        type="button"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
                    </button>
                </div>

                <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 flex flex-col items-center justify-center flex-1">
                    <div className="w-full flex flex-col items-center justify-center">
                        <div className="transform scale-110 sm:scale-125">
                            <BarcodeDisplay value={rfidTagId} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 pt-3 sm:pt-4 border-t border-gray-100">
                    <ButtonWidget
                        className="w-full sm:flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md text-sm sm:text-base py-2 sm:py-2.5"
                        onClick={handleClose}
                        loading={false}
                    >
                        Cancel
                    </ButtonWidget>
                    <ButtonWidget
                        className="w-full sm:flex-1 bg-[#00796B] hover:bg-[#00796B]/90 text-white rounded-md border-0 text-sm sm:text-base py-2 sm:py-2.5"
                        onClick={handlePrint}
                        loading={isPending}
                        disabled={isPending}
                    >
                        Print Tag
                    </ButtonWidget>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PrintRfidTag;
