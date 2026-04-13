"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { AlertCircle, X } from "lucide-react";

const PAYMENT_METHODS = [
  { value: "Cash", label: "Cash" },
  { value: "Card", label: "Card" },
  { value: "UPI", label: "UPI" },
  { value: "Bank Transfer", label: "Bank Transfer" },
];

const FineConfirmDialog = ({ isOpen, onOpenChange, item, onConfirm, onWaive, loading = false }) => {
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [showWaive, setShowWaive] = useState(false);
  const [waiveReason, setWaiveReason] = useState("");
  const [waiveError, setWaiveError] = useState("");

  const handleClose = () => {
    if (loading) return;
    setShowWaive(false);
    setWaiveReason("");
    setWaiveError("");
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm?.(paymentMethod);
  };

  const handleWaiveSubmit = () => {
    if (!waiveReason.trim()) {
      setWaiveError("Reason is required");
      return;
    }
    setWaiveError("");
    onWaive?.(waiveReason.trim());
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent hideClose className="w-[calc(100%-2rem)] sm:max-w-md rounded-2xl p-0 border-0 max-h-[90vh] overflow-hidden flex flex-col shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-center relative px-4 pt-4">
          <div className="w-10 h-10 rounded-full bg-[#FFF7ED] flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-[#F97316]" />
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 shrink-0 rounded-md text-[#1A1A1A] hover:text-[#42434B] focus:outline-none"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pt-1 pb-0 flex flex-col">
          <div className="flex flex-col items-center text-center mb-3">
            <p className="text-base font-medium text-[#1A1A1A]">This book is overdue</p>
            <p className="text-sm text-gray-500 mt-1">
              {showWaive ? "Provide a reason to waive the fine" : "Fine payment is required to check in"}
            </p>
          </div>

          {/* Book Info */}
          <div className="border border-[#E6E6E6] rounded-lg p-3 bg-white mb-3">
            <p className="text-sm font-semibold text-[#1A1A1A] truncate">
              {item.title}
              <span className="text-[#67667A] font-normal"> - {item.refId}</span>
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium bg-red-100 text-red-500">
                {item.overdueDays ?? 0} Days Overdue
              </span>
            </div>
          </div>

          {/* Fine Amount */}
          <div className={`${showWaive ? "bg-gray-50 border-gray-200" : "bg-red-50 border-red-200"} border rounded-lg p-3 mb-3`}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Fine Amount</span>
              <span className={`text-lg font-bold ${showWaive ? "text-gray-400 line-through" : "text-red-600"}`}>
                {Number(item.fineAmount || 0).toFixed(2)}
              </span>
            </div>
          </div>

          {showWaive ? (
            /* Waive Reason */
            <div className="mb-1">
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Reason for Waiving <span className="text-red-500">*</span>
              </label>
              <textarea
                value={waiveReason}
                onChange={(e) => { setWaiveReason(e.target.value); setWaiveError(""); }}
                placeholder="Enter reason for waiving the fine"
                rows={3}
                className={`w-full px-3 py-2 text-sm border rounded-md bg-white focus:outline-none focus:border-[#00796B] resize-none ${waiveError ? "border-red-400" : "border-gray-300"}`}
              />
              {waiveError && <p className="text-xs text-red-500 mt-1">{waiveError}</p>}
            </div>
          ) : (
            /* Payment Method */
            <div className="mb-1">
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full h-9 px-3 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:border-[#00796B]"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-[#F8FAFC] flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 px-4 pt-3 pb-4 w-full">
          {showWaive ? (
            <>
              <ButtonWidget
                type="button"
                onClick={() => { setShowWaive(false); setWaiveReason(""); setWaiveError(""); }}
                disabled={loading}
                className="flex-1 h-9 sm:h-10 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-xs sm:text-sm"
              >
                Back
              </ButtonWidget>
              <ButtonWidget
                type="button"
                onClick={handleWaiveSubmit}
                disabled={loading}
                loader={loading}
                className="flex-1 h-9 sm:h-10 bg-[#F97316] hover:bg-[#F97316]/90 text-white border-0 rounded-lg text-xs sm:text-sm"
              >
                Waive & Check-In
              </ButtonWidget>
            </>
          ) : (
            <>
              <ButtonWidget
                type="button"
                onClick={() => setShowWaive(true)}
                disabled={loading}
                className="flex-1 h-9 sm:h-10 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-xs sm:text-sm"
              >
                Waive
              </ButtonWidget>
              <ButtonWidget
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                loader={loading}
                className="flex-1 h-9 sm:h-10 bg-[#00796B] hover:bg-[#00796B]/90 text-white border-0 rounded-lg text-xs sm:text-sm"
              >
                Collect & Check-In
              </ButtonWidget>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FineConfirmDialog;
