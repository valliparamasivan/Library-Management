import CustomerDashboard from '@/components/sections/customer/customer-dashboard/DashboardSection'
import { getReservedList, getOverviewCounts } from '@/app/api/customerServer'

const ReservedBooksPage = async ({ searchParams }) => {
  const params = await searchParams;
  const [reservedList, response] = await Promise.all([
    getReservedList(params),
    getOverviewCounts()
  ]);
  return <CustomerDashboard currentPage="reserved-books" response={response} reservedList={reservedList} />
}

export default ReservedBooksPage
