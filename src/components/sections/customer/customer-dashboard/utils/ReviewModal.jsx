"use client";

import { useState } from 'react';
import Image from 'next/image';
import { X, Star } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import bookImage from "@/assets/image/book.png";
import { useAddReview } from '@/store/customerHooks/CatalogHooks';
import { useErrorHandler } from '@/components/custom-hooks/useErrorHandler';

const ReviewModal = ({ open, onOpenChange, book, onSubmit, isLoading = false }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});
  const { mutateAsync: addReview } = useAddReview();
  const { showSuccessToast, showErrorToast } = useErrorHandler();

  const getImageUrl = () => {
    if (!book?.bookImageUrl) {
      return bookImage;
    }
    const s3Url = process.env.S3_URL || process.env.NEXT_PUBLIC_S3_URL || '';
    return s3Url ? `${s3Url}/books-image/${book?.bookImageUrl}` : book?.bookImageUrl;
  };

  const extractErrorMessage = (error) => {
    const errorMessages = error?.errorMessages || error?.data?.errorMessages;
    if (errorMessages) {
      const messages = Object.values(errorMessages)
        .flat()
        .filter(Boolean);
      if (messages.length > 0) return messages[0];
    }
    return error?.message || error?.data?.message;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (rating === 0) {
      newErrors.rating = "Please select a rating";
    }

    if (!comment || comment.trim().length < 3) {
      newErrors.comment = "Please enter a valid review";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      const payload = {
        bookId: book?.bookId,
        rating: rating,
        review: comment,
      };
  
      const response = await addReview(payload);
  
      showSuccessToast(
        response?.message || response?.data || "Review added successfully"
      );
  
      onOpenChange(false);
  
      setRating(0);
      setComment("");
      setHoverRating(0);
      setErrors({});
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      showErrorToast(errorMessage);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setRating(0);
      setComment('');
      setHoverRating(0);
      setErrors({});
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-xl w-full p-0 gap-0 overflow-hidden max-w-[90vw] sm:max-w-xl max-h-[90vh] flex flex-col"
        hideClose={true}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border px-4 py-3 flex items-center justify-between z-10">
          <h2 className="text-base sm:text-lg font-semibold">Write a Review</h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-4 py-4 space-y-3 sm:space-y-4">
            {/* Book Info */}
            <div className="flex gap-2 sm:gap-3 p-2 sm:p-3 bg-muted/50 rounded-lg">
              <div className="relative w-12 h-[72px] sm:w-16 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                <Image
                  src={getImageUrl()}
                  alt={book?.title || book?.bookTitle || 'Book Cover'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 48px, 64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-xs sm:text-sm mb-0.5 break-words">
                  {book?.title || book?.bookTitle}
                </h3>
                <p className="text-xs text-muted-foreground">by {book?.author || book?.authorName}</p>
              </div>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium mb-1.5 sm:mb-2">
                Your Rating <span className="text-destructive">*</span>
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => { setRating(star); setErrors(prev => { const { rating, ...rest } = prev; return rest; }); }}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="group p-0.5 hover:scale-110 transition-transform"
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      disabled={isLoading}
                    >
                      <Star
                        size={24}
                        className={cn(
                          'transition-colors sm:w-8 sm:h-8',
                          star <= (hoverRating || rating)
                            ? 'fill-[#F59E0B] text-[#F59E0B]'
                            : 'text-gray-300 group-hover:text-gray-400'
                        )}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <span className="text-sm sm:text-base font-semibold text-muted-foreground">
                    {rating} / 5
                  </span>
                )}
              </div>
              {rating > 0 && (
                <p className="text-xs text-muted-foreground mt-1.5">
                  {rating === 1 && '⭐ Poor - Didn\'t enjoy it'}
                  {rating === 2 && '⭐⭐ Fair - It was okay'}
                  {rating === 3 && '⭐⭐⭐ Good - Liked it'}
                  {rating === 4 && '⭐⭐⭐⭐ Very Good - Really enjoyed it'}
                  {rating === 5 && '⭐⭐⭐⭐⭐ Excellent - Loved it!'}
                </p>
              )}
              {errors.rating && (
                <p className="text-xs text-destructive mt-1.5">{errors.rating}</p>
              )}
            </div>

            {/* Review Comment */}
            <div>
              <label htmlFor="review-comment" className="block text-sm font-medium mb-1.5">
                Your Review <span className="text-destructive">*</span>
              </label>
              <textarea
                id="review-comment"
                value={comment}
                onChange={(e) => { setComment(e.target.value); setErrors(prev => { const { comment, ...rest } = prev; return rest; }); }}
                placeholder="Share your thoughts about this book... What did you like? What could be better?"
                rows={4}
                className={cn(
                  'w-full px-3 py-2 bg-white border rounded-lg resize-none',
                  'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
                  'placeholder:text-muted-foreground/50 transition-all text-sm',
                  errors.comment ? 'border-destructive' : 'border-border'
                )}
                disabled={isLoading}
              />
              <div className="flex items-center justify-between mt-1.5">
                <span className={cn(
                  'text-xs',
                  comment.length < 100 ? 'text-muted-foreground' : 'text-[#00A884]'
                )}>
                  {comment.length} characters {comment.length < 100 && `(minimum 100)`}
                </span>
                {errors.comment && (
                  <p className="text-xs text-destructive">{errors.comment}</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white border-t border-border px-4 py-3 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 sm:flex-initial"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              className="flex-1 sm:flex-initial min-w-[100px] bg-[#0B63CE] hover:bg-[#0B63CE]/90 text-white"
            >
              {isLoading ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
