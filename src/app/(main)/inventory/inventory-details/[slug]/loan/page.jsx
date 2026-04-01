import LoanSection from '@/components/sections/inventory/inventory-details/loan/loanSection'
import { getBookLoansById, getBookDetailsById } from '@/app/api/server'

const LoanPage = async ({ params, searchParams }) => {
  const { slug } = await params
  const searchParamsObj = await searchParams

  const [loansResponse, bookDetails] = await Promise.all([
    getBookLoansById(slug, searchParamsObj),
    getBookDetailsById(slug),
  ])

  return <LoanSection slug={slug} loansResponse={loansResponse} bookData={bookDetails} />
}

export default LoanPage