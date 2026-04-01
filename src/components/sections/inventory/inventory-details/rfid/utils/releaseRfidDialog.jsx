"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import ImageWidget from "@/components/widgets/ImageWidget";
import alertIcon from '@/assets/icons/18.svg';
import { useReleaseRfid } from "@/store/hooks/InventoryHooks";
import useErrorHandler from "@/components/custom-hooks/useErrorHandler";

const ReleaseRfidDialog = ({ isOpen, onOpenChange, id, rfidData, bookTitle = "" }) => {
    const router = useRouter();
    const { mutateAsync: releaseRfidApi, isPending } = useReleaseRfid();
    const { showSuccessToast, showErrorToast } = useErrorHandler();

    const handleClose = () => {
        onOpenChange(false);
    };

    const handleConfirm = async () => {
        if (!id) return;
        try {
            const response = await releaseRfidApi(id);
            showSuccessToast(response?.message || "RFID released successfully");
            handleClose();
            router.refresh();
        } catch (error) {
            showErrorToast(error?.data?.message || error?.message || "Failed to release RFID");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent hideClose className="w-[calc(100%-2rem)] sm:max-w-[400px] rounded-2xl p-0 border-0 max-h-[90vh] overflow-hidden flex flex-col shadow-lg">
                <div className="flex items-center justify-between px-6 pt-6">
                    <DialogTitle className="text-lg font-semibold text-gray-900">Release RFID</DialogTitle>
                    <button
                        onClick={handleClose}
                        className="shrink-0 rounded-md text-[#1A1A1A] hover:text-[#42434B] focus:outline-none"
                        type="button"
                    >
                        <X className="w-5 h-5 cursor-pointer" />
                    </button>
                </div>

                <div className="px-6 overflow-y-auto flex-1 min-h-0">
                    <div className="flex flex-col items-center space-y-3 py-2">
                        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                           <ImageWidget src={alertIcon} alt="Alert" className="w-8 h-8" />
                        </div>

                        <div className="text-center space-y-2">
                            <p className="text-sm text-gray-700">
                                Are you Sure you want to Release
                            </p>
                            {rfidData?.rfidTagId && (
                                <p className="text-base font-semibold">
                                    RFID - <span className="text-[#00796B]">{rfidData.rfidTagId}</span>
                                </p>
                            )}
                            <p className="text-sm text-gray-700">
                                for "<span className="text-[#00796B] font-medium">{bookTitle}</span>" Book?
                            </p>
                        </div>
                    </div>
                </div>

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
                        onClick={handleConfirm}
                        loader={isPending}
                        disabled={isPending}
                    >
                        Yes, Release
                    </ButtonWidget>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ReleaseRfidDialog;
