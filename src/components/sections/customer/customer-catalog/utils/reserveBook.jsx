"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import ImageWidget from "@/components/widgets/ImageWidget";
import { X, BookmarkPlus, Users, Calendar, Bell, CheckCircle2 } from "lucide-react";
import bookImage from "@/assets/image/book.png";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import mailIcon from "@/assets/icons/14.svg";
import { useGetReservedBook, useAddReservedBook } from "@/store/customerHooks/CatalogHooks";
import { useErrorHandler } from "@/components/custom-hooks/useErrorHandler";

const formatDate = (date) => {
  if (!date) return "-";

  const [day, month, year] = date.split("-");
  const newDate = new Date(`${year}-${month}-${day}`);

  return newDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const ReserveBook = ({ isOpen, onOpenChange, book }) => {
  const { mutateAsync: addReservedBook } = useAddReservedBook();
  const { showSuccessToast, showErrorToast } = useErrorHandler();
  const [emailNotification, setEmailNotification] = useState(true);
  const [smsNotification, setSmsNotification] = useState(false);
  const { data: reservedBook } = useGetReservedBook(book?.bookId, {
    enabled: isOpen && !!book?.bookId,
  });
  const bookData = reservedBook?.data || {};
console.log(bookData, "bookData");

  const waitlistPosition = bookData?.myPosition;
  const peopleAhead = bookData?.totalWaiting;
  const estimatedDate = formatDate(bookData?.estimatedAvailabilityDate);
  const email = "priya.sharma@email.com";
  const phone = "+91 98765 43210";

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleConfirm = async () => {
    try {
      const response = await addReservedBook({ bookId: book?.bookId })
      showSuccessToast(response.data);
      onOpenChange(false);
    } catch (error) {
      showErrorToast(error?.data?.message || error?.response?.data?.message || "Reservation failed");
    }
  };

  const getImageUrl = () => {
    if (!book?.bookImageUrl) {
      return bookImage;
    }
    const s3Url = process.env.S3_URL || process.env.NEXT_PUBLIC_S3_URL || '';
    return s3Url ? `${s3Url}/books-image/${book?.bookImageUrl}` : book?.bookImageUrl;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[calc(100%-2rem)] sm:w-full max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#00A8841A] rounded flex items-center justify-center">
              <BookmarkPlus className="w-4 h-4 text-[#00A884]" />
            </div>
            <DialogTitle className="text-lg font-semibold text-gray-900">Reserve Book</DialogTitle>
          </div>
       
        </DialogHeader>

        <div className="px-4 py-4 space-y-4">
          <div className="rounded-lg p-1">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                <ImageWidget
                  src={getImageUrl()}
                  alt={book?.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {bookData.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {bookData.author}
                </p>
              </div>
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="bg-[#00A8841A] rounded-lg p-4 border border-[#00A8841A]">
              <div className="flex items-center gap-2 pb-1">
                <Users className="w-5 h-5 text-[#00A884]" />
                <span className="text-sm font-medium text-[#00A884]">Waitlist Position</span>
              </div>
              <div className="ml-[28px]">
                <p className="text-lg font-semibold text-[#00A884] mb-1">#{waitlistPosition}</p>
                <p className="text-xs text-[#00A884]">
                  {peopleAhead} people ahead of you
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 pb-1">
                <Calendar className="w-5 h-5 text-[#566270]" />
                <span className="text-sm font-medium text-[#566270]">Estimated Availability</span>
              </div>
              <div className="ml-[28px]">
                <p className="text-lg font-semibold text-gray-900 mb-1">{estimatedDate}</p>
                <p className="text-xs text-[#566270] whitespace-nowrap">
                  Based on current loan periods
                </p>
              </div>
            </div>
          </div>

          {/* <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <h4 className="text-sm font-semibold text-gray-900">Notification Preferences</h4>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-start gap-3">
                {emailNotification ? (
                  <div className="w-5 h-5 rounded-sm bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ImageWidget src={mailIcon} alt="Email Notification" className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <Label 
                    htmlFor="email-notification" 
                    className="text-sm font-medium text-gray-900 cursor-pointer block mb-1"
                    onClick={() => setEmailNotification(!emailNotification)}
                  >
                    Email Notification
                  </Label>
                  <span className="text-sm text-gray-600 block">{email}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Checkbox
                    id="sms-notification"
                    checked={smsNotification}
                    onCheckedChange={setSmsNotification}
                    className="w-5 h-5"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="sms-notification" className="text-sm font-medium text-gray-900 cursor-pointer block mb-1">
                    SMS Notification
                  </Label>
                  <span className="text-sm text-gray-600 block">{phone}</span>
                </div>
              </div>
            </div>
          </div> */}

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h5 className="text-sm font-bold text-[#0b63ce] mb-2">Important: Hold Period</h5>
            <p className="text-xs text-gray-700 leading-relaxed">
              Once the book becomes available, you'll have 3 days to pick it up. If not collected, the reservation will be cancelled and offered to the next person in line.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2  justify-center">
            <ButtonWidget
              onClick={handleCancel}
              className="flex-1 sm:flex-1 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-300"
            >
              Cancel
            </ButtonWidget>
            <ButtonWidget
              onClick={handleConfirm}
              className="flex-1 sm:flex-1 bg-[#0b63ce] hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
            >
              Confirm Reservation
            </ButtonWidget>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReserveBook;
