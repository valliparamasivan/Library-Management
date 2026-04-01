"use client";

import Image from 'next/image';
import { X, Calendar, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import FormWrapper from '@/components/form/FormWrapper';
import bookImage from "@/assets/image/book.png";
import { useRenewBook } from '@/store/customerHooks/MyDashboardHooks';
import { useErrorHandler } from '@/components/custom-hooks/useErrorHandler';

const RenewBookModal = ({ open, onOpenChange, book, onConfirm, isLoading = false }) => {
  if (!book) return null;

  const currentDueDate = new Date(book.dueDate);
  const newDueDate = new Date(book.issuedDate);
  newDueDate.setDate(newDueDate.getDate() + 14);
  const { mutateAsync: renewBook, isPending } = useRenewBook();
  const { showSuccessToast, showErrorToast } = useErrorHandler();

  const isLastRenewal = book.renewalsLeft === 1;
  const renewalsRemaining = book.renewalsLeft ? book.renewalsLeft - 1 : 0;

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImageUrl = () => {
    const img = book.coverImage || book.bookImageUrl;
    if (!img) {
      return bookImage;
    }
    const s3Url = process.env.S3_URL || process.env.NEXT_PUBLIC_S3_URL || '';
    return s3Url && !img.startsWith('http') && !img.startsWith('/') ? `${s3Url}/books-image/${img}` : img;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        userId: "user",
        rfidList: [book?.rfid],
      };

      const response = await renewBook(payload);

      const successMsg = (typeof response?.data === "string" ? response.data : null)
        || response?.message
        || "Book renewed successfully";
      showSuccessToast(successMsg);
      onOpenChange(false);
      if (onConfirm) onConfirm();
    } catch (error) {
      // On error: show toast but keep modal open, no refresh
      const errorMessages = error?.data?.errorMessages || error?.errorMessages;
      if (errorMessages) {
        const firstMessage = Object.values(errorMessages).flat()[0];
        if (firstMessage) {
          showErrorToast(firstMessage);
          return;
        }
      }
      showErrorToast(error);
    }
  };


  return (
    <Dialog open={open} onOpenChange={(val) => { if (!isPending) onOpenChange(val); }}>
      <DialogContent
        className="max-w-lg w-full p-0 gap-0 overflow-hidden max-w-[90vw] sm:max-w-lg"
        hideClose={true}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 pb-3 sm:pb-4 border-b border-border">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 rounded-xl bg-primary/10 flex-shrink-0">
              <RefreshCw size={20} className="sm:w-6 sm:h-6 text-primary" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold">
              Renew Book
            </h2>
          </div>
          <button
            onClick={() => !isPending && onOpenChange(false)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Close modal"
            disabled={isPending}
          >
            <X size={20} />
          </button>
        </div>

        <FormWrapper onSubmit={handleSubmit}>
          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
            {/* Book Info */}
            <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 bg-muted/50 rounded-lg">
              <div className="relative w-14 h-20 sm:w-16 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                <Image
                  src={getImageUrl()}
                  alt={book.title || book.bookTitle || 'Book Cover'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 56px, 64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base sm:text-lg mb-1 break-words">{book.title || book.bookTitle}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground break-words">{book.author || book.authorName}</p>
              </div>
            </div>

            {/* Renewal Info */}
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              {/* Current Due Date */}
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-muted flex-shrink-0">
                  <Calendar size={16} className="sm:w-[18px] sm:h-[18px] text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Current Due Date</p>
                  <p className="font-medium text-sm sm:text-base break-words">{formatDate(currentDueDate)}</p>
                </div>
              </div>

              {/* Dashed Line Separator with Refresh Icon */}
              <div className="flex items-center justify-center">
                <div className="w-full border-t border-dashed border-border relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                    <RefreshCw size={14} className="sm:w-4 sm:h-4 text-primary" />
                  </div>
                </div>
              </div>

              {/* New Due Date */}
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <Calendar size={16} className="sm:w-[18px] sm:h-[18px] text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">New Due Date</p>
                  <p className="font-semibold text-sm sm:text-base text-primary break-words">{formatDate(newDueDate)}</p>
                </div>
              </div>

              {/* Renewals Remaining */}
              <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-[#00A8841A] rounded-lg border border-[#00A88433]">
                <Clock size={16} className="sm:w-[18px] sm:h-[18px] text-[#00A884] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-[#00A884]">
                    {renewalsRemaining} renewal{renewalsRemaining !== 1 ? 's' : ''} remaining after this
                  </p>
                </div>
              </div>

              {/* Last Renewal Warning */}
              {isLastRenewal && (
                <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-[#F59E0B]/10 rounded-lg border border-[#F59E0B]/20">
                  <AlertCircle size={16} className="sm:w-[18px] sm:h-[18px] text-[#F59E0B] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-[#F59E0B]">
                      This is your last renewal for this book
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Explanation Text */}
            <div className="p-3 sm:p-4 bg-muted/50 rounded-lg">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Your book will be automatically extended by 14 days. Make sure to return it by the new due date to avoid late fees.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 sm:gap-3 p-4 sm:p-6 pt-0 border-t border-border">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              className="flex-1 bg-[#0B63CE] hover:bg-[#0B63CE]/90 text-white"
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <RefreshCw size={16} className="animate-spin" />
                  Renewing...
                </span>
              ) : (
                'Confirm Renewal'
              )}
            </Button>
          </div>
        </FormWrapper>
      </DialogContent>
    </Dialog>
  );
};

export default RenewBookModal;
