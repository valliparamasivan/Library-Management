"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import FormSelect from "@/components/form/FormSelect";
import BarcodeDisplay from "./BarcodeDisplay";
import { generateBarcodeHtml, openPrintWindow } from "./generateBarcodeHtml";
import { useReprintRfid } from "@/store/hooks/InventoryHooks";
import useErrorHandler from "@/components/custom-hooks/useErrorHandler";

const ReprintDialog = ({
    isOpen,
    onOpenChange,
    currentRfid = "",
    newRfid: initialNewRfid = "",
    rfidId,
}) => {
    const router = useRouter();
    const [newRfid, setNewRfid] = useState("");
    const { control, watch, reset } = useForm({
        defaultValues: {
            reason: "",
        },
    });
    const { mutateAsync: reprintRfidApi, isPending } = useReprintRfid();
    const { showSuccessToast, showErrorToast } = useErrorHandler();

    const selectedReason = watch("reason");

    const generateNewRfid = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < 11; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    useEffect(() => {
        if (!isOpen) {
            reset();
            setNewRfid("");
        }
    }, [isOpen, reset]);

    useEffect(() => {
        if (selectedReason) {
            setNewRfid(generateNewRfid());
        }
    }, [selectedReason]);

    const handleClose = () => {
        reset();
        setNewRfid("");
        onOpenChange(false);
    };

    const handlePrint = async () => {
        if (!selectedReason) return;

        if (currentRfid) {
            openPrintWindow(generateBarcodeHtml(currentRfid), "Re-Print RFID Tag");
        }

        if (rfidId) {
            try {
                const reasonLabel = reasonOptions.find((o) => o.value === selectedReason)?.label || selectedReason;
                const response = await reprintRfidApi({ rfidId, reason: reasonLabel });
                showSuccessToast(response?.message || "RFID reprinted successfully");
                router.refresh();
            } catch (error) {
                showErrorToast(error?.data?.message || error?.message || "Failed to reprint RFID");
            }
        }

        handleClose();
    };

    const handleOpenChangeInternal = (open) => {
        if (!open) {
            handleClose();
        } else {
            onOpenChange(open);
        }
    };

    const reasonOptions = [
        { value: "damaged", label: "Damaged" },
        { value: "lost", label: "Lost" },
        { value: "replacement", label: "Replacement" },
        { value: "other", label: "Other" },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChangeInternal}>
            <DialogContent
                hideClose
                className="w-[calc(100%-2rem)] sm:max-w-xs rounded-md p-0 border-0 max-h-[90vh] overflow-hidden flex flex-col shadow-lg"
            >
                <div className="flex items-center justify-between px-6 pt-6">
                    <DialogTitle className="text-lg font-semibold text-gray-900">
                        Re-Print RFID
                    </DialogTitle>
                    <button
                        onClick={handleClose}
                        className="shrink-0 rounded-md text-[#1A1A1A] hover:text-[#42434B] focus:outline-none"
                        type="button"
                    >
                        <X className="w-5 h-5 cursor-pointer" />
                    </button>
                </div>

                <div className="px-6 overflow-y-auto flex-1 min-h-0 space-y-2">
                    {/* Current RFID Section */}
                    <div className="space-y-2">
                        <label className="text-sm text-gray-500 font-medium">
                            Current RFID
                        </label>
                        <div className="flex flex-col items-start justify-center py-2">
                            <BarcodeDisplay value={currentRfid} />
                        </div>
                    </div>

                    <div className="border-t border-[#807F94]" />

                    {/* Reason Section */}
                    <FormSelect
                        control={control}
                        name="reason"
                        label="Reason"
                        placeholder="Select Reason"
                        options={reasonOptions}
                    />
                    {selectedReason && (
                        <div className="space-y-1">
                            <label className="text-sm text-gray-500 font-medium">
                                New RFID
                            </label>
                            <div className="flex flex-col items-center justify-center py-2">
                                <BarcodeDisplay value={currentRfid} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 px-6 pb-6 pt-2">
                    <ButtonWidget
                        className="w-full sm:flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md"
                        onClick={handleClose}
                        loading={false}
                    >
                        Cancel
                    </ButtonWidget>
                    <ButtonWidget
                        className="w-full sm:flex-1 bg-[#00796B] hover:bg-[#00796B]/90 text-white rounded-md border-0"
                        onClick={handlePrint}
                        loader={isPending}
                        disabled={isPending || !selectedReason}
                    >
                        Print
                    </ButtonWidget>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ReprintDialog;
