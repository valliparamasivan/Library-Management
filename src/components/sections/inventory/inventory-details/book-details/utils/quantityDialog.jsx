"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useErrorHandler from "@/components/custom-hooks/useErrorHandler";
import { useBookAddQuantity } from "@/store/hooks/InventoryHooks";

const QuantityDialog = ({ isOpen, onOpenChange, bookId }) => {
    const router = useRouter();
    const [bookCount, setBookCount] = useState(1);
    const { mutateAsync: addQuantity, isPending } = useBookAddQuantity();
    const { showSuccessToast, showErrorToast } = useErrorHandler();

    const handleOpenChangeInternal = (open) => {
        onOpenChange(open);
        if (!open) {
            setBookCount(1);
        }
    };

    const handleIncrement = () => {
        setBookCount(bookCount + 1);
    };

    const handleDecrement = () => {
        if (bookCount > 1) {
            setBookCount(bookCount - 1);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (value === "") {
            setBookCount("");
            return;
        }
        // Remove any non-numeric characters
        const numericValue = value.replace(/[^0-9]/g, "");
        if (numericValue === "") {
            setBookCount("");
            return;
        }
        const numValue = parseInt(numericValue, 10);
        if (!isNaN(numValue) && numValue > 0) {
            setBookCount(numValue);
        }
    };

    const handleInputBlur = () => {
        if (bookCount === "" || bookCount < 1) {
            setBookCount(1);
        }
    };

    const handleKeyDown = (e) => {
        // Allow: backspace, delete, tab, escape, enter, and decimal point
        if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    };

    const handleSubmit = async () => {
        if (!bookId) {
            showErrorToast("Book ID is required");
            return;
        }

        if (bookCount < 1) {
            showErrorToast("Quantity must be at least 1");
            return;
        }

        try {
            const payload = {
                bookId: Number(bookId),
                addQuantity: Number(bookCount),
            };
            
            const response = await addQuantity(payload);
            showSuccessToast(response.message);
            handleOpenChangeInternal(false);
            router.refresh();
        } catch (error) {
            showErrorToast(error?.data?.message);
        }
    };

    const handleCancel = () => {
        setBookCount(1);
        handleOpenChangeInternal(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChangeInternal}>
            <DialogContent hideClose className="w-[calc(100%-2rem)] sm:max-w-[400px] rounded-2xl p-4 sm:p-6 border-0 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                    <DialogTitle className="text-base sm:text-lg font-semibold text-gray-900">Add Quantity</DialogTitle>
                    <button
                        onClick={handleCancel}
                        className="shrink-0 rounded-md text-[#1A1A1A] hover:text-[#42434B] focus:outline-none"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
                    </button>
                </div>

                <div className="space-y-4 mt-4 sm:mt-6">
                    <div className="flex flex-col">
                        <Label className="mb-2 text-sm font-medium text-gray-700">Book Count</Label>
                        <div className="flex items-center border border-[#D9D9D9] rounded-sm bg-white h-12 sm:h-[44px]">
                            <button
                                type="button"
                                onClick={handleDecrement}
                                className="flex items-center justify-center w-12 sm:w-12 h-full border-r border-[#D9D9D9] hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer rounded-l-sm touch-manipulation"
                            >
                                <Minus className="w-4 h-4 sm:w-4 sm:h-4 text-gray-600" />
                            </button>
                            <div className="flex-1 flex items-center justify-center h-full">
                                <input
                                    type="number"
                                    value={bookCount}
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    onKeyDown={handleKeyDown}
                                    min="1"
                                    placeholder="Count"
                                    className="w-full text-center bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 text-base sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleIncrement}
                                className="flex items-center justify-center w-12 sm:w-12 h-full border-l border-[#D9D9D9] hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer rounded-r-sm touch-manipulation"
                            >
                                <Plus className="w-4 h-4 sm:w-4 sm:h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-4 sm:pt-6">
                    <ButtonWidget
                        type="button"
                        onClick={handleCancel}
                        variant="outline"
                        className="w-full sm:w-auto h-10 sm:h-10 px-6 sm:px-14 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-sm order-2 sm:order-1"
                    >
                        Cancel
                    </ButtonWidget>
                    <ButtonWidget
                        type="button"
                        onClick={handleSubmit}
                        disabled={isPending}
                        loading={isPending}
                        className="w-full sm:w-auto text-white font-bold h-10 sm:h-10 px-6 sm:px-14 rounded-sm shadow-md border-0 bg-[#00796B] hover:bg-[#00796B]/90 order-1 sm:order-2"
                    >
                        {isPending ? "Saving..." : "Save"}
                    </ButtonWidget>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default QuantityDialog;

