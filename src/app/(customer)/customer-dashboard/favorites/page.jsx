import CustomerDashboard from '@/components/sections/customer/customer-dashboard/DashboardSection'
import { getFavoritesList, getOverviewCounts } from '@/app/api/customerServer'

const FavoritesPage = async ({ searchParams }) => {
  const params = await searchParams;
  const [favoritesList, response] = await Promise.all([
    getFavoritesList(params),
    getOverviewCounts()
  ]);
  return <CustomerDashboard currentPage="favorites" response={response} favoritesList={favoritesList} />
}

export default FavoritesPage
