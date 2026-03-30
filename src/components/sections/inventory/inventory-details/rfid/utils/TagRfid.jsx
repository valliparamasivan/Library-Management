"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { Check, X } from "lucide-react";
import AssignLocationDialog from "../../location/utils/assignLocationDialog";

const TagRfid = ({ isOpen, onOpenChange, rfidTagId, bookTitle, record, sectionDropdown, shelfDropdown, rowDropdown }) => {
    const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
    const recordRef = useRef(null);
    useEffect(() => {
        if (record) {
            recordRef.current = record;
        }
    }, [record]);

    const handleDone = () => {
        if (recordRef.current) {
            setIsLocationDialogOpen(true);
        }
        onOpenChange(false);
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent hideClose className="w-[calc(100%-2rem)] sm:max-w-[400px] rounded-2xl p-4 sm:p-6 border-0 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-base sm:text-lg font-semibold text-gray-900">Tag RFID</DialogTitle>
                        <button
                            onClick={handleDone}
                            className="shrink-0 rounded-md text-[#1A1A1A] hover:text-[#42434B] focus:outline-none"
                        >
                            <X className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
                        </button>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#DCFCE7] border-2 border-[#00A63E] flex items-center justify-center">
                                <Check className="w-5 h-5 sm:w-8 sm:h-8 text-[#00A63E]" />
                            </div>
                        </div>
                        <p className="text-sm sm:text-base text-gray-700 text-center px-2">
                            RFID <span className="font-semibold text-[#00796B]">"{rfidTagId}"</span> Tagged with <span className="font-semibold text-[#00796B]">"{bookTitle}"</span> Book Successfully
                        </p>
                    </div>
                    
                    <div className="flex justify-center pt-4 sm:pt-6">
                        <ButtonWidget 
                            className="w-full sm:w-auto px-6 sm:px-8 py-2 bg-[#00796B] hover:bg-[#00695C] text-white rounded-sm" 
                            onClick={handleDone}
                        >
                            Done
                        </ButtonWidget>
                    </div>
                </DialogContent>
            </Dialog>
            
            {recordRef.current && (
                <AssignLocationDialog
                    isOpen={isLocationDialogOpen}
                    onOpenChange={setIsLocationDialogOpen}
                    id={recordRef.current}
                    sectionDropdown={sectionDropdown}
                    shelfDropdown={shelfDropdown}
                    rowDropdown={rowDropdown}
                />
            )}
        </>
    );
};

export default TagRfid;
