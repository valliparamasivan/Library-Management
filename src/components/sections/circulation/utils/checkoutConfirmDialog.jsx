"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import ArrowRight from "@/assets/icons/19.svg";
import ImageWidget from "@/components/widgets/ImageWidget";
import { X, Loader2 } from "lucide-react";

const CheckoutConfirmDialog = ({ isOpen, onOpenChange, checkoutItems = [], onConfirm, isLoading = false }) => {
  const handleClose = () => {
    if (!isLoading) onOpenChange(false);
  };

  const handleYesCheckout = () => {
    onConfirm?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="w-[calc(100%-2rem)] sm:max-w-lg rounded-2xl p-0 border-0 max-h-[90vh] overflow-hidden flex flex-col shadow-lg">
        <div className="flex justify-end px-3 sm:px-4 md:px-5 pt-3 sm:pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="shrink-0 rounded-md text-[#1A1A1A] hover:text-[#42434B] focus:outline-none"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-3 sm:px-4 md:px-5 pt-0 pb-3 sm:pb-4 flex flex-col flex-1 min-h-0 overflow-y-auto">
          <div className="flex flex-col items-center text-center mb-4">
            <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center mb-4">
              <ImageWidget src={ArrowRight} alt="Arrow Right" className="w-8 h-8 text-[#00796B]" />
            </div>
            <div className="text-md font-[500] text-[#1A1A1A] space-y-4">
              <p className="mb-3">Are you Sure you want to Check-Out</p>
              <p className="m-0">below Books?</p>
            </div>
          </div>
          <div className="space-y-3 max-h-[200px] overflow-y-auto">
            {checkoutItems.map((item) => (
              <div
                key={item.id}
                className="border border-[#E6E6E6] rounded-lg p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                    {item.title}
                    <span className="text-[#67667A] font-normal"> - {item.refId}</span>
                  </p>
                </div>
                <p className="text-sm flex-shrink-0">
                  <span className="text-[#67667A]">Due Date - </span>
                  <span className="font-semibold text-[#1A1A1A]">{item.dueDate}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#F8FAFC] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 md:px-5 pt-3 sm:pt-4 pb-3 sm:pb-4 md:pb-5 w-full border-t border-[#E2E8F0]">
          <ButtonWidget
            type="button"
            loader={false}
            onClick={handleClose}
            disabled={isLoading}
            className="h-9 sm:h-10 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-xs sm:text-sm"
          >
            Cancel
          </ButtonWidget>
          <ButtonWidget
            type="button"
            loader={false}
            onClick={handleYesCheckout}
            disabled={isLoading}
            className="h-9 sm:h-10 bg-[#00796B] hover:bg-[#00796B]/90 text-white border-0 rounded-lg text-xs sm:text-sm"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </span>
            ) : (
              "Yes, Check-Out"
            )}
          </ButtonWidget>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutConfirmDialog;
