"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { X, ArrowRight } from "lucide-react";

const LoginToReserveDialog = ({
    isOpen = false,
    onOpenChange,
    onCancel,
    onLogin,
    title = "Login to Reserve Book",
    cancelButtonText = "Cancel",
    loginButtonText = "Login"
}) => {
    const handleClose = () => {
        if (onOpenChange) {
            onOpenChange(false);
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        handleClose();
    };

    const handleLogin = () => {
        if (onLogin) {
            onLogin();
        }
        handleClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogTitle className="sr-only">{title}</DialogTitle>
            <DialogDescription className="sr-only">Please login to reserve this book</DialogDescription>
            <DialogContent hideClose className="w-[calc(100%-2rem)] sm:max-w-[460px] rounded-2xl p-4 sm:p-6 border-0 max-h-[90vh] overflow-y-auto">
                <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                        </div>
                        <DialogTitle className="text-lg sm:text-xl font-semibold text-[#1A1A1A] leading-tight flex-1">
                            {title}
                        </DialogTitle>
                        <button
                            onClick={handleClose}
                            className="shrink-0 rounded-md text-[#1A1A1A] hover:text-[#42434B] focus:outline-none"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
                        </button>
                    </div>

                    <div className="flex flex-row gap-3 pt-2">
                        <ButtonWidget
                            variant="outline"
                            className="rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 sm:py-3 px-4 sm:px-6"
                            onClick={handleCancel}
                        >
                            {cancelButtonText}
                        </ButtonWidget>
                        <ButtonWidget
                            className="rounded-lg bg-[#0B63CE] hover:bg-[#1565C0] text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6"
                            onClick={handleLogin}
                        >
                            {loginButtonText}
                        </ButtonWidget>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LoginToReserveDialog;
