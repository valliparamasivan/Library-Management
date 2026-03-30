import HomeSection from '@/components/sections/customer/home/HomeSection'
import { getHomeList, getLanguagesDropdown, getBookCategoriesDropdown } from '@/app/api/customerServer'

const HomePage = async () => {
  const response = await getHomeList();
  const languages = await getLanguagesDropdown();
  const bookCategories = await getBookCategoriesDropdown();
  return <HomeSection response={response} languages={languages} bookCategories={bookCategories} />
}

export default HomePage
