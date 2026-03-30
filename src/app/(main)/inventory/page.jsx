import InventorySection from '@/components/sections/inventory/InventorySection'
import { getBookList } from '@/app/api/server'
import { getLanguageDropdown, getBookCategoryDropdown, getBookTypeDropdown, getPublisherDropdown } from '@/app/api/dropDown'

const InventoryPage = async({searchParams}) => {
  const params = await searchParams
  const response = await getBookList(params)
  const languages = await getLanguageDropdown()
  const bookCategories = await getBookCategoryDropdown()
  const bookTypes = await getBookTypeDropdown()
  const publishers = await getPublisherDropdown()
  return <InventorySection response={response} languages={languages} bookCategories={bookCategories} bookTypes={bookTypes} publishers={publishers} />
}

export default InventoryPage