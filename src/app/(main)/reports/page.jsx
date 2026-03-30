import UserSection from '@/components/sections/reports/user/userSection'
import { getReportUserList } from '@/app/api/server'

const UserPage = async({searchParams}) => {
  const params = await searchParams
  const response = await getReportUserList(params)
  return <UserSection response={response} />
}

export default UserPage

