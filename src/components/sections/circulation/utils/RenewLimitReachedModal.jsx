"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { RefreshCw, X } from "lucide-react";

const RenewLimitReachedModal = ({ isOpen, onOpenChange, userName = "", userDetailId = "" }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        hideClose
        className="w-[calc(100%-2rem)] sm:max-w-[380px] rounded-xl p-6 border-0 bg-[#1A1A1A] shadow-xl"
      >
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 text-white focus:outline-none"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex flex-col items-center text-center space-y-4 pt-2">
          <div className="w-12 h-12 rounded-full bg-[#D1FAE5] flex items-center justify-center flex-shrink-0">
            <RefreshCw className="w-6 h-6 text-[#34D399]" />
          </div>
          <div className="space-y-1">
            <p className="text-sm sm:text-base text-white">
              Renew limit Reached for
            </p>
            <p className="text-sm sm:text-base font-medium text-white">
              {userName || "—"}
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              User ID: {userDetailId || "—"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RenewLimitReachedModal;
