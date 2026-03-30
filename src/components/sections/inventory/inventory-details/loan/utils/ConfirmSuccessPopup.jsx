"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { RefreshCw, Check, CalendarDays,CircleCheck } from "lucide-react";


const ConfirmSuccessPopup = ({
  isOpen,
  onOpenChange,
  mode = "confirm",
  action = "renew",
  bookTitle = "",
  oldDueDate = "",
  newDueDate = "",
  onConfirm,
  onDone,
}) => {
  const isRenew = action === "renew";
  const isConfirm = mode === "confirm";

  const handleConfirm = () => {
    onConfirm?.();
  };

  const handleDone = () => {
    onDone?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        hideClose={false}
        className="w-[calc(100%-2rem)] sm:max-w-[400px] rounded-2xl p-6 border bg-white shadow-lg"
      >
        {isConfirm ? (
          <>
            <div className="flex flex-col items-center text-center space-y-4 pt-2">
              <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-6 h-6 text-[#00796B]" />
              </div>
              <p className="text-sm sm:text-base text-gray-800">
                Are you sure you want to {isRenew ? "Renew" : "Return"}{" "}
                {isRenew ? "days for " : ""}
                <span className="font-semibold text-gray-900">
                  "{bookTitle || "this book"}"
                </span>
                {isRenew ? " Book?" : "?"}
              </p>
              <div className="flex gap-3 w-full pt-2">
                <ButtonWidget
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 h-10 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg"
                >
                  Cancel
                </ButtonWidget>
                <ButtonWidget
                  type="button"
                  onClick={handleConfirm}
                  className="flex-1 h-10 bg-[#00796B] hover:bg-[#00796B]/90 text-white border-0 rounded-lg"
                >
                  {isRenew ? "Yes, Renew" : "Yes, Return"}
                </ButtonWidget>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center text-center space-y-4 pt-2">
              <div className="w-14 h-14 rounded-full  bg-[#DCFCE7]  flex items-center justify-center flex-shrink-0">
                <CircleCheck className="w-8 h-8 text-[#00A63E]" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                {isRenew ? "Book Renewed Successfully" : "Book Returned Successfully"}
              </h3>
              {isRenew ? (
                <div className="w-full space-y-2 text-center text-sm text-gray-700">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <CalendarDays className="w-4 h-4 text-[#00796B] flex-shrink-0" />
                    <span>Old Due Date: {oldDueDate || "—"}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <CalendarDays className="w-4 h-4 text-[#00796B] flex-shrink-0" />
                    <span>
                      New Due Date: <span className="font-semibold text-[#00A63E] text-sm">{newDueDate || "—"}</span>
                    </span>
                    <CircleCheck className="w-4 h-4 text-[#00796B] flex-shrink-0" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-sm text-[#00A63E] font-medium">
                  <span className="w-5 h-5 rounded-full bg-[#00A63E] flex items-center justify-center flex-shrink-0 p-0.5">
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </span>
                  Return on Time
                </div>
              )}
              <ButtonWidget
                type="button"
                onClick={handleDone}
                className="w-full h-10 bg-[#00796B] hover:bg-[#00796B]/90 text-white border-0 rounded-lg"
              >
                Done
              </ButtonWidget>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmSuccessPopup;
