import CatalogSection from '@/components/sections/customer/catalog/catalogSection';
import { getBooksList, getLanguagesDropdown, getBookCategoriesDropdown } from '@/app/api/customerServer';

const CatalogPage = async ({ searchParams }) => {
    const params = await searchParams;
    const languages = await getLanguagesDropdown();
    const bookCategories = await getBookCategoriesDropdown();
    const apiParams = {
        pageNumber: params?.page ? parseInt(params.page) - 1 : 0,
        pageSize: params?.pageSize ? parseInt(params.pageSize) : 8,
        searchKey: params?.search || params?.searchKey || "",
        sortField: params?.sortField || "title",
        sortOrder: params?.sortOrder || "asc",
    };

    if (params?.categoryName || params?.genre) {
        apiParams.categoryName = params.categoryName || params.genre;
    }
    if (params?.language) {
        apiParams.language = params.language;
    }
    if (params?.author) {
        apiParams.author = params.author;
    }
    if (params?.year) {
        apiParams.year = params.year;
    }
    if (params?.available === 'true' || params?.available === 'false') {
        apiParams.available = params.available === 'true';
    }

    Object.keys(apiParams).forEach(key => {
        if (apiParams[key] === "") {
            delete apiParams[key];
        }
    });

    const booksList = await getBooksList(apiParams);
    return <CatalogSection booksList={booksList} languages={languages} bookCategories={bookCategories} />
}

export default CatalogPage