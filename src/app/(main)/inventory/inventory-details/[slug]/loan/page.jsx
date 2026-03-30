import LoanSection from '@/components/sections/inventory/inventory-details/loan/loanSection'
import { getBookLoansById } from '@/app/api/server'

const LoanPage = async ({ params, searchParams }) => {
  const { slug } = await params
  const searchParamsObj = await searchParams

  const loansResponse = await getBookLoansById(slug, searchParamsObj)

  return <LoanSection slug={slug} loansResponse={loansResponse} />
}

export default LoanPage