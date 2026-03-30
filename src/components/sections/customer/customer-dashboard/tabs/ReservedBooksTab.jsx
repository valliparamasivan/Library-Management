"use client";

import { useRouter } from 'nextjs-toploader/app';
import { Button } from '@/components/ui/button';
import { BookmarkPlus, Heart } from 'lucide-react';
import Image from 'next/image';
import bookImage from '@/assets/image/book.png';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import DashboardPagination from '../../utils/DashboardPagination';
import useURLParams from '@/components/custom-hooks/useURLParams';
import { useAddFavorite, useRemoveFavorite } from "@/store/customerHooks/CatalogHooks";
import { useErrorHandler } from '@/components/custom-hooks/useErrorHandler';

const formatDate = (date) => {
  if (!date) return "-";
  return date.replace(/-/g, " ");
};

const ReservedBooksTab = ({ favorites, toggleFavorite, reservedList }) => {
  console.log(reservedList, "reservedList");
  const router = useRouter();
  const { mutateAsync: addFavorite } = useAddFavorite();
  const { mutateAsync: removeFavorite } = useRemoveFavorite();
  const { showSuccessToast, showErrorToast } = useErrorHandler();

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

  const handleFavoriteToggle = async (book) => {
    if (book.isFavorite) {
      await handleRemoveFavorite(book.bookId);
    } else {
      await handleAddFavorite(book.bookId);
    }
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

  const {
    page: currentPage,
    handlePageChange,
  } = useURLParams({});

  const responseData = reservedList?.data || reservedList || {};
  const reservedBooks = responseData?.content || [];

  const getImageUrl = (image) => {
    if (!image) {
      return bookImage;
    }
    const s3Url = process.env.S3_URL || process.env.NEXT_PUBLIC_S3_URL || '';
    return s3Url ? `${s3Url}/books-image/${image}` : image;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 mt-6">
        <div className="text-sm text-muted-foreground">
          {responseData?.numberOfElements > 0 ? responseData.numberOfElements : reservedBooks.length} {(responseData?.numberOfElements > 0 ? responseData.numberOfElements : reservedBooks.length) === 1 ? 'book' : 'books'} reserved
        </div>
      </div>

      {reservedBooks.length > 0 ? (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader className="bg-muted/50 border-b border-border">
                <TableRow>
                  <TableHead className="text-left px-4 md:px-6 py-4 font-semibold text-sm">Book</TableHead>
                  <TableHead className="text-left px-4 md:px-6 py-4 font-semibold text-sm"></TableHead>
                  <TableHead className="text-left px-4 md:px-6 py-4 font-semibold text-sm">Reserved Date</TableHead>
                  <TableHead className="text-left px-4 md:px-6 py-4 font-semibold text-sm">Days Left</TableHead>
                  <TableHead className="text-left px-4 md:px-6 py-4 font-semibold text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border">
                {reservedBooks.map((book) => (
                  <TableRow key={book.bookReserveId} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="px-4 md:px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                          <Image
                            src={getImageUrl(book.bookImageUrl || book.coverImage || book.image)}
                            alt={book.bookTitle}
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
                            {book.bookAuthor}
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
                      <span className="text-sm text-muted-foreground">
                        {formatDate(book.reservedDate || "-")}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 md:px-6 py-4">
                      <div className="text-sm text-muted-foreground">
                        {book.daysLeft ?? '-'}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 md:px-6 py-4">
                      <Button
                        variant="outline"
                        className="rounded-xl"
                        size="sm"
                        onClick={() => router.push(`/customer-catalog/${book.bookId}`)}
                      >
                        View Details
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
          <BookmarkPlus size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No books reserved</p>
          <Button onClick={() => router.push('/customer-catalog')}>
            Browse Catalog
          </Button>
        </div>
      )}

      {reservedBooks.length > 0 && (
        <div className="mt-6 md:mt-8 pb-6">
          <DashboardPagination
            responseData={responseData}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ReservedBooksTab;
