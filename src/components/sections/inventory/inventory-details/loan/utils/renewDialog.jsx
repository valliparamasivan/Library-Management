"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import ImageWidget from "@/components/widgets/ImageWidget";
import { RefreshCw, Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import user from '@/assets/image/user.png';
import book from '@/assets/image/book.png';
import ConfirmSuccessPopup from "./ConfirmSuccessPopup";

const defaultDisplay = {
  bookTitle: "The Time Traveler",
  author: "Mark Smith",
  publishedYear: "2021",
  rfidTag: "A1B2C3D4E5",
  issueDate: "05/11/2025",
  dueDate: "25/11/2025",
  statusLabel: "12 Days left",
  fullName: "Mark Smith",
  userDetailId: "U00014858",
  emailId: "marksmith@gmail.com",
  phoneNumber: "856 856 8569",
  policy: "Student Policy",
};

const RenewDialog = ({ isOpen, onOpenChange, bookData }) => {
  const data = { ...defaultDisplay, ...bookData };
  const statusText = data.daysLeft != null
    ? `${data.daysLeft} Days left`
    : data.loanStatus || data.statusLabel;
  const [remarks, setRemarks] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState(3);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMode, setPopupMode] = useState("confirm");
  const [successNewDueDate, setSuccessNewDueDate] = useState("");

  const parseDueDate = (d) => {
    if (!d) return null;
    if (typeof d === "string" && d.includes("/")) {
      const [day, month, year] = d.split("/").map(Number);
      if (year && month && day) return new Date(year, month - 1, day);
    }
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const handleCancel = () => {
    setRemarks("");
    setSelectedPeriod(3);
    setPopupOpen(false);
    onOpenChange(false);
  };

  const handleRenewClick = () => {
    setPopupMode("confirm");
    setPopupOpen(true);
  };

  const handlePopupConfirm = () => {
    const currentDue = parseDueDate(data.dueDate);
    const newDue = currentDue && selectedPeriod ? addDays(currentDue, selectedPeriod) : null;
    setSuccessNewDueDate(newDue ? format(newDue, "dd/MM/yyyy") : "");
    setPopupMode("success");
    setPopupOpen(true);
    console.log("Renewing book:", { remarks, selectedPeriod });
  };

  const handlePopupDone = () => {
    setRemarks("");
    setSelectedPeriod(3);
    setPopupOpen(false);
    onOpenChange(false);
  };

  const handlePeriodSelect = (days) => {
    setSelectedPeriod(days);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[95vw] md:max-w-3xl max-h-[95vh] overflow-y-auto p-4 sm:p-4">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-base sm:text-lg font-semibold text-gray-900">Renew Book</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4 sm:mt-2">
          {/* Book Details Card - 3 sections like return dialog */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4 sm:p-6 bg-white items-start">
            <div className="flex items-start gap-3 min-w-0">
              <ImageWidget
                src={book}
                alt={data.bookTitle}
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg flex-shrink-0 object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-gray-900 mb-0.5">{data.bookTitle}</h3>
                <p className="text-sm font-normal text-[#67667A]">by {data.author} - {data.publishedYear}</p>
                <p className="text-sm font-medium text-gray-800 mt-1">{data.rfidTag}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1 min-w-0 sm:pl-9 sm:ml-2">
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-[#00796B] flex-shrink-0" />
                <span className="text-sm font-medium text-[#1A1A1A]">Timeline</span>
              </div>
              <p className="text-sm text-gray-700">Issued - <span className="font-semibold text-gray-600">{data.issueDate}</span></p>
              <p className="text-sm text-gray-700">Due Date - <span className="font-semibold text-gray-600">{data.dueDate}</span></p>
            </div>
            <div className="flex flex-col justify-start items-start min-w-0 sm:pl-10">
              <span className="inline-flex w-fit px-3 py-1.5 rounded-sm bg-green-100 text-green-800 text-sm font-semibold">
                Status - {statusText}
              </span>
            </div>
          </div>

          {/* User Details Card - policy next to user details like return dialog */}
          <div className="flex flex-row items-start gap-4 sm:gap-4 border border-gray-200 rounded-lg p-4 sm:p-6 bg-white">
            <ImageWidget
              src={user}
              alt={data.fullName}
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-lg flex-shrink-0 object-cover"
            />
            <div className="flex-1 min-w-0 flex flex-row items-start gap-14 sm:gap-20 flex-wrap">
              <div className="flex flex-col gap-1 min-w-0 shrink-0">
                <h3 className="text-base font-medium text-gray-900">
                  {data.fullName} - <span className="text-sm font-medium text-[#67667A]">{data.userDetailId}</span>
                </h3>
                <p className="text-sm text-gray-600">
                  Email ID: <span className="font-medium text-gray-900">{data.emailId}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Phone No: <span className="font-medium text-gray-900">{data.phoneNumber}</span>
                </p>
              </div>
              <div className="flex-shrink-0">
                <p className="text-sm font-normal text-gray-700 mb-0.5">Policy</p>
                <p className="text-base font-medium text-gray-900">{data.policy}</p>
              </div>
            </div>
          </div>

          <div className="border border-[#E2E8F0] bg-[#F8FAFC] rounded-lg p-4 sm:p-4">
            <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">Renewal Period</h3>
            <div className="flex flex-wrap gap-3">
              {[3].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => handlePeriodSelect(days)}
                  className={cn(
                    "min-w-[80px] rounded-lg border-2 transition-colors flex flex-col items-center justify-center py-3 px-10",
                    selectedPeriod === days
                      ? "bg-[#00796B1A] border-[#00796B]"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <span className={cn(
                    "font-bold tabular-nums",
                    selectedPeriod === days ? "text-2xl sm:text-3xl text-[#00796B]" : "text-lg text-gray-700"
                  )}>
                    {String(days).padStart(2, "0")}
                  </span>
                  <span className={cn(
                    "text-sm font-medium mt-0.5",
                    selectedPeriod === days ? "text-[#00796B]" : "text-gray-500"
                  )}>
                    days
                  </span>
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Maximum {selectedPeriod != null ? String(selectedPeriod).padStart(2, "0") : "03"} days allowed for this Policy
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Remarks</h3>
            <Textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter Remarks"
              rows={4}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 resize-none text-sm placeholder:text-gray-400 placeholder:italic"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full">
            <ButtonWidget
              type="button"
              onClick={handleCancel}
              className="h-10 w-full sm:flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg"
            >
              Cancel
            </ButtonWidget>
            <ButtonWidget
              type="button"
              onClick={handleRenewClick}
              className="h-10 w-full sm:flex-1 bg-[#00796B] hover:bg-[#00796B]/90 text-white border-0 rounded-lg flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Renew Book
            </ButtonWidget>
          </div>
        </div>
      </DialogContent>
      <ConfirmSuccessPopup
        isOpen={popupOpen}
        onOpenChange={setPopupOpen}
        mode={popupMode}
        action="renew"
        bookTitle={data.bookTitle}
        oldDueDate={typeof data.dueDate === "string" ? data.dueDate : data.dueDate ? format(parseDueDate(data.dueDate) ?? new Date(), "dd/MM/yyyy") : ""}
        newDueDate={successNewDueDate}
        onConfirm={handlePopupConfirm}
        onDone={handlePopupDone}
      />
    </Dialog>
  );
};

export default RenewDialog;

