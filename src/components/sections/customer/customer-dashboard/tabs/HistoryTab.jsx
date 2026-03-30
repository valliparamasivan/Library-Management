"use client";

import { useState } from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { Button } from '@/components/ui/button';
import { Star, CheckCircle, History, Heart } from 'lucide-react';
import Image from 'next/image';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import ReviewModal from '../utils/ReviewModal';
import { useAddFavorite, useRemoveFavorite } from "@/store/customerHooks/CatalogHooks";
import bookImage from "@/assets/image/book.png";
import { useErrorHandler } from '@/components/custom-hooks/useErrorHandler';
import DashboardPagination from '../../utils/DashboardPagination';
import useURLParams from '@/components/custom-hooks/useURLParams';

const formatDate = (date) => {
  if (!date) return "-";

  const [day, month, year] = date.split("-");
  const newDate = new Date(`${year}-${month}-${day}`);

  return newDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const HistoryTab = ({ historyList }) => {
  const router = useRouter();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReviewBook, setSelectedReviewBook] = useState(null);
  const { mutateAsync: addFavorite } = useAddFavorite();
  const { mutateAsync: removeFavorite } = useRemoveFavorite();
  const { showSuccessToast, showErrorToast } = useErrorHandler();
  
  const {
    page: currentPage,
    handlePageChange,
  } = useURLParams({});

  const responseData = historyList?.data || historyList || {};
  const readingHistoryData = responseData?.content || [];

  const handleAddFavorite = async (bookId) => {
    try {
      const response = await addFavorite({ bookId });
      showSuccessToast(response.data);
      router.refresh();
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      showErrorToast(errorMessage);
    }
  };

  const handleRemoveFavorite = async (bookId) => {
    try {
      const response = await removeFavorite({ bookId });
      showSuccessToast(response.data);
      router.refresh();
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      showErrorToast(errorMessage);
    }
  };

  const extractErrorMessage = (error) => {
    const errorMessages = error?.errorMessages || error?.data?.errorMessages;
    if (errorMessages) {
      const messages = Object.values(errorMessages)
        .flat()
        .filter(Boolean);
      return messages.length > 0 ? messages[0] : error?.message || error?.data?.message;
    }
    return error?.message || error?.data?.message;
  };

  const handleFavoriteToggle = async (book) => {
    if (book.isFavorite) {
      await handleRemoveFavorite(book.bookId);
    } else {
      await handleAddFavorite(book.bookId);
    }
  };

  const getImageUrl = (image) => {
    if (!image) {
      return bookImage;
    }
    const s3Url = process.env.S3_URL || process.env.NEXT_PUBLIC_S3_URL || '';
    return s3Url ? `${s3Url}/books-image/${image}` : image;
  };
  const handleReviewClick = (book) => {
    setSelectedReviewBook(book);
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = () => {
    setIsReviewModalOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 mt-6">
        <div className="text-sm text-muted-foreground">
          {responseData?.numberOfElements > 0 ? responseData.numberOfElements : readingHistoryData.length} {(responseData?.numberOfElements > 0 ? responseData.numberOfElements : readingHistoryData.length) === 1 ? 'book' : 'books'} in history
        </div>
      </div>

      {readingHistoryData.length > 0 ? (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader className="bg-muted/50 border-b border-border">
                <TableRow>
                  <TableHead className="text-left px-4 md:px-6 py-4 font-semibold text-sm">Book</TableHead>
                  <TableHead className="text-left px-4 md:px-6 py-4 font-semibold text-sm"></TableHead>
                  <TableHead className="text-left px-4 md:px-6 py-4 font-semibold text-sm">Borrowed</TableHead>
                  <TableHead className="text-left px-4 md:px-6 py-4 font-semibold text-sm">Returned</TableHead>
                  <TableHead className="text-left px-4 md:px-6 py-4 font-semibold text-sm">Status</TableHead>
                  <TableHead className="text-left px-4 md:px-6 py-4 font-semibold text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border">
                {readingHistoryData.map((book, index) => (
                  <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="px-4 md:px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={getImageUrl(book.bookImageUrl)}
                            alt={book?.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-foreground truncate mb-1">
                            {book.title}
                          </div>
                          <div className="text-sm text-muted-foreground truncate mb-1">
                            {book.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star size={14} className="fill-black text-black" />
                            <span className="text-sm font-medium">{book.rating}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleFavoriteToggle(book)}
                          className="p-1 hover:bg-muted rounded transition-colors"
                          aria-label={book.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Heart
                            size={16}
                            className={book.isFavorite ? 'text-[#D2483B]' : 'text-muted-foreground'}
                            fill={book.isFavorite ? 'currentColor' : 'none'}
                          />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 md:px-6 py-4">
                      <div className="text-sm text-muted-foreground">
                        {formatDate(book?.issuedDate) || "-"}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 md:px-6 py-4">
                      <div className="text-sm text-muted-foreground">
                        {formatDate(book?.returnDate) || "-"}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 md:px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit ${book?.status === 'Returned'
                            ? 'bg-[#00A884]/10 text-[#00A884]'
                            : 'bg-destructive/10 text-destructive'
                          }`}>
                          {book?.status === 'Returned' && <CheckCircle size={12} />}
                          {book?.status}
                        </span>
                        {book.lateFee && (
                          <span className="text-xs text-destructive font-medium">
                            Fine: ₹{book.lateFee}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 md:px-6 py-4">
                      <Button
                        variant="outline"
                        className="rounded-xl"
                        size="sm"
                        onClick={() => handleReviewClick(book)}
                      >
                        <Star size={14} className="mr-1.5 text-black" />
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <History size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No reading history</p>
          <Button onClick={() => router.push('/customer-catalog')}>
            Browse Catalog
          </Button>
        </div>
      )}

      {readingHistoryData.length > 0 && (
        <div className="mt-6 md:mt-8 pb-6">
          <DashboardPagination
            responseData={responseData}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <ReviewModal
        open={isReviewModalOpen}
        onOpenChange={setIsReviewModalOpen}
        book={selectedReviewBook}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};

export default HistoryTab;
