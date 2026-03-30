"use client";

import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { Barcode, X } from "lucide-react";
import { useState } from "react";

const ScannedTagDialog = ({ open, onOpenChange }) => {
    const [selectedRfid, setSelectedRfid] = useState("");

    const rfidOptions = [
        { value: "1", label: "RFID 1" },
        { value: "2", label: "RFID 2" },
    ];

    const handleClose = () => {
        setSelectedRfid("");
        onOpenChange(false);
    };

    const handleConfirm = () => {
        handleClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogDescription className="sr-only">Scanned Tag</DialogDescription>
            <DialogContent hideClose className="w-[calc(100%-2rem)] sm:max-w-[400px] rounded-2xl p-4 sm:p-6 border-0 max-h-[90vh] overflow-y-auto">
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <Barcode className="w-4 h-4 sm:w-5 sm:h-5 text-[#00796B]" />
                            <h1 className="text-base sm:text-[18px] font-semibold text-[#42434B]">Scanned Tag</h1>
                        </div>
                        <button 
                            onClick={handleClose} 
                            className="shrink-0 rounded-md text-[#1A1A1A] hover:text-[#42434B] focus:outline-none"
                        >
                            <X className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
                        </button>
                    </div>

                    <div className="space-y-2 pt-1 sm:pt-2">
                        <Label htmlFor="rfid-select" className="text-xs sm:text-sm font-medium text-[#2F2F2F]">
                            Select RFID
                        </Label>
                        <Select value={selectedRfid} onValueChange={setSelectedRfid}>
                            <SelectTrigger 
                                id="rfid-select"
                                className="w-full h-10 sm:h-11 bg-transparent border border-[#D9D9D9] rounded-sm text-sm sm:text-base"
                            >
                                <SelectValue placeholder="Select RFID" />
                            </SelectTrigger>
                            <SelectContent>
                                {rfidOptions.length > 0 ? (
                                    rfidOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="no-options" disabled>
                                        No RFID available
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-1 sm:pt-2">
                        <ButtonWidget 
                            className="w-full bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-sm sm:text-base" 
                            onClick={handleClose}
                        >
                            Cancel
                        </ButtonWidget>
                        <ButtonWidget 
                            className="w-full bg-[#00796B] hover:bg-[#00796B]/90 text-white text-sm sm:text-base" 
                            onClick={handleConfirm}
                        >
                            Assign RFID
                        </ButtonWidget>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ScannedTagDialog;

