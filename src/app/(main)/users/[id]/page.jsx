import UserDetailsSection from '@/components/sections/users/UserDetailsSection';
import { getUserDetailsById, getSettingsPolicyList, getUserTransactions } from '@/app/api/server';

const UserDetailsPage = async ({ params, searchParams }) => {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  
  const userResponse = await getUserDetailsById(id);
  const policyResponse = await getSettingsPolicyList({});
  const transactionsResponse = await getUserTransactions(id, resolvedSearchParams);
  
  return <UserDetailsSection 
    id={id} 
    userResponse={userResponse} 
    policyResponse={policyResponse} 
    transactionsResponse={transactionsResponse} 
  />;
};

export default UserDetailsPage;
