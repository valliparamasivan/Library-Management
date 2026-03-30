"use client";

import FormSelect from "@/components/form/FormSelect";
import FormWrapper from "@/components/form/FormWrapper";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { Barcode, X } from "lucide-react";
import { useForm } from "react-hook-form";

const ScannedTagDialog = ({ isOpen, onOpenChange, onConfirm }) => {
    const { control, handleSubmit, reset, watch } = useForm({
        defaultValues: {
            rfidId: "",
        },
    });

    const handleClose = () => {
        reset();
        onOpenChange(false);
    };

    const onSubmit = () => {
        onConfirm();
        handleClose();
    };

    const handleOpenChangeInternal = (open) => {
        if (!open) {
            reset();
        }
        onOpenChange(open);
    };

    const rfidOptions = [
        { value: "1", label: "RFID 1" },
        { value: "2", label: "RFID 2" },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChangeInternal}>
            <DialogContent hideClose className="w-[calc(100%-2rem)] sm:max-w-[400px] rounded-2xl p-4 sm:p-6 border-0 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Barcode className="w-4 h-4 sm:w-5 sm:h-5 text-[#00796B]" />
                        <DialogTitle className="text-base sm:text-lg font-semibold text-gray-900">Scanned Tag</DialogTitle>
                    </div>
                    <button
                        onClick={handleClose}
                        className="shrink-0 rounded-md text-[#1A1A1A] hover:text-[#42434B] focus:outline-none"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
                    </button>
                </div>
                    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4 mt-4 sm:mt-6">
                            <FormSelect
                                control={control}
                                name="rfidId"
                                label="Select RFID"
                                placeholder="Select RFID"
                                options={rfidOptions}
                            />
                        </div>

                        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 pt-4">
                            <ButtonWidget
                                type="button"
                                className="w-full bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-sm order-2 sm:order-1"
                                onClick={handleClose}
                            >
                                Cancel
                            </ButtonWidget>
                            <ButtonWidget
                                type="submit"
                                className="w-full bg-[#00796B] hover:bg-[#00796B]/90 text-white rounded-sm order-1 sm:order-2"
                            >
                                Assign RFID
                            </ButtonWidget>
                        </div>
                    </FormWrapper>
            </DialogContent>
        </Dialog>
    );
};

export default ScannedTagDialog;

