"use client";

import bookImage from "@/assets/image/book.png";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import CustomerFooter from "@/components/layouts/customer/CustomerFooter";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import ImageWidget from "@/components/widgets/ImageWidget";
import TooltipWidget from "@/components/widgets/TooltipWidget";
import {
  ArrowRight,
  Filter,
  Globe,
  Heart,
  Search,
  X
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CustomerPagination from "../utils/CustomerPagination";
import CustomerCatalogFilter from "./utils/customerCatalogFilter";
import { useAddFavorite, useRemoveFavorite } from "@/store/customerHooks/CatalogHooks";
import { useErrorHandler } from "@/components/custom-hooks/useErrorHandler";

const CustomerCatalogSection = ({ booksList, languages, bookCategories }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutateAsync: addFavorite } = useAddFavorite();
  const { mutateAsync: removeFavorite } = useRemoveFavorite();
  const { showSuccessToast, showErrorToast } = useErrorHandler();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || searchParams?.get('searchKey') || "");
  const getSortByFromParams = () => {
    const sortField = searchParams?.get('sortField');
    if (!sortField) return 'relevance';
    if (sortField === 'title') return 'title';
    if (sortField === 'author') return 'author';
    if (sortField === 'year_published') return 'newest';
    if (sortField === 'rating') return 'rating';
    return 'relevance';
  };
  const [sortBy, setSortBy] = useState(getSortByFromParams());
  const [selectedGenre, setSelectedGenre] = useState(searchParams?.get('categoryName') || searchParams?.get('genre') || "All Books");
  const availableParam = searchParams?.get('available');
  const [availableOnly, setAvailableOnly] = useState(availableParam === 'true');
  const [selectedLanguage, setSelectedLanguage] = useState(
    searchParams?.get('language') 
      ? searchParams.get('language').split(',').filter(Boolean) 
      : []
  );
  const [selectedYears, setSelectedYears] = useState(
    searchParams?.get('year') 
      ? searchParams.get('year').split(',').filter(Boolean) 
      : []
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(searchParams?.get('page') ? parseInt(searchParams.get('page')) : 1);
  const [favorites, setFavorites] = useState(new Set());

  const languagesData = languages?.data || [];
  const bookCategoriesData = bookCategories?.data || [];
  
  const availableLanguages = languagesData.map((lang) => lang.language).filter(Boolean);
  const availableCategories = bookCategoriesData.map((cat) => cat.category).filter(Boolean);
  
  const genres = ["All Books", ...availableCategories];

  const responseData = booksList?.data || booksList || {};
  const apiBooks = responseData?.content || [];
  const totalPages = responseData?.totalPages || 1;
  const numberOfElements = responseData?.numberOfElements || 0;

  const mappedBooks = apiBooks.map((book) => ({
    id: book.bookId?.toString() || '',
    title: book.title || 'Untitled',
    author: book.author || 'Unknown Author',
    year: book.year || null,
    genre: book.categoryName || 'Uncategorized',
    language: book.language || '-',
    available: book.availableCopies || 0,
    total: book.totalCopies || 0,
    image: book.bookImageUrl,
    isbn: book.isbn || '',
    status: book.status || '-',
    nextAvailable: book.nextAvailable || null,
    isFavorite: book.isFavorite === true,
  }));

  const { control, watch, setValue, getValues } = useForm({
    defaultValues: {
      search: searchQuery || "",
      sortBy: sortBy,
    },
  });

  const watchedSortBy = watch("sortBy");
  const watchedSearch = watch("search");

  const updateURLParams = useCallback((updates) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.set(key, value[0]);
      } else {
        params.set(key, value);
      }
    });

    router.push(`/customer-catalog?${params.toString()}`);
  }, [router, searchParams]);

  useEffect(() => {
    const urlSearchKey = searchParams?.get('searchKey') || searchParams?.get('search') || "";
    if (urlSearchKey && !watchedSearch) {
      setValue("search", urlSearchKey);
    }
  }, []);

  // Initialize favorites from API data
  useEffect(() => {
    const favoriteBookIds = new Set(
      apiBooks
        .filter((book) => book.isFavorite === true)
        .map((book) => book.bookId?.toString())
        .filter(Boolean)
    );
    setFavorites(favoriteBookIds);
  }, [apiBooks]);

  useEffect(() => {
    if (watchedSortBy && watchedSortBy !== sortBy) {
      let sortField = "title";
      let sortOrder = "asc";

      switch (watchedSortBy) {
        case "title":
          sortField = "title";
          sortOrder = "asc";
          break;
        case "author":
          sortField = "author";
          sortOrder = "asc";
          break;
        case "newest":
          sortField = "year_published";
          sortOrder = "desc";
          break;
        case "rating":
          sortField = "rating";
          sortOrder = "desc";
          break;
        case "relevance":
        default:
          sortField = null;
          sortOrder = null;
      }

      setSortBy(watchedSortBy);
      updateURLParams({ sortField, sortOrder, page: null });
    }
  }, [watchedSortBy, sortBy, updateURLParams]);

  const handleSearch = (value, updateFormValue = false) => {
    const searchValue = value !== undefined ? value : (getValues("search") || "");
    const trimmedValue = searchValue.trim();
    setSearchQuery(trimmedValue);
    if (updateFormValue) {
      setValue("search", value === "" ? "" : searchValue);
    }
    
    if (!trimmedValue) {
      if (selectedGenre !== "All Books") {
        setSelectedGenre("All Books");
      }
      if (selectedLanguage.length > 0) {
        setSelectedLanguage([]);
      }
      updateURLParams({ 
        searchKey: null,
        categoryName: null,
        language: null,
        page: null
      });
      setCurrentPage(1);
      return;
    }
    
    setCurrentPage(1);
    
    const matchedGenre = genres.find(
      (genre) => genre !== "All Books" && genre.toLowerCase() === trimmedValue.toLowerCase()
    );
    
    const matchedLanguage = availableLanguages.find(
      (lang) => lang.toLowerCase() === trimmedValue.toLowerCase()
    );
    
    const updates = { searchKey: trimmedValue, page: null };
    
    if (matchedGenre) {
      if (matchedGenre !== selectedGenre) {
        setSelectedGenre(matchedGenre);
      }
      updates.categoryName = matchedGenre;
    } else {
      if (selectedGenre !== "All Books") {
        updates.categoryName = selectedGenre;
      }
    }
    
    if (matchedLanguage) {
      if (!selectedLanguage.includes(matchedLanguage)) {
        const newLanguages = [...selectedLanguage, matchedLanguage];
        setSelectedLanguage(newLanguages);
        updates.language = newLanguages.join(',');
      } else {
        updates.language = selectedLanguage.join(',');
      }
    } else {
      if (selectedLanguage.length > 0) {
        updates.language = selectedLanguage.join(',');
      }
    }
    
    updateURLParams(updates);
  };

  const handleBrowseBooks = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    const searchValue = getValues("search") || "";
    handleSearch(searchValue.trim() ? searchValue : "", false);
  };



  const handleLanguageToggle = (lang) => {
    const newLanguages = selectedLanguage.includes(lang)
      ? selectedLanguage.filter((l) => l !== lang)
      : [...selectedLanguage, lang];
    setSelectedLanguage(newLanguages);
  };

  const handleYearToggle = (year) => {
    const newYears = selectedYears.includes(year)
      ? selectedYears.filter((y) => y !== year)
      : [...selectedYears, year];
    setSelectedYears(newYears);
  };

  const handleFilter = () => {
    setCurrentPage(1);
    updateURLParams({
      language: selectedLanguage.length > 0 ? selectedLanguage.join(',') : null,
      year: selectedYears.length > 0 ? selectedYears.join(',') : null,
      available: availableOnly ? 'true' : null,
      page: null
    });
    setIsFilterOpen(false);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
    updateURLParams({ 
      categoryName: genre !== "All Books" ? genre : null,
      page: null
    });
  };

  const handleAvailableChange = (value) => {
    setAvailableOnly(value);
  };

  const handleReset = () => {
    setSelectedLanguage([]);
    setSelectedYears([]);
    setAvailableOnly(false);
    setSearchQuery("");
    setValue("search", "");
    setSelectedGenre("All Books");
    setSortBy("relevance");
    setValue("sortBy", "relevance");
    router.push('/customer-catalog');
  };

  const effectiveTotalPages = totalPages || 1;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateURLParams({ page: page === 1 ? null : page.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const extractErrorMessage = (error) => {
    const errorMessages = error?.errorMessages || error?.data?.errorMessages;
    if (errorMessages) {
      const messages = Object.values(errorMessages)
        .flat()
        .filter(Boolean);
      if (messages.length > 0) return messages[0];
    }
    return error?.message || error?.data?.message;
  };

  const toggleFavoriteState = (prev, bookId, shouldAdd) => {
    const newFavorites = new Set(prev);
    if (shouldAdd) {
      newFavorites.add(bookId);
    } else {
      newFavorites.delete(bookId);
    }
    return newFavorites;
  };

  const handleToggleFavorite = async (bookId) => {
    const wasFavorite = favorites.has(bookId);
    setFavorites((prev) => toggleFavoriteState(prev, bookId, !wasFavorite));
    
    try {
      const response = wasFavorite 
        ? await removeFavorite({ bookId })
        : await addFavorite({ bookId });
      showSuccessToast(response.data);
      router.refresh();
    } catch (error) {
      setFavorites((prev) => toggleFavoriteState(prev, bookId, wasFavorite));
      const errorMessage = extractErrorMessage(error);
      router.refresh();
      showErrorToast(errorMessage || (wasFavorite ? "Failed to remove book from favorites" : "Failed to add book to favorites"));
    }
  };

  const getImageUrl = (image) => {
    if (!image) {
      return bookImage;
    }
    const s3Url = process.env.S3_URL || process.env.NEXT_PUBLIC_S3_URL || '';
    return s3Url ? `${s3Url}/books-image/${image}` : image;
  };

  const CatalogGrid = ({ books }) => {
    if (!books || books.length === 0) {
      return (
        <div className="col-span-full text-center py-12 sm:py-16 text-gray-500 text-sm sm:text-base">
          No books found
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-lg transition-shadow overflow-hidden flex flex-col border border-[#E6E6E6] hover:shadow-md"
          >
            <div className="w-full aspect-[3/3] overflow-hidden relative">
              <ImageWidget
                src={getImageUrl(book.image)}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-3 sm:p-4 space-y-2 sm:space-y-2.5 flex-1 flex flex-col">
              <div className="flex items-start">
                <span className="inline-flex px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-full bg-[#0B63CE26] text-[#0B63CE] line-clamp-1">
                  {book.genre}
                </span>
              </div>

              <div className="w-full max-w-[200px] sm:max-w-[250px] mb-0">
                <TooltipWidget content={book.title}>
                  <h3 className="text-base sm:text-lg font-bold mb-1 text-gray-900 truncate">
                    {book.title}
                  </h3>
                </TooltipWidget>
              </div>

              <div className="w-full max-w-[200px] sm:max-w-[250px] mb-0">
                <TooltipWidget content={`by ${book.author} - ${book.year}`}>
                  <p className="text-xs sm:text-sm text-gray-600 pb-2 truncate">
                    by {book.author} - {book.year}
                  </p>
                </TooltipWidget>
              </div>

              <p className="text-xs sm:text-xs text-black pb-2 line-clamp-1">
                Subject Name
              </p>

              <div className="flex items-center gap-1.5 text-xs sm:text-sm pb-2 text-gray-700">
                <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-[#0B63CE] flex-shrink-0" />
                <span className="line-clamp-1">{book.language}</span>
              </div>

              {book.status?.toLowerCase().includes('all copies borrowed') ? (
                <div className="bg-white rounded-lg px-3 text-center sm:px-4 py-2 border border-gray-200 w-full">
                  <p className="text-xs sm:text-sm font-bold text-gray-900 pb-1">
                    {book.status}
                  </p>
                    <p className="text-xs text-gray-600">
                      Next available: {new Date(book.nextAvailable).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
                </div>
              ) : (
                <div className="bg-[#00A8841A] rounded-lg px-3 text-center sm:px-4 py-2 border border-[#00A88433] w-full">
                  <p className="text-xs font-semibold sm:text-sm font-[400] text-[#00A884] pb-0.5">
                    {book.available} of {book.total} Available
                  </p>
                  <p className="text-xs text-[#00A884]">
                    {book.status}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 mt-auto">
                <ButtonWidget
                  onClick={() => router.push(`/customer-catalog/${book.id}`)}
                  className="flex-1 bg-[#0b63ce] hover:bg-[#0a5ab8] text-white font-bold py-2.5 sm:py-2.5 rounded-lg text-xs sm:text-sm"
                >
                  View Details
                </ButtonWidget>
                  <button
                    onClick={() => handleToggleFavorite(book.id)}
                    className="p-2 sm:p-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label={(favorites.has(book.id) || book.isFavorite) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        (favorites.has(book.id) || book.isFavorite) ? "text-[#D2483B]" : "text-gray-400"
                      }`}
                      fill={(favorites.has(book.id) || book.isFavorite) ? "currentColor" : "none"}
                    />
                  </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col overflow-hidden min-h-screen bg-[#FFFFFF] w-full">
      <div 
        className="py-8 sm:py-8 md:py-15 px-4 sm:px-6 lg:px-4"
        style={{ background: 'linear-gradient(to right,rgba(11, 99, 206, 0.39) 8%, #FFFFFF,rgba(0, 168, 132, 0.2) 94%)' }}
      >
        <div className="max-w-4xl mx-auto w-full">
          <div className="relative mb-3 sm:mb-4">
            <FormInput
              control={control}
              name="search"
              type="text"
              placeholder="Search by title, author, ISBN, or topic..."
              className="bg-white border-0 shadow-md rounded-lg text-sm sm:text-base focus:shadow-lg transition-shadow min-h-[52px] sm:min-h-[56px]"
              prefix={<Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />}
            />
            {watchedSearch && watchedSearch.trim() && (
              <button
                onClick={() => {
                  setValue("search", "");
                  setSearchQuery("");
                  handleSearch("", true);
                }}
                className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors z-10"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
              </button>
            )}
          </div>
          <div className="flex justify-center">
            <ButtonWidget
              type="button"
              onClick={handleBrowseBooks}
              className="bg-[#0b63ce] hover:bg-[#0a5ab8] text-white font-semibold py-3 px-4 sm:py-3.5 sm:px-5 rounded-lg flex items-center gap-2 text-xs sm:text-sm lg:text-base min-h-[44px] sm:min-h-[48px]"
            >
              <span className="hidden sm:inline">Browse Books</span>
              <span className="sm:hidden">Browse</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            </ButtonWidget>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-6 lg:px-8 py-3 sm:py-4 bg-white border-b overflow-hidden">
        <div className="flex justify-center w-full">
          <Tabs value={selectedGenre} onValueChange={handleGenreChange} className="w-full max-w-full">
            <div className="overflow-x-auto scrollbar-hide -mx-4 sm:mx-0 px-4 sm:px-0">
              <TabsList className="flex flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-2 bg-transparent p-0 h-auto min-w-max sm:min-w-0">
                {genres.map((genre) => (
                  <TabsTrigger
                    key={genre}
                    value={genre}
                    className={`px-3 sm:px-4 cursor-pointer py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 data-[state=active]:bg-[#0b63ce] data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-gray-200`}
                  >
                    {genre}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-2 lg:px-8 py-4 sm:py-6">
        <div className="flex gap-4 lg:gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <CustomerCatalogFilter
              availableOnly={availableOnly}
              onAvailableOnlyChange={handleAvailableChange}
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageToggle}
              selectedYears={selectedYears}
              onYearChange={handleYearToggle}
              onReset={handleReset}
              onFilter={handleFilter}
              languages={availableLanguages}
            />
          </aside>

          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-2">
                <p className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                  <span className="hidden sm:inline">
                    {numberOfElements > 0 ? numberOfElements : mappedBooks.length} {numberOfElements > 0 ? 'books' : 'book'} found
                  </span>
                  <span className="sm:hidden">
                    {numberOfElements > 0 ? numberOfElements : mappedBooks.length} found
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <ButtonWidget
                      className="lg:hidden h-9 px-3 rounded-sm text-[#0b63ce] bg-white hover:bg-[#0b63ce]/5 border border-[#0b63ce] flex items-center gap-2 flex-shrink-0"
                    >
                      <Filter className="w-4 h-4 text-[#0b63ce] flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-[#0b63ce]">Filter</span>
                    </ButtonWidget>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                    <SheetHeader className="px-4 sm:px-6 py-4 border-b border-gray-200">
                      <SheetTitle className="text-base sm:text-lg font-semibold text-gray-900">Filter</SheetTitle>
                    </SheetHeader>
                    <div className="overflow-y-auto h-[calc(100vh-80px)]">
                      <CustomerCatalogFilter
                        availableOnly={availableOnly}
                        onAvailableOnlyChange={handleAvailableChange}
                        selectedLanguage={selectedLanguage}
                        onLanguageChange={handleLanguageToggle}
                        selectedYears={selectedYears}
                        onYearChange={handleYearToggle}
                        onReset={handleReset}
                        onFilter={handleFilter}
                        languages={availableLanguages}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
                
                <FormSelect
                  control={control}
                  name="sortBy"
                  options={[
                    { value: "relevance", label: "Sort by" },
                    { value: "title", label: "Title A-Z" },
                    { value: "author", label: "Author A-Z" },
                    { value: "newest", label: "Newest First" },
                    { value: "rating", label: "Highest Rated" },
                  ]}
                  placeholder="Sort by"
                  className="rounded-full border border-[#D9D9D9] bg-transparent w-full sm:w-[140px] text-xs sm:text-sm"
                />
              </div>
            </div>

            <CatalogGrid books={mappedBooks} />
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-2 lg:px-8 py-6 sm:py-8 bg-white">
        <div className="flex justify-center">
          <CustomerPagination
            currentPage={currentPage}
            totalPages={effectiveTotalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      
      <CustomerFooter />
    </div>
  );
};

export default CustomerCatalogSection;
