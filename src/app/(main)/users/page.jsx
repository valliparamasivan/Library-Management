import UserSection from '@/components/sections/users/UserSection'
import { getUserList } from '@/app/api/server'
import { getPolicyDropdown } from '@/app/api/dropDown'

const UsersPage = async ({ searchParams }) => {
  const params = await searchParams
  const response = await getUserList(params)
  const policyDropdown = await getPolicyDropdown()
  return <UserSection response={response} policyDropdown={policyDropdown} />
}

export default UsersPage
