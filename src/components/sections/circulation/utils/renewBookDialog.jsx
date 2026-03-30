"use client";

import book from '@/assets/image/book.png';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import ImageWidget from "@/components/widgets/ImageWidget";
import FormCalendar from "@/components/form/FormCalendar";
import FormTextarea from "@/components/form/FormTextarea";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import { BookOpen, Calendar as CalendarIcon, CheckCircle2, CircleArrowRight, Globe, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ConfirmDialog from "./confirmDialog";

const RenewBookDialog = ({ isOpen, onOpenChange, renewData }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const [newDueDate, setNewDueDate] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const { control, watch, reset, setValue, getValues } = useForm({
    defaultValues: {
      customDate: null,
      remarks: "",
    },
  });
  const customDate = watch("customDate");

  const handleOpenChangeInternal = (open) => {
    onOpenChange(open);
    if (!open) {
      setSelectedPeriod(7);
      setNewDueDate(null);
      reset({ customDate: null, remarks: "" });
    }
  };

  const memberData = renewData ? {
    name: renewData.userName || "Mark Smith",
    email: "marksmith@gmail.com",
    phone: "856 856 8569",
    policy: "Student Policy",
    userId: renewData.userId || "U00014858",
    avatar: null
  } : {
    name: "Mark Smith",
    email: "marksmith@gmail.com",
    phone: "856 856 8569",
    policy: "Student Policy",
    userId: "U00014858",
    avatar: null
  };

  const bookData = renewData ? {
    title: renewData.bookTitle || "The Time Traveler",
    author: "Mark Smith",
    year: "2021",
    language: "English",
    isbn: renewData.bookId || "ISBN9876543210987",
    rfid: renewData.bookId || "AHW2542800124",
    category: "Science Fiction",
    available: "75/100",
    currentDueDate: renewData.dueDate || "28/10/2025"
  } : {
    title: "The Time Traveler",
    author: "Mark Smith",
    year: "2021",
    language: "English",
    isbn: "ISBN9876543210987",
    rfid: "AHW2542800124",
    category: "Science Fiction",
    available: "75/100",
    currentDueDate: "28/10/2025"
  };

  useEffect(() => {
    if (customDate) {
      setNewDueDate(customDate);
      setSelectedPeriod(null);
    } else if (bookData?.currentDueDate && selectedPeriod) {
      let currentDueDate;
      if (typeof bookData.currentDueDate === "string") {
        if (bookData.currentDueDate.includes("/")) {
          const [day, month, year] = bookData.currentDueDate.split("/");
          currentDueDate = new Date(year, month - 1, day);
        } else {
          currentDueDate = new Date(bookData.currentDueDate);
        }
      } else {
        currentDueDate = bookData.currentDueDate;
      }
      
      if (!isNaN(currentDueDate.getTime())) {
        const calculatedDate = addDays(currentDueDate, selectedPeriod);
        setNewDueDate(calculatedDate);
      }
    }
  }, [selectedPeriod, customDate, bookData?.currentDueDate]);

  const handleBack = () => {
    handleOpenChangeInternal(false);
  };

  const handleRenew = () => {
    const formValues = getValues();
    console.log("Renewing book:", {
      remarks: formValues.remarks,
      selectedPeriod,
      customDate,
      newDueDate,
    });
    setSelectedPeriod(7);
    setNewDueDate(null);
    reset({ customDate: null, remarks: "" });
    handleOpenChangeInternal(false);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmBack = () => {
    setIsConfirmDialogOpen(false);
  };

  const handleConfirmDone = () => {
    setIsConfirmDialogOpen(false);
    setNewDueDate(null);
  };

  const handlePeriodSelect = (days) => {
    setSelectedPeriod(days);
    setValue("customDate", null);
  };

  const formatDate = (date) => {
    if (!date) return "";
    if (typeof date === "string") return date;
    return format(date, "yyyy-MM-dd");
  };

  const isReturnOnTime = renewData?.status === "On time" || !renewData?.status || renewData?.status !== "Overdue";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChangeInternal}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[95vh] overflow-y-auto p-4 md:p-6">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-lg font-semibold text-gray-900">Renew Book</h2>
        </div>

        <div className="space-y-6">
          <div className="border border-[#E6E6E6] rounded-lg p-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex items-start gap-3 md:gap-4">
                {memberData.avatar ? (
                  <ImageWidget src={memberData.avatar} alt={memberData.name} className="h-16 w-16 rounded-sm flex-shrink-0" />
                ) : (
                  <div className="h-16 w-16 rounded-sm bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 font-semibold text-lg">{memberData.name.charAt(0)}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-[14px] font-medium leading-[12px] tracking-normal align-middle pb-[14px] text-gray-900">{memberData.name}</h4>
                    <button
                      onClick={() => handleOpenChangeInternal(false)}
                      className="w-5 h-5 flex items-center justify-center hover:bg-[#DCFCE7] rounded transition-colors flex-shrink-0 md:hidden"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  <p className="text-[12px] font-medium leading-[10px] tracking-normal align-middle pb-[14px] text-gray-600">Email ID: {memberData.email}</p>
                  <p className="text-[12px] font-medium leading-[8px] tracking-normal align-middle pb-[14px] text-gray-600">Phone No: {memberData.phone}</p>
                </div>
              </div>
              
              <div className="flex flex-row md:flex-col gap-6 md:gap-4">
                <div className="text-left">
                  <p className="text-xs text-gray-500 pb-1">Policy</p>
                  <p className="text-sm font-semibold text-gray-900">{memberData.policy}</p>
                </div>
                
                <div className="text-left">
                  <p className="text-xs text-gray-500 pb-1">User ID</p>
                  <p className="text-sm font-semibold text-gray-900">{memberData.userId}</p>
                </div>
              </div>
              
              <button
                onClick={() => handleOpenChangeInternal(false)}
                className="hidden md:flex w-5 h-5 self-start md:self-auto items-center justify-center hover:bg-[#DCFCE7] rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="border border-[#E6E6E6] rounded-lg p-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex items-start gap-3 md:gap-4">
                <ImageWidget
                  src={book}
                  alt={bookData.title}
                  className="w-20 h-20 rounded-lg flex-shrink-0 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 pb-[14px]">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-[14px] font-medium leading-[12px] tracking-normal align-middle text-gray-900">{bookData.title}</h4>
                      <span className="inline-block bg-[#00796B26] text-teal-700 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                        {bookData.category}
                      </span>
                    </div>
                    <button
                      onClick={() => handleOpenChangeInternal(false)}
                      className="w-5 h-5 flex items-center justify-center hover:bg-[#DCFCE7] rounded transition-colors flex-shrink-0 md:hidden"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  <p className="text-[12px] font-medium leading-[10px] tracking-normal align-middle pb-[14px] text-gray-600">by {bookData.author} - {bookData.year}</p>
                  <div className="flex items-center gap-1 text-[12px] font-medium leading-[8px] tracking-normal align-middle pb-[14px] text-gray-600">
                    <Globe className="w-4 h-4 text-teal-600" />
                    <span>{bookData.language}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-left mt-2 md:mt-0">
                <p className="text-sm pb-3">
                  <span className="text-xs text-gray-500">ISBN </span>
                  <span className="font-semibold text-gray-900">{bookData.isbn}</span>
                </p>
                <p className="text-sm">
                  <span className="text-xs text-gray-500">RFID </span>
                  <span className="font-semibold text-gray-900">{bookData.rfid}</span>
                </p>
              </div>
              <div className="border border-[#E6E6E6] rounded-lg px-3 py-2 flex items-center gap-2 w-full md:w-auto justify-center md:justify-start">
                <BookOpen className="w-4 h-4 text-[#00796B]" />
                <span className="text-sm font-medium text-[#1A1A1A]">{bookData.available} available</span>
              </div>
              <button
                onClick={() => handleOpenChangeInternal(false)}
                className="hidden md:flex w-5 h-5 self-start md:self-auto items-center justify-center hover:bg-[#DCFCE7] rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600">
              Due Date: <span className="text-gray-900 font-semibold ml-1">{bookData.currentDueDate}</span>
            </p>
          </div>

          <div className="border border-[#E2E8F0] bg-[#F8FAFC] rounded-lg p-4 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Renewal Period</h3>
              <div className="flex flex-wrap gap-3">
                {[7, 14, 21, 30].map((days) => (
                  <ButtonWidget
                    key={days}
                    type="button"
                    onClick={() => handlePeriodSelect(days)}
                    className={cn(
                      "h-16 px-4 md:px-6 rounded-sm border transition-colors flex flex-col items-center justify-center hover:bg-gray-50 flex-1 md:flex-none min-w-[80px]",
                      selectedPeriod === days && !customDate
                        ? "bg-[#00796B1A] border-[#00796B] text-[#00796B]"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <span className={cn(
                      "font-bold",
                      selectedPeriod === days && !customDate ? "text-lg" : "text-base"
                    )}>
                      {days}
                    </span>
                    <span className="text-xs">days</span>
                  </ButtonWidget>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Or choose custom date</h3>
              <FormCalendar
                control={control}
                name="customDate"
                placeholder="Pick a date"
                dateFormat="dd/MM/yyyy"
                iconPosition="right"
                className="h-10"
              />
            </div>

            {newDueDate && (
              <div className="bg-[#DBEAFE] border-2 border-[#3B82F6] rounded-sm p-4">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarIcon className="w-5 h-5 text-[#3B82F6]" />
                      <span className="text-sm font-semibold text-[#3B82F6]">New Due Date</span>
                    </div>
                    <p className="text-xs text-gray-600 ml-7">Book will be due on</p>
                  </div>
                  <span className="text-xl font-semibold text-[#3B82F6]">{formatDate(newDueDate)}</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <FormTextarea
              control={control}
              name="remarks"
              label="Remarks"
              placeholder="Enter Remarks"
              rows={4}
              className="w-full bg-white border border-[#D9D9D9] rounded-sm px-4 py-2"
            />
          </div>

          {isReturnOnTime && (
            <div className="bg-[#DCFCE7] border border-[#00A63E] rounded-lg px-4 py-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Return on Time</span>
            </div>
          )}
        
          <div className="flex flex-col-reverse md:flex-row gap-3 md:justify-between border-t border-[#E2E8F0] pt-4 bg-[hsl(210deg_40%_98.04%)] -mx-4 md:-mx-6 px-4 md:px-6">
            <ButtonWidget
              onClick={handleBack}
              className="w-full md:w-auto px-6 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg"
            >
              Back
            </ButtonWidget>
            <ButtonWidget
              onClick={handleRenew}
              className="w-full md:w-auto px-6 py-2 bg-[#00796B] hover:bg-[#00695C] text-white rounded-lg flex items-center justify-center gap-2"
            >
              <CircleArrowRight className="w-4 h-4" />
              Renew Book
            </ButtonWidget>
          </div>
        </div>
      </DialogContent>
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        message="Book Renewed Successfully"
        detail="Due Date: 17/12/2025"
        onBack={handleConfirmBack}
        onDone={handleConfirmDone}
      />
    </Dialog>
  );
};

export default RenewBookDialog;