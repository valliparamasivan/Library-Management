"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { Loader2, Trash2, X } from "lucide-react";
import { forwardRef, Fragment, useImperativeHandle, useState } from "react";

const DeleteWidget = forwardRef(({ onConfirm, title = "Delete Item", itemType = "item", itemLabel = "ID", itemId: propItemId, itemName: propItemName, buttonTitle = "Delete", buttonClassName = "p-1 hover:bg-gray-100 rounded cursor-pointer", showText = false }, ref) => {
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
      <button className={buttonClassName} title={buttonTitle} onClick={handleButtonClick}>
        <Trash2 className={`w-4 h-4 sm:w-5 sm:h-5 ${showText ? 'text-red' : 'text-gray-400'}`} />
        {showText && <span className="text-xs sm:text-sm text-black">{buttonTitle}</span>}
      </button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{}</DialogDescription>
        <DialogContent hideClose className="w-[calc(100%-2rem)] sm:max-w-[460px] rounded-2xl p-4 sm:p-6 border-0 max-h-[90vh] overflow-y-auto">
          <div className="space-y-3 sm:space-y-4">
            {/* Close button at top right */}
            <div className="flex justify-end">
              <button onClick={handleClose} className="shrink-0 rounded-md text-[#1A1A1A] hover:text-[#42434B] focus:outline-none">
                <X className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
              </button>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#E3493533] flex items-center justify-center">
                <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#E34935]" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-base sm:text-[18px] font-semibold text-[#1A1A1A] leading-6 sm:leading-[32px] tracking-normal text-center">
                Are you Sure you want <br className="hidden sm:block" /> to Delete?
              </div>
            </div>
            <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 pt-2">
              <ButtonWidget 
                variant="outline" 
                className="w-full rounded-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 order-2 sm:order-1" 
                onClick={handleClose}
              >
                Cancel
              </ButtonWidget>
              <ButtonWidget 
                className="w-full rounded-sm bg-[#00796B] hover:bg-[#00796B]/90 text-white order-1 sm:order-2" 
                onClick={handleConfirm} 
                disabled={isPending} 
                loader={false}
              >
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
});

export default DeleteWidget;
