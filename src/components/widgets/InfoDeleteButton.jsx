"use client";

import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { Loader2, Trash2, X } from "lucide-react";
import { forwardRef, Fragment, useImperativeHandle, useState } from "react";

const InfoDeleteButton = forwardRef(
  (
    { onConfirm, title = "Delete Item", itemType = "item", itemLabel = "ID", itemId: propItemId, label = "Delete", className = "", isDestructive = true, isPrimary = false },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [currentItemId, setCurrentItemId] = useState(null);
    const [isPending, setIsPending] = useState(false);

    const handleOpen = (id) => {
      setCurrentItemId(id);
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
      setCurrentItemId(null);
      setIsPending(false);
    };

    const handleConfirm = async () => {
      if (!onConfirm || !currentItemId) return;

      setIsPending(true);
      try {
        await onConfirm(currentItemId);
        handleClose();
      } catch (error) {
      } finally {
        setIsPending(false);
      }
    };

    const handleButtonClick = () => {
      handleOpen(propItemId);
    };

    useImperativeHandle(ref, () => ({
      openDialog: handleOpen,
    }));

    return (
      <Fragment>
        <ButtonWidget
          variant="ghost"
          size="sm"
          onClick={handleButtonClick}
          className={`flex w-full items-center gap-2 justify-start h-8 px-2 rounded-lg border transition-all duration-200 ${
            isDestructive
              ? "text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 hover:border-red-300"
              : isPrimary
                ? "text-gray-900 bg-linear-to-r from-[#D5F498] to-[#87DAC9] hover:from-[#A8D895] hover:to-[#7FC8A8] border-0"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-gray-200 hover:border-gray-300"
          } ${className}`}
        >
          <Trash2 className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium truncate">{label}</span>
        </ButtonWidget>

        <Dialog open={open} onOpenChange={handleClose}>
          <DialogDescription className="sr-only">{}</DialogDescription>
          <DialogContent hideClose className="sm:max-w-[300px] rounded-2xl p-6 border-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-[18px] font-weight-600 text-[#42434B]">{title}</h1>
                <button onClick={handleClose} className="shrink-0 rounded-md text-[#1A1A1A] hover:text-[#42434B] focus:outline-none">
                  <X className="w-4 h-4 cursor-pointer" />
                </button>
              </div>

              <div className="flex items-center justify-center pt-1">
                <Trash2 className="w-10 h-10 text-red-600" />
              </div>
              {currentItemId && (
                <p className="text-black text-center mb-2 text-md font-normal tracking-[0.5px]">
                  <span className="text-[#929292] text-sm font-normal">{itemLabel}:</span> {currentItemId || "—"}
                </p>
              )}

              <div className="text-center space-y-1">
                <div className="text-[16px] font-medium text-[#2F2F2F]">Are you sure</div>
                <div className="text-[16px] text-[#2F2F2F]">you want to delete this {itemType}?</div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <ButtonWidget className="rounded-[12px] w-full bg-gray-100 hover:bg-gray-200 text-gray-700" onClick={handleClose}>
                  Cancel
                </ButtonWidget>
                <ButtonWidget className="rounded-[12px] w-full bg-red-500 hover:bg-red-600" onClick={handleConfirm} disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Yes, Delete"
                  )}
                </ButtonWidget>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  },
);

export default InfoDeleteButton;
