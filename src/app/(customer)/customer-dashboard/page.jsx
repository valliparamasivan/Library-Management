import CustomerDashboard from '@/components/sections/customer/customer-dashboard/DashboardSection'
import { getOverviewCounts, getOverviewList } from '@/app/api/customerServer'

const CustomerDashboardPage = async () => {
  const [response, overviewList] = await Promise.all([
    getOverviewCounts(),
    getOverviewList()
  ]);
  return <CustomerDashboard currentPage="overview" response={response} overviewList={overviewList} />
}

export default CustomerDashboardPage
