import BookReviewsSection from "@/components/sections/book-reviews/BookReviewsSection";
import { getAdminReviewList } from "@/app/api/server";

const BookReviewsPage = async ({ searchParams }) => {
  const params = await searchParams;
  const response = await getAdminReviewList(params);
  return <BookReviewsSection response={response} />;
};

export default BookReviewsPage;
