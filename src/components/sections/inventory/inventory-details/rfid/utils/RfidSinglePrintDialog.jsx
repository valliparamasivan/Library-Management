"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { X } from "lucide-react";
import BarcodeDisplay from "./BarcodeDisplay";

const RfidSinglePrintDialog = ({
    isOpen,
    onOpenChange,
    rfidTag = "",
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

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChangeInternal}>
            <DialogContent
                hideClose
                className="w-[calc(100%-2rem)] sm:max-w-md rounded-2xl p-0 border-0 max-h-[90vh] overflow-hidden flex flex-col shadow-lg"
            >
                <div className="flex items-center justify-between px-6 pt-6">
                    <DialogTitle className="text-lg font-semibold text-gray-900">
                        Print RFID Tag
                    </DialogTitle>
                    <button
                        onClick={handleClose}
                        className="shrink-0 rounded-md text-[#1A1A1A] hover:text-[#42434B] focus:outline-none"
                        type="button"
                    >
                        <X className="w-5 h-5 cursor-pointer" />
                    </button>
                </div>

                <div className="px-6 overflow-y-auto flex-1 min-h-0 flex items-center justify-center py-8">
                    <div className="flex flex-col items-center justify-center w-full">
                        <BarcodeDisplay value={rfidTag} />
                    </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 px-6 pb-6 pt-4 border-t border-gray-100">
                    <ButtonWidget
                        className="w-full sm:flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md"
                        onClick={handleClose}
                    >
                        Cancel
                    </ButtonWidget>
                    <ButtonWidget
                        className="w-full sm:flex-1 bg-[#00796B] hover:bg-[#00796B]/90 text-white rounded-md border-0"
                        onClick={handlePrint}
                    >
                        Print Tag
                    </ButtonWidget>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default RfidSinglePrintDialog;
