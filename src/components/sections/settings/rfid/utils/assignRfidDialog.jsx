"use client";

import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { X, Scan} from "lucide-react";

const AssignRfidDialog = ({ open, onOpenChange, onScan }) => {
    const handleClose = () => {
        onOpenChange(false);
    };

    const handleScan = () => {
        if (onScan) {
            onScan();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogDescription className="sr-only">Assign RFID</DialogDescription>
            <DialogContent hideClose className="w-[calc(100%-2rem)] sm:max-w-[400px] rounded-2xl p-4 sm:p-6 border-0 max-h-[90vh] overflow-y-auto">
                <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-base sm:text-[18px] font-semibold text-[#42434B]">Assign RFID</h1>
                        <button onClick={handleClose} className="shrink-0 rounded-md text-[#1A1A1A] hover:text-[#42434B] focus:outline-none" ><X className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" /></button>
                    </div>
                    <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 pt-1 sm:pt-2">
                        <div className="flex items-center justify-center text-[#00796B]">
                            <Scan className="w-12 h-12 sm:w-16 sm:h-16" />
                        </div>
                        <p className="text-sm sm:text-[16px] text-[#2F2F2F] text-center">
                            Scan Barcode to Assign RFID
                        </p>
                    </div>
                    <div className="flex justify-center pt-1 sm:pt-2">
                        <ButtonWidget className="px-4 sm:px-6 py-2 bg-[#00796B] hover:bg-[#00796B]/90 text-white text-sm sm:text-base" onClick={handleScan}><Scan className="w-4 h-4" />Scan Barcode</ButtonWidget>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AssignRfidDialog;

