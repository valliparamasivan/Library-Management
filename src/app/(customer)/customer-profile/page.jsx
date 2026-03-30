import CustomerProfileSection from '@/components/sections/customer/customer-profile/CustomerProfileSection'
import { getProfileDetails } from '@/app/api/customerServer'

const CustomerProfilePage = async () => {
  const profileDetails = await getProfileDetails();
  return <CustomerProfileSection profileDetails={profileDetails} />
}

export default CustomerProfilePage
