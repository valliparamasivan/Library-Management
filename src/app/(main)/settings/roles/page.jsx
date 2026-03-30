import RoleSection from '@/components/sections/settings/roles/roleSection'
import { getRoleList } from '@/app/api/server'

const RolePage = async ({ searchParams }) => {
  const params = await searchParams;
  const response = await getRoleList(params);
  return <RoleSection response={response} />
}

export default RolePage