import CustomerDashboard from '@/components/sections/customer/customer-dashboard/DashboardSection'
import { getHistoryList, getOverviewCounts } from '@/app/api/customerServer'

const HistoryPage = async ({ searchParams }) => {
  const params = await searchParams;
  const [historyList, response] = await Promise.all([
    getHistoryList(params),
    getOverviewCounts()
  ]);
  return <CustomerDashboard currentPage="history" response={response} historyList={historyList} />
}

export default HistoryPage
