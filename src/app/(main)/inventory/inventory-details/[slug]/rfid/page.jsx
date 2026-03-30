import RfidSection from '@/components/sections/inventory/inventory-details/rfid/rfidSection'
import { getBookCopies, getBookDetailsById } from '@/app/api/server'
import { getSectionDropdown } from '@/app/api/dropDown'

const RfidPage = async ({ params, searchParams }) => {
  const { slug } = await params
  const searchParamsObj = await searchParams
  const bookDetails = await getBookDetailsById(slug)
  const copiesResponse = await getBookCopies(slug, searchParamsObj)
  const sectionDropdown = await getSectionDropdown()
  return (
    <RfidSection 
      slug={slug} 
      bookData={bookDetails}
      response={copiesResponse}
      sectionDropdown={sectionDropdown}
      shelfDropdown={null}
      rowDropdown={null}
    />
  )
}

export default RfidPage