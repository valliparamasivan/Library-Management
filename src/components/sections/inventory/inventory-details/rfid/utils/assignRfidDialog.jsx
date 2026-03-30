"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { Scan, X } from "lucide-react";

const AssignRfidDialog = ({ isOpen, onOpenChange, id, onScan }) => {
    const handleClose = () => {
        onOpenChange(false);
    };

    const handleScan = () => {
        if (onScan) {
            onScan();
        }
    };

    const handleOpenChangeInternal = (open) => {
        onOpenChange(open);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChangeInternal}>
            <DialogContent hideClose className="w-[calc(100%-2rem)] sm:max-w-[400px] rounded-2xl p-4 sm:p-6 border-0 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                    <DialogTitle className="text-base sm:text-lg font-semibold text-gray-900">Assign RFID</DialogTitle>
                    <button
                        onClick={handleClose}
                        className="shrink-0 rounded-md text-[#1A1A1A] hover:text-[#42434B] focus:outline-none"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
                    </button>
                </div>
                    <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 pt-2 sm:pt-4">
                        <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#DCFCE7]">
                            <Scan className="w-7 h-7 sm:w-8 sm:h-8 text-[#00796B]" />
                        </div>
                        <p className="text-sm sm:text-[16px] text-[#2F2F2F] text-center px-2">
                            Scan Barcode to Assign RFID
                        </p>
                    </div>
                    <div className="flex justify-center pt-2 sm:pt-4">
                        <ButtonWidget 
                            className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-[#00796B] hover:bg-[#00796B]/90 text-white rounded-sm" 
                            onClick={handleScan}
                        >
                            <Scan className="w-4 h-4" />
                            Scan Barcode
                        </ButtonWidget>
                    </div>
            </DialogContent>
        </Dialog>
    );
};

export default AssignRfidDialog;

