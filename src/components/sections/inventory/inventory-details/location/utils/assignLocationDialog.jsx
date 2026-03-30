"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FormSelect from '@/components/form/FormSelect';
import FormWrapper from '@/components/form/FormWrapper';
import ButtonWidget from '@/components/widgets/ButtonWidget';
import { AssignLocationSchema } from '@/helpers/ValidationHelpers';
import { useShelfDropdown, useRowDropdown, useAssignLocation, useEditLocation } from '@/store/hooks/InventoryHooks';
import useErrorHandler from '@/components/custom-hooks/useErrorHandler';

const toFormIdString = (value) =>
    value != null && value !== '' ? String(value) : '';

const AssignLocationDialog = ({ isOpen, onOpenChange, id, sectionDropdown, shelfDropdown, rowDropdown }) => {
    const router = useRouter();
    const isEditMode = id && id.sectionName && id.sectionName !== "-" && id.locationName && id.locationName !== "-";
    const bookCopyId = id?.bookCopyId || id;
    
    const { control, handleSubmit, reset, watch, setValue, setError } = useForm({
        resolver: zodResolver(AssignLocationSchema),
        defaultValues: {
            sectionId: '',
            shelfId: '',
            rowId: '',
        },
    });

    const selectedSectionId = watch("sectionId");
    const { data: shelfDropdownData, isLoading: isShelfLoading } = useShelfDropdown(
        selectedSectionId ? parseInt(selectedSectionId, 10) : null
    );

    const selectedShelfId = watch("shelfId");
    const { data: rowDropdownData, isLoading: isRowLoading } = useRowDropdown(
        selectedShelfId ? parseInt(selectedShelfId, 10) : null
    );

    const { mutateAsync: assignLocation, isPending: isAssignPending } = useAssignLocation();
    const { mutateAsync: editLocation, isPending: isEditPending } = useEditLocation();
    const { showSuccessToast, setFieldError } = useErrorHandler(setError);

    const isPending = isAssignPending || isEditPending;

    const prevSectionIdRef = useRef(undefined);
    const prevShelfIdRef = useRef(undefined);

    useEffect(() => {
        if (!isOpen) {
            prevSectionIdRef.current = undefined;
            prevShelfIdRef.current = undefined;
        }
    }, [isOpen]);

    // Only clear child fields when the user changes section/shelf — not on initial edit prefill.
    useEffect(() => {
        if (!isOpen) return;
        if (!selectedSectionId) {
            prevSectionIdRef.current = undefined;
            return;
        }
        const prev = prevSectionIdRef.current;
        if (prev !== undefined && prev !== selectedSectionId) {
            setValue("shelfId", "");
            setValue("rowId", "");
        }
        prevSectionIdRef.current = selectedSectionId;
    }, [isOpen, selectedSectionId, setValue]);

    useEffect(() => {
        if (!isOpen) return;
        if (!selectedShelfId) {
            prevShelfIdRef.current = undefined;
            return;
        }
        const prev = prevShelfIdRef.current;
        if (prev !== undefined && prev !== selectedShelfId) {
            setValue("rowId", "");
        }
        prevShelfIdRef.current = selectedShelfId;
    }, [isOpen, selectedShelfId, setValue]);

    const sectionOptions = sectionDropdown?.data?.map((item) => ({
        value: String(item.id),
        label: item.name,
    })) || [];

    const shelfOptions = shelfDropdownData?.data?.map((item) => ({
        value: String(item.id),
        label: item.name,
    })) || (!shelfDropdown?.error && shelfDropdown?.data?.map((item) => ({
        value: String(item.id),
        label: item.name,
    }))) || [];

    const rowOptions = rowDropdownData?.data?.map((item) => ({
        value: String(item.id),
        label: item.name,
    })) || (!rowDropdown?.error && rowDropdown?.data?.map((item) => ({
        value: String(item.id),
        label: item.name,
    }))) || [];
        
    useEffect(() => {
        if (!isOpen) return;
        if (isEditMode && id && typeof id === 'object') {
            const sectionVal = toFormIdString(id.sectionId ?? id.locationId);
            reset({
                sectionId: sectionVal,
                shelfId: toFormIdString(id.shelfId),
                rowId: toFormIdString(id.rowId),
            });
        } else {
            reset({
                sectionId: '',
                shelfId: '',
                rowId: '',
            });
        }
    }, [isOpen, isEditMode, id, reset]);

    const onSubmit = async (data) => {
        try {
            const payload = {
                bookCopyId: typeof bookCopyId === 'object' ? bookCopyId.bookCopyId : bookCopyId,
                locationId: parseInt(data.sectionId, 10),
                shelfId: parseInt(data.shelfId, 10),
                rowId: parseInt(data.rowId, 10),
            };

            const response = isEditMode
                ? await editLocation(payload)
                : await assignLocation(payload);

            showSuccessToast(response.message);
            handleCancel();
            router.refresh();
        } catch (error) {
            setFieldError(error);
        }
    };

    const handleCancel = () => {
        reset();
        onOpenChange(false);
    };

    const handleOpenChangeInternal = (open) => {
        onOpenChange(open);
        if (!open) {
            reset();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChangeInternal}>
            <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle className="text-base sm:text-lg font-semibold text-gray-900">
                        {isEditMode ? "Edit Location" : "Assign Location"}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Assign Location
                    </DialogDescription>
                </DialogHeader>
                <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
                        <FormSelect 
                            control={control} 
                            name="sectionId" 
                            label="Section" 
                            placeholder="Select Section" 
                            options={sectionOptions} 
                            required 
                        />
                        <FormSelect 
                            control={control} 
                            name="shelfId" 
                            label="Shelf" 
                            placeholder={selectedSectionId ? (isShelfLoading ? "Loading..." : "Select Shelf") : "Select Section first"} 
                            options={shelfOptions} 
                            required 
                            disabled={!selectedSectionId || isShelfLoading}
                        />
                        <FormSelect 
                            control={control} 
                            name="rowId" 
                            label="Row" 
                            placeholder={selectedShelfId ? (isRowLoading ? "Loading..." : "Select Row") : "Select Shelf first"} 
                            options={rowOptions} 
                            required 
                            disabled={!selectedShelfId || isRowLoading}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
                        <ButtonWidget 
                            type="button" 
                            onClick={handleCancel} 
                            className="w-full sm:w-auto h-10 px-6 rounded-sm bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 order-2 sm:order-1"
                        >
                            Cancel
                        </ButtonWidget>
                        <ButtonWidget 
                            type="submit" 
                            disabled={isPending}
                            loading={isPending}
                            className="w-full sm:w-auto h-10 px-6 rounded-sm bg-[#00796B] hover:bg-[#00796B]/90 text-white border-0 order-1 sm:order-2"
                        >
                            {isPending ? "Saving..." : "Save"}
                        </ButtonWidget>
                    </div>
                </FormWrapper>
            </DialogContent>
        </Dialog>
    );
};

export default AssignLocationDialog;

