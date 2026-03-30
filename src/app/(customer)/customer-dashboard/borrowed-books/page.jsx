import CustomerDashboard from '@/components/sections/customer/customer-dashboard/DashboardSection'
import { getBorrowedList, getOverviewCounts } from '@/app/api/customerServer'

const BorrowedBooksPage = async ({ searchParams }) => {
  const params = await searchParams;
  const [borrowedList, response] = await Promise.all([
    getBorrowedList(params),
    getOverviewCounts()
  ]);
  return <CustomerDashboard currentPage="borrowed-books" response={response} borrowedList={borrowedList} />
}

export default BorrowedBooksPage
