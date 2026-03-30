"use client";

import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { Loader2, Unlink, X } from "lucide-react";
import { useState } from "react";

const ReleaseRfidDialog = ({ open, onOpenChange, rfidData }) => {

    const handleClose = () => {
        onOpenChange(false);
    };

    const handleConfirm = async () => {

    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogDescription className="sr-only">Release RFID Confirmation</DialogDescription>
            <DialogContent hideClose className="w-[calc(100%-2rem)] sm:max-w-[400px] rounded-2xl p-4 sm:p-6 border-0 max-h-[90vh] overflow-y-auto">
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-base sm:text-[18px] font-semibold text-[#42434B]">Release RFID</h1>
                        <button onClick={handleClose} className="shrink-0 rounded-md text-[#1A1A1A] hover:text-[#42434B] focus:outline-none"><X className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" /></button>
                    </div>
                    <div className="text-center space-y-1">
                        <div className="text-sm sm:text-[16px] text-[#2F2F2F]">
                            Are you sure want to Release RFID?
                        </div>
                    </div>
                    {rfidData?.rfid && (
                        <div className="text-center">
                            <p className="text-[#2F2F2F] text-base sm:text-lg font-semibold mb-1 sm:mb-2 break-words">
                                {rfidData.rfid}
                            </p>
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-1 sm:pt-2">
                        <ButtonWidget className="w-full bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-sm sm:text-base" onClick={handleClose} > Cancel</ButtonWidget>
                        <ButtonWidget className="w-full bg-[#00796B] hover:bg-[#00796B]/90 text-white text-sm sm:text-base" onClick={handleConfirm} >Release RFID</ButtonWidget>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ReleaseRfidDialog;

