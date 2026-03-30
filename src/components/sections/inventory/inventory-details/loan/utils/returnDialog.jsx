"use client";

import book from '@/assets/image/book.png';
import user from '@/assets/image/user.png';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import ImageWidget from "@/components/widgets/ImageWidget";
import { ArrowRight, Calendar as CalendarIcon, Home, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import cashIcon from '@/assets/icons/17.svg';
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
  fineAmount: 120,
  overdueAmountPerDay: 12,
  totalOverdueDays: 10,
};

const ReturnDialog = ({ isOpen, onOpenChange, bookData }) => {
  const [remarks, setRemarks] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMode, setPopupMode] = useState("confirm");

  const data = { ...defaultDisplay, ...bookData };
  const isOverdue =
    data.isOverdue === true ||
    (typeof data.status === "string" && data.status.toLowerCase().includes("overdue")) ||
    (typeof data.loanStatus === "string" && data.loanStatus.toLowerCase().includes("overdue")) ||
    (typeof data.statusLabel === "string" && data.statusLabel.toLowerCase().includes("overdue"));
  const fineAmountNum =
    typeof data.fineAmount === "number"
      ? data.fineAmount
      : typeof data.fineAmount === "string"
        ? parseInt(String(data.fineAmount).replace(/[^0-9]/g, ""), 10) || 0
        : typeof data.fine === "string"
          ? parseInt(String(data.fine).replace(/[^0-9]/g, ""), 10) || 0
          : data.fineAmount ?? 0;
  const totalOverdueDaysNum =
    data.totalOverdueDays != null
      ? Number(data.totalOverdueDays)
      : data.overdueDays != null
        ? parseInt(String(data.overdueDays).replace(/\D/g, ""), 10) || 0
        : 0;
  const overduePerDayNum =
    data.overdueAmountPerDay != null
      ? Number(data.overdueAmountPerDay)
      : totalOverdueDaysNum > 0 && fineAmountNum > 0
        ? Math.round(fineAmountNum / totalOverdueDaysNum)
        : data.overdueAmountPerDay ?? 0;
  const statusText = isOverdue
    ? `Overdue - ${String(totalOverdueDaysNum).padStart(2, "0")} Days`
    : data.daysLeft != null
      ? `${data.daysLeft} Days left`
      : data.loanStatus || data.statusLabel || data.status;

  useEffect(() => {
    setRemarks(bookData?.remarks ?? "");
  }, [bookData?.remarks, isOpen]);

  const handleCancel = () => {
    setRemarks(bookData?.remarks ?? "");
    setPopupOpen(false);
    onOpenChange(false);
  };

  const handleReturnClick = () => {
    setPopupMode("confirm");
    setPopupOpen(true);
  };

  const handlePopupConfirm = () => {
    setPopupMode("success");
    setPopupOpen(true);
    console.log("Returning book with remarks:", remarks);
  };

  const handlePopupDone = () => {
    setRemarks("");
    setPopupOpen(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[95vw] md:max-w-3xl max-h-[95vh] overflow-y-auto p-4 sm:p-4">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-base sm:text-lg font-semibold text-gray-900">Return Book</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4 sm:mt-2">
          <div
            className={cn(
              "grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-lg p-4 sm:p-6 bg-white items-start border-1",
              isOverdue ? "border-[#F44336]" : "border border-gray-200"
            )}
          >
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
              <span
                className={cn(
                  "inline-flex w-fit px-3 py-1.5 rounded-sm text-sm font-semibold",
                  isOverdue ? "bg-red-100 text-[#F44336]" : "bg-green-100 text-green-800"
                )}
              >
                {statusText}
              </span>
            </div>
          </div>

 
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

          {isOverdue && (
            <div className=" p-2 sm:p-2 bg-white">
              <div className="flex items-center mb-1">
                <span className="relative inline-flex items-center justify-center w-8 h-8 rounded-md text-green-700">
                  <ImageWidget src={cashIcon} alt="Cash" className="w-4 h-4" /> 
                </span>
                <h3 className="text-sm font-semibold text-gray-900">Collect Fine</h3>
              </div>
              <p className="text-sm font-medium text-[#1A1A1A] mb-1">
                Fine Amount - <span className="font-bold text-r-900">${fineAmountNum}</span>
              </p>
              <p className="text-sm font-medium text-[#1A1A1A]">
                Overdue Amount per Day - <span className="font-bold text-red-600">${overduePerDayNum}</span>
                {" | "}
                Total Overdue Days - <span className="font-bold text-red-600">{totalOverdueDaysNum} days</span>
              </p>
            </div>
          )}

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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full">
            <ButtonWidget
              type="button"
              onClick={handleCancel}
              className="h-10 w-full sm:flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg"
            >
              Cancel
            </ButtonWidget>
            <ButtonWidget
              type="button"
              onClick={handleReturnClick}
              className="h-10 w-full sm:flex-1 bg-[#00796B] hover:bg-[#00796B]/90 text-white border-0 rounded-lg flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Return Book
            </ButtonWidget>
          </div>
        </div>
      </DialogContent>
      <ConfirmSuccessPopup
        isOpen={popupOpen}
        onOpenChange={setPopupOpen}
        mode={popupMode}
        action="return"
        bookTitle={data.bookTitle}
        onConfirm={handlePopupConfirm}
        onDone={handlePopupDone}
      />
    </Dialog>
  );
};

export default ReturnDialog;
