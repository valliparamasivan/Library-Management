"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import ImageWidget from "@/components/widgets/ImageWidget";
import { ChevronLeft, Globe, Heart, Star } from "lucide-react";
import bookImage from "@/assets/image/book.png";
import Link from "next/link";
import LoginToReserveDialog from "./loginToReserveDialog";
import { LoginModal } from "@/components/sections/customer/utils/LoginModal";

const CatalogView = ({ book, reviews }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const bookData = book?.data || {};
  const reviewsData = Array.isArray(reviews) 
    ? reviews 
    : reviews?.content || reviews?.data?.content || (Array.isArray(reviews?.data) ? reviews.data : []);

  const getImageUrl = () => {
    if (!bookData?.bookImageUrl) {
      return bookImage;
    }
    const s3Url = process.env.S3_URL || process.env.NEXT_PUBLIC_S3_URL || '';
    return s3Url ? `${s3Url}/books-image/${bookData.bookImageUrl}` : bookData.bookImageUrl;
  };

  const handleToggleFavorite = () => {
    setIsLoginDialogOpen(true);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative w-4 h-4 sm:w-5 sm:h-5">
          <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-gray-300 text-gray-300 absolute" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 sm:w-5 sm:h-5 fill-gray-300 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-[#566270] hover:text-gray-900 text-xs sm:text-sm font-medium mb-2 sm:mb-3"
        >
          <ChevronLeft className="w-4 h-4 text-[#566270]" />
          Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-1">
            <div className="rounded-lg p-3 sm:p-4 space-y-2">
              <div className="w-full max-w-xs mx-auto lg:max-w-full aspect-[3/4] overflow-hidden rounded-lg">
                <ImageWidget
                  src={getImageUrl()}
                  alt={bookData?.title || "Book"}
                  className="w-full h-full object-cover"
                />
              </div>

              <ButtonWidget
                onClick={() => { setIsLoginDialogOpen(true)}}
                className="w-full bg-[#0b63ce] hover:bg-[#0a5ab8] text-white font-bold py-2 sm:py-2.5 rounded-lg text-sm sm:text-base"
              >
                Reserve Now
              </ButtonWidget>

              <ButtonWidget
                onClick={handleToggleFavorite}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 sm:py-2.5 rounded-lg border border-gray-300 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Heart 
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                />
                Favorite
              </ButtonWidget>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
              
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 pb-0.5">
                  {bookData?.title || "Untitled"}
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  by {bookData?.author || "Unknown Author"}
                </p>
              </div>

                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    {renderStars(bookData?.averageRating || 0)}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-700">
                    {bookData?.averageRating > 0 ? bookData.averageRating.toFixed(1) : "0"} ({bookData?.ratingCount || 0} {(bookData?.ratingCount || 0) === 1 ? 'review' : 'reviews'})
                  </span>
                </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <span className="inline-flex px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full bg-[#0B63CE26] text-[#0B63CE]">
                  {bookData?.bookCategoryName || "Uncategorized"}
                </span>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-700">
                  <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-[#0B63CE] flex-shrink-0" />
                  <span>{bookData?.language || "English"}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 py-2 sm:py-3 border-t border-b border-gray-200">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-0.5">Subject</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">{bookData?.subject || "-"}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-0.5">Published Year</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">{bookData?.year?.toString() || "-"}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-0.5">Publisher</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">{bookData?.publisher || "-"}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-0.5">Book Type</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">{bookData?.bookTypeName || "-"}</p>
                </div>
              </div>

              
              <div className="flex justify-start">
                <div className="bg-[#00A8841A] rounded-lg px-3 sm:px-6 lg:px-8 py-1.5 border border-[#00A88433] text-center w-full sm:w-auto">
                  <p className="text-xs sm:text-sm font-semibold text-[#00A884] pb-0.5">
                    {bookData?.availableCopies || 0} of {bookData?.totalCopies || 0} Available
                  </p>
                  <p className="text-xs text-[#00A884]">
                    {bookData?.status || "-"}
                  </p>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="border-b border-gray-200 bg-transparent p-0 h-auto overflow-x-auto">
                  <TabsTrigger
                    value="overview"
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-gray-900 data-[state=active]:border-b-2 data-[state=active]:border-[#0b63ce] data-[state=active]:text-[#0b63ce] rounded-none whitespace-nowrap"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-gray-600 data-[state=active]:border-b-2 data-[state=active]:border-[#0b63ce] data-[state=active]:text-[#0b63ce] rounded-none whitespace-nowrap"
                  >
                    Reviews ({bookData?.ratingCount || 0})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-2 sm:mt-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 sm:mb-3">
                      About this book
                    </h3>
                    <div className="space-y-2 sm:space-y-2.5 text-[#566270] text-xs sm:text-sm leading-relaxed">
                        <p className="leading-relaxed">{bookData?.description || "No description available."}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-2 sm:mt-3">
                <div className="space-y-0">
                    {reviewsData && reviewsData.length > 0 ? (
                      reviewsData.map((review, index) => {
                        const reviewDate = review.createdAt 
                          ? new Date(review.createdAt).toLocaleDateString('en-GB', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })
                          : '';
                        const isLast = index === reviewsData.length - 1;
                        
                        return (
                          <div 
                            key={review.ratingId || index} 
                            className={`${isLast ? 'pb-2 sm:pb-3' : 'py-2 sm:py-3'} border-b border-gray-200`}
                          >
                            <div className="mb-1.5">
                              <p className="text-sm sm:text-base font-bold text-gray-900 mb-0.5 sm:mb-1">
                                {review.reviewedBy || 'Anonymous'}
                              </p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <div className="flex items-center gap-1">
                                  {renderStars(review.rating || 0)}
                                </div>
                                <span className="text-xs sm:text-sm text-gray-700">{reviewDate}</span>
                              </div>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mt-1.5">
                              {review.review || 'No review text provided.'}
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-500">No reviews yet. Be the first to review this book!</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <LoginToReserveDialog
        isOpen={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
        onCancel={() => setIsLoginDialogOpen(false)}
        onLogin={() => {
          setIsLoginDialogOpen(false);
          setIsLoginModalOpen(true);
        }}
        title="Login to Reserve Book"
        cancelButtonText="Cancel"
        loginButtonText="Login"
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onReopen={() => setIsLoginModalOpen(true)}
      />
    </div>
  );
};

export default CatalogView;
