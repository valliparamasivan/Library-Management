import LoansSection from '@/components/sections/loans/LoansSection'
import { getLoanList } from '@/app/api/server'

const LoansPage = async ({ searchParams }) => {
  const params = await searchParams
  const response = await getLoanList(params)
  return <LoansSection response={response} />
}

export default LoansPage
