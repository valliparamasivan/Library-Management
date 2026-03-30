import LoanSection from '@/components/sections/reports/loans/loanSection'
import {getReportLoanList} from '@/app/api/server'
const LoanPage = async({searchParams}) => {
  const params = await searchParams
  const response = await getReportLoanList(params)
  return <LoanSection response={response} />
}

export default LoanPage