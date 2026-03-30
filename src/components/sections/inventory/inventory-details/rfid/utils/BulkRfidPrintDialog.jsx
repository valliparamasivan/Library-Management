"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { X } from "lucide-react";
import BarcodeDisplay from "./BarcodeDisplay";

const BulkRfidPrintDialog = ({
    isOpen,
    onOpenChange,
    selectedCount = 6,
    eligibleCount = 4,
    skippedCount = 2,
    tagsToPrint = ["K1L2M3N405", "P4Q5R6S7T8", "U1V2W3X4Y5", "Z9Y8X7W6V5"],
}) => {
    const handleClose = () => {
        onOpenChange(false);
    };

    const handlePrint = () => {
        // Wire to actual print logic
        handleClose();
    };

    const handleOpenChangeInternal = (open) => {
        onOpenChange(open);
    };

    const displayTags = tagsToPrint;
    const isSingleTag = displayTags.length === 1;

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
                            Skipped (Printed): <span className="font-semibold text-gray-900">{String(skippedCount).padStart(2, "0")}</span> rows
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-200 my-2" />

                <div className="px-4 sm:px-6 md:px-8 overflow-y-auto flex-1 min-h-0 max-h-[300px] sm:max-h-[400px] md:max-h-[500px]">
                    {displayTags.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 bg-white">
                            <p className="text-sm text-gray-500">No tags to display</p>
                        </div>
                    ) : isSingleTag ? (
                        <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-white">
                            <div className="transform scale-110 sm:scale-125 md:scale-150">
                                <BarcodeDisplay value={displayTags[0] || ""} />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pb-2">
                            {displayTags.map((code) => (
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
                    >
                        Cancel
                    </ButtonWidget>
                    <ButtonWidget
                        className="w-full sm:flex-1 bg-[#00796B] hover:bg-[#00796B]/90 text-white rounded-md border-0 text-sm sm:text-base py-2 sm:py-2.5"
                        onClick={handlePrint}
                    >
                        Print Tag
                    </ButtonWidget>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BulkRfidPrintDialog;
