"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { CircleCheck, X } from "lucide-react";
import { format, addDays, parse } from "date-fns";

const RenewSuccessDialog = ({ isOpen, onOpenChange, item }) => {
  const handleDone = () => onOpenChange(false);

  if (!item) return null;

  // Calculate new due date (add 30 days to current due date)
  const getNewDueDate = () => {
    try {
      const currentDueDate = parse(item.dueDate, "dd-MM-yyyy", new Date());
      const newDueDate = addDays(currentDueDate, 30);
      return format(newDueDate, "MM-dd-yyyy");
    } catch {
      // Fallback if date parsing fails
      return "02-26-2025";
    }
  };

  const newDueDate = getNewDueDate();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="w-[calc(100%-2rem)] sm:max-w-lg rounded-xl p-0 border-0 max-h-[90vh] overflow-hidden flex flex-col shadow-lg">
        <div className="flex items-center justify-center relative px-3 sm:px-4 md:px-5 pt-3 sm:pt-4">
          <div className="w-9 h-9 rounded-full bg-[#DCFCE7] flex items-center justify-center">
            <CircleCheck className="w-5 h-5 text-[#00A63E]" strokeWidth={1.5} />
          </div>
          <button
            type="button"
            onClick={handleDone}
            className="absolute right-3 sm:right-4 md:right-5 shrink-0 rounded-md text-[#1A1A1A] hover:text-[#42434B] focus:outline-none"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-3 sm:px-4 md:px-5 pt-0 pb-0 flex flex-col">
          <div className="flex flex-col items-center text-center mb-2">
            <div className="space-y-1">
              <p className="text-lg font-medium text-[#1A1A1A] mb-1">1 Book Due date Renewed</p>
              <p className="text-lg font-medium text-[#1A1A1A] m-0">Successfully</p>
            </div>
          </div>
          <div className="border border-[#E6E6E6] rounded-md p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 -mb-2 sm:-mb-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                {item.title}
                <span className="text-[#67667A] font-normal"> - {item.refId}</span>
              </p>
            </div>
            <div className="flex-shrink-0">
              <p className="text-sm text-[#67667A] font-normal whitespace-nowrap">
                New Due Date<span className="text-[#1A1A1A] font-semibold ml-1">- {newDueDate}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#F8FAFC] flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-4 pt-3 sm:pt-4 pb-3 sm:pb-4 md:pb-5 w-full">
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

export default RenewSuccessDialog;
