import CatalogView from '@/components/sections/customer/catalog/utils/catalogView';
import { getBookDetails, getReviewsList } from '@/app/api/customerServer';

const BookDetailsPage = async ({ params }) => {
  const { id } = await params;
  const book = await getBookDetails(id);
  const reviews = await getReviewsList(id);
  return <CatalogView book={book} reviews={reviews} />
}

export default BookDetailsPage
