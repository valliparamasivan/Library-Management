import ReservedBooksSection from "@/components/sections/reserved-books/ReservedBooksSection";
import { getAdminReservedList } from "@/app/api/server";

const ReservedBooksPage = async ({ searchParams }) => {
  const params = await searchParams;
  const response = await getAdminReservedList(params);
  
  return <ReservedBooksSection response={response} />;
};

export default ReservedBooksPage;
