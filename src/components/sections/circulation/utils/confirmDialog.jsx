"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { Check, X } from "lucide-react";

const ConfirmDialog = ({
    isOpen = false,
    onOpenChange,
    title = "Success",
    message = "Operation completed successfully",
    detail = "",
    onBack,
    onDone,
    backButtonText = "Back",
    doneButtonText = "Done"
}) => {
    const handleClose = () => {
        if (onOpenChange) {
            onOpenChange(false);
        }
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        }
        handleClose();
    };

    const handleDone = () => {
        if (onDone) {
            onDone();
        }
        handleClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogTitle className="sr-only">{title}</DialogTitle>
            <DialogDescription className="sr-only">{message}</DialogDescription>
            <DialogContent hideClose className="w-[calc(100%-2rem)] sm:max-w-[460px] rounded-2xl p-4 sm:p-6 border-0 max-h-[90vh] overflow-y-auto">
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-end">
                        <button
                            onClick={handleClose}
                            className="shrink-0 rounded-md text-[#1A1A1A] hover:text-[#42434B] focus:outline-none"
                        >
                            <X className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
                        </button>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-[#DCFCE7] border-2 border-[#00A63E] flex items-center justify-center">
                            <Check className="w-5 h-5 sm:w-8 sm:h-8 text-[#00A63E]" />
                        </div>
                    </div>

                    <div className="text-center space-y-2 px-2 sm:px-0">
                        <div className="text-sm sm:text-base md:text-[18px] font-semibold text-[#1A1A1A] leading-5 sm:leading-6 md:leading-[32px] tracking-normal text-center break-words">
                            {message}
                        </div>
                        {detail && (
                            <div className="text-xs sm:text-sm text-gray-500 break-words px-1 sm:px-0">
                                {detail}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 pt-2">
                        <ButtonWidget
                            variant="outline"
                            className="w-full rounded-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 order-2 sm:order-1"
                            onClick={handleBack}
                        >
                            {backButtonText}
                        </ButtonWidget>
                        <ButtonWidget
                            className="w-full rounded-sm bg-[#00796B] hover:bg-[#00796B]/90 text-white order-1 sm:order-2"
                            onClick={handleDone}
                        >
                            {doneButtonText}
                        </ButtonWidget>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDialog;
