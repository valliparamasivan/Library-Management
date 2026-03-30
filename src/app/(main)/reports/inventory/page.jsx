import InventorySection from '@/components/sections/reports/inventory/inventorySection'
import {getReportInventoryList} from '@/app/api/server'

const InventoryPage = async({searchParams}) => {
  const params = await searchParams
  const response = await getReportInventoryList(params)
  return <InventorySection response={response} />
}

export default InventoryPage