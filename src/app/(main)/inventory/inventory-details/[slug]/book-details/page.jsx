import BookDetailsSection from '@/components/sections/inventory/inventory-details/book-details/bookDetailsSection'
import { getBookDetailsById } from '@/app/api/server'
import { getLanguageDropdown, getBookCategoryDropdown, getBookTypeDropdown } from '@/app/api/dropDown'

const BookDetailsPage = async ({ params }) => {
  const { slug } = await params
  const bookDetails = await getBookDetailsById(slug)
  const languages = await getLanguageDropdown()
  const bookCategories = await getBookCategoryDropdown()
  const bookTypes = await getBookTypeDropdown()
  return (
    <BookDetailsSection 
      slug={slug} 
      bookData={bookDetails}
      languages={languages}
      bookCategories={bookCategories}
      bookTypes={bookTypes}
    />
  )
}

export default BookDetailsPage