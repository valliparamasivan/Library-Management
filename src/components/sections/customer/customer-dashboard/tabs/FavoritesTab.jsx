"use client";

import { useRouter } from "nextjs-toploader/app";
import { Button } from "@/components/ui/button";
import { Heart, Star, BookOpen, X, Calendar } from "lucide-react";
import Image from "next/image";
import bookImage from "@/assets/image/book.png";
import DashboardPagination from "../../utils/DashboardPagination";
import useURLParams from "@/components/custom-hooks/useURLParams";
import { useRemoveFavorite } from "@/store/customerHooks/CatalogHooks";
import { useErrorHandler } from "@/components/custom-hooks/useErrorHandler";

const FavoritesTab = ({  favoritesList }) => {
  console.log(favoritesList,"favoritesList");
  const router = useRouter();
  const { mutateAsync: removeFavorite } = useRemoveFavorite();
  const { showSuccessToast, showErrorToast } = useErrorHandler();

  const {
    page: currentPage,
    handlePageChange,
  } = useURLParams({
  });

  const responseData = favoritesList?.data || favoritesList || {};
  const favoriteBooks = responseData?.content || [];

  const getImageUrl = (image) => {
    if (!image) {
      return bookImage;
    }
    const s3Url = process.env.S3_URL || process.env.NEXT_PUBLIC_S3_URL || '';
    return s3Url ? `${s3Url}/books-image/${image}` : image;
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
    return error?.message || error?.data?.message;
    }
  };

  return (
    <div>
      <div className="text-sm text-muted-foreground mb-6 mt-6">
        {responseData?.numberOfElements > 0 ? responseData.numberOfElements : favoriteBooks.length}{" "}
        {(responseData?.numberOfElements > 0 ? responseData.numberOfElements : favoriteBooks.length) === 1 ? "book" : "books"} in favorites
      </div>

      {favoriteBooks.length === 0 ? (
        <div className="bg-white rounded-xl border border-border p-12 text-center">
          <Heart size={48} className="mx-auto text-muted-foreground pb-4" />
          <p className="text-muted-foreground pb-4">
            You don&apos;t have any favorite books yet
          </p>
          <Button onClick={() => router.push("/customer-catalog")}>
            Browse Catalog
          </Button>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-5">
          {favoriteBooks.map((book, index) => (
            <div
              key={book.bookId || `favorite-${index}`}
              className="bg-white rounded-xl border border-border p-4 md:px-6 md:py-5 flex flex-col sm:flex-row gap-4 md:gap-6 hover:shadow-sm transition-shadow relative"
            >
              <button
                className="absolute top-3 right-3 cursor-pointer sm:top-4 sm:right-4 text-destructive hover:text-destructive/80 p-1 rounded-full hover:bg-destructive/10 transition-colors"
                aria-label="Remove from favorites"
                onClick={() => handleRemoveFavorite(book.bookId)}
              >
                <X size={16} />
              </button>

              <div className="flex-shrink-0 w-full sm:w-auto">
                <div className="relative w-20 h-28 sm:w-24 sm:h-32 md:w-28 md:h-40 rounded-lg overflow-hidden mx-auto sm:mx-0 bg-muted">
                  <Image
                    src={getImageUrl(book.bookImageUrl || book.coverImage || book.image)}
                    alt={book.title || "Book"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0 pr-8 sm:pr-0">
                <div className="mb-2">
                  <h3 className="font-semibold text-base sm:text-lg text-foreground mb-1 line-clamp-2">
                    {book.title || "Untitled"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {book.author || "Unknown Author"}
                  </p>
                    <div className="flex items-center gap-1">
                      <Star
                        size={14}
                        className="text-black"
                        fill="black"
                      />
                      <span className="text-sm font-semibold text-black">{book.rating || 0}</span>
                    </div>
                </div>

                {book.description && (
                  <div className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {book.description}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={14} />
                    <span>{book.availableCopies || 0} of {book.totalCopies || 0} available</span>
                  </div>
                  {book.yearPublished && (
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="mb-1"/>
                      <span>{book.yearPublished}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                    ( book.status === "true")
                      ? "bg-[#00A884] text-white"
                      : "bg-gray-400 text-white"
                  }`}>
                    {(book.status === "true") ? "Available" : "Unavailable"}
                  </span>
                  <Button variant="outline" size="sm" className="rounded-xl text-xs sm:text-sm"
                  onClick={() => router.push(`/customer-catalog/${book.bookId}`)}>
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {favoriteBooks.length > 0 && (
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

export default FavoritesTab;
