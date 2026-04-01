"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, BookOpen, Star } from 'lucide-react';
import Image from 'next/image';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import RenewBookModal from '../utils/RenewBookModal';
import ReviewModal from '../utils/ReviewModal';
import DashboardPagination from '../../utils/DashboardPagination';
import useURLParams from '@/components/custom-hooks/useURLParams';
import bookImage from "@/assets/image/book.png";

const formatDate = (date) => {
  if (!date) return "-";
  return date.replace(/-/g, " ");
};

const BorrowedBooksTab = ({ borrowedList }) => {
  const router = useRouter();
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReviewBook, setSelectedReviewBook] = useState(null);

  const {
    page: currentPage,
    handlePageChange,
  } = useURLParams({});

  const responseData = borrowedList?.data || borrowedList || {};
  const borrowedBooksData = responseData?.content || [];

  const handleRenewClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleConfirmRenewal = () => {
    setIsModalOpen(false);
    window.location.reload();
  };

  const handleReviewClick = (book) => {
    setSelectedReviewBook(book);
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = () => {
    setIsReviewModalOpen(false);
  };

  const getImageUrl = (image) => {
    if (!image) {
      return bookImage;
    }
    const s3Url = process.env.S3_URL || process.env.NEXT_PUBLIC_S3_URL || '';
    return s3Url ? `${s3Url}/books-image/${image}` : image;
  };
  console.log(borrowedList);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 mt-6">
        <div className="text-sm text-muted-foreground">
          {responseData?.numberOfElements > 0 ? responseData.numberOfElements : borrowedBooksData.length} {(responseData?.numberOfElements > 0 ? responseData.numberOfElements : borrowedBooksData.length) === 1 ? 'book' : 'books'} borrowed
        </div>
      </div>

      {borrowedBooksData.length > 0 ? (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader className="bg-muted/50 border-b border-border">
                <TableRow>
                  <TableHead className="text-left px-4 md:px-6 py-4 font-semibold text-sm">Book</TableHead>
                  <TableHead className="text-left px-4 md:px-6 py-4 font-semibold text-sm hidden md:table-cell">Borrowed</TableHead>
                  <TableHead className="text-left px-4 md:px-6 py-4 font-semibold text-sm">Due Date</TableHead>
                  <TableHead className="text-left px-4 md:px-6 py-4 font-semibold text-sm hidden lg:table-cell">Renewals</TableHead>
                  <TableHead className="text-left px-4 md:px-6 py-4 font-semibold text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border">
                {borrowedBooksData.map((book) => {
                  const isOverdue = book.fineAmount > 0;
                  return (
                    <TableRow key={book.circulationLogId || book.bookId} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="px-4 md:px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={getImageUrl(book.bookImageUrl)}
                              alt={book.bookTitle || 'Book Cover'}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-foreground truncate">
                              {book.bookTitle}
                            </div>
                            <div className="text-sm text-muted-foreground truncate">
                              {book.authorName}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 hidden md:table-cell">
                        <div className="text-sm text-muted-foreground">
                          {formatDate(book.issuedDate || "-")}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4">
                        <div className={`text-sm font-medium flex items-center gap-1 ${isOverdue ? 'text-[#D2483B]' : 'text-foreground'}`}>
                          {isOverdue && <AlertCircle size={16} />}
                          {formatDate(book.dueDate || "-")}
                        </div>
                        {isOverdue && (
                          <div className="text-xs text-[#D2483B] mt-1 font-medium">
                            Fine: ₹{book.fineAmount}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4 hidden lg:table-cell">
                        <div className="text-sm text-muted-foreground">
                          {book.renewalsLeft ?? 0} left
                        </div>
                      </TableCell>
                      <TableCell className="px-4 md:px-6 py-4">
                        <div className="flex items-center font-semibold gap-4">
                          {isOverdue ? (
                            <div className="flex items-center gap-1 text-[#D2483B] border-[#D2483B]">
                              <span className="inline">Return at Counter</span>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRenewClick(book)}
                            >
                              <RefreshCw size={14} />
                              <span className="inline">Renew</span>
                            </Button>
                          )}
                          <button
                            onClick={() => handleReviewClick(book)}
                            className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                          >
                            <Star size={14} />
                            <span className="inline">Review</span>
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <BookOpen size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No books borrowed</p>
          <Button onClick={() => router.push('/customer-catalog')}>
            Browse Catalog
          </Button>
        </div>
      )}

      {borrowedBooksData.length > 0 && (
        <div className="mt-6 md:mt-8 pb-6">
          <DashboardPagination
            responseData={responseData}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <RenewBookModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        book={selectedBook}
        onConfirm={handleConfirmRenewal}
      />

      <ReviewModal
        open={isReviewModalOpen}
        onOpenChange={setIsReviewModalOpen}
        book={selectedReviewBook}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};

export default BorrowedBooksTab;
