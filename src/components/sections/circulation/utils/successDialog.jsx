"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { CircleCheck, X } from "lucide-react";

const SuccessDialog = ({ isOpen, onOpenChange, items = [], successMessage = "Checked-Out Successfully" }) => {
  const count = items.length;
  const handleDone = () => onOpenChange(false);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="w-[calc(100%-2rem)] sm:max-w-lg rounded-xl p-0 border-0 max-h-[90vh] overflow-hidden flex flex-col shadow-lg">
        <div className="flex justify-end px-3 sm:px-4 md:px-5 pt-3 sm:pt-4">
          <button
            type="button"
            onClick={handleDone}
            className="shrink-0 rounded-md text-[#1A1A1A] hover:text-[#42434B] focus:outline-none"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-3 sm:px-4 md:px-5 pt-0 pb-3 sm:pb-4 flex flex-col flex-1 min-h-0 overflow-y-auto">
          <div className="flex flex-col items-center text-center mb-4">
            <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center mb-4">
              <CircleCheck className="w-10 h-10 text-[#00A63E]" strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-[#1A1A1A] mb-2">
                {count} Book{count !== 1 ? "s" : ""}
              </p>
              <p className="text-base font-semibold text-[#1A1A1A] m-0">
                {successMessage}
              </p>
            </div>
          </div>
          <div className="space-y-3 max-h-[200px] overflow-y-auto">
            {items.map((item, index) => (
              <div
                key={item.refId ?? index}
                className="border border-[#E6E6E6] rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                    {item.title}
                    <span className="text-[#67667A] font-normal"> - {item.refId}</span>
                  </p>
                </div>
                <p className="text-sm flex-shrink-0">
                  <span className="text-[#1A1A1A]">Due Date - </span>
                  <span className="font-semibold text-[#1A1A1A]">{item.dueDate}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#F8FAFC] flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-5 pt-3 sm:pt-4 pb-3 sm:pb-4 md:pb-5 w-full border-t border-[#E2E8F0]">
          <ButtonWidget
            type="button"
            onClick={handleDone}
            className="h-9 sm:h-10 bg-[#00796B] hover:bg-[#00796B]/90 text-white border-0 rounded-lg text-xs sm:text-sm px-10"
          >
            Done
          </ButtonWidget>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
