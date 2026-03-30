"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { X } from "lucide-react";
import ImageWidget from "@/components/widgets/ImageWidget";
import actionIcon from "@/assets/icons/19.svg";

const CheckInDialog = ({ isOpen, onOpenChange, item, onConfirm, loading = false }) => {
  const handleClose = () => {
    if (loading) return;
    onOpenChange(false);
  };

  const handleYesTransfer = () => {
    onConfirm?.();
  };

  if (!item) return null;

  const isOverdue = item.status === "overdue";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="w-[calc(100%-2rem)] sm:max-w-lg rounded-2xl p-0 border-0 max-h-[90vh] overflow-hidden flex flex-col shadow-lg">
        <div className="flex items-center justify-center relative px-3 sm:px-4 md:px-5 pt-3 sm:pt-4">
          <div className="w-9 h-9 rounded-full bg-[#ECFDF5] flex items-center justify-center">
            <ImageWidget src={actionIcon} alt="Transfer" className="w-4 h-4" />
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-3 sm:right-4 md:right-5 shrink-0 rounded-md text-[#1A1A1A] hover:text-[#42434B] focus:outline-none"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-3 sm:px-4 md:px-5 pt-0 pb-0 flex flex-col">
          <div className="flex flex-col items-center text-center mb-2">
            <div className="text-md font-[500] text-[#1A1A1A] space-y-1">
              <p className="mb-1">Are you Sure you want to Check In</p>
              <p className="m-0">the Book?</p>
            </div>
          </div>
          <div className="border border-[#E6E6E6] rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white -mb-2 sm:-mb-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                {item.title}
                <span className="text-[#67667A] font-normal"> - {item.refId}</span>
              </p>
            </div>
            <div className="flex-shrink-0">
              <span
                className={`inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium ${
                  isOverdue ? "bg-red-100 text-red-500" : "bg-[#DCFCE7] text-[#00A63E]"
                }`}
              >
                {isOverdue ? `${item.overdueDays ?? 0} Days - Overdue` : "On-Time"}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-[#F8FAFC] flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-5 pt-3 sm:pt-4 pb-3 sm:pb-4 md:pb-5 w-full">
          <ButtonWidget
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="flex-1 h-9 sm:h-10 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-xs sm:text-sm"
          >
            Cancel
          </ButtonWidget>
          <ButtonWidget
            type="button"
            onClick={handleYesTransfer}
            disabled={loading}
            loader={loading}
            className="flex-1 h-9 sm:h-10 bg-[#00796B] hover:bg-[#00796B]/90 text-white border-0 rounded-lg text-xs sm:text-sm"
          >
            Yes, Check-In
          </ButtonWidget>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckInDialog;
