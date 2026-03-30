import CustomerCatalogView from '@/components/sections/customer/customer-catalog/utils/customerCatalogView';
import { getCustomerBookDetails, getReviewsList } from '@/app/api/customerServer';

const CustomerBookDetailsPage = async ({ params }) => {
  const { id } = await params;
  const book = await getCustomerBookDetails(id);
  const reviews = await getReviewsList(id);
  return <CustomerCatalogView book={book} reviews={reviews} />
}

export default CustomerBookDetailsPage
