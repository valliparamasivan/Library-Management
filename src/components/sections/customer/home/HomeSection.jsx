"use client";

import { useState } from 'react';
import CustomerFooter from '@/components/layouts/customer/CustomerFooter';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award, BookOpen, Clock, Sparkles, Star, Users } from 'lucide-react';
import { useRouter } from 'nextjs-toploader/app';
import { BookCard } from './utils/BookCard';
import { SearchAutocomplete } from './utils/SearchAutocomplete';

const HomeSection = ({ response, languages, bookCategories }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const languagesData = languages?.data || [];
  const bookCategoriesData = bookCategories?.data || [];
  
  const availableLanguages = languagesData.map((lang) => lang.language).filter(Boolean);
  const availableCategories = bookCategoriesData.map((cat) => cat.category).filter(Boolean);

  const mapTopRatedBook = (book) => ({
    id: book.bookId?.toString() || '',
    title: book.title || 'Untitled',
    author: book.author || 'Unknown Author',
    year: book.yearPublished || null,
    image: book.bookImageUrl || null,
    category: book.genre || null,
    subject: null,
    language: book.language || 'English',
    available: book.availableCopies || 0,
    total: book.totalCopies || 0,
    isbn: book.isbn || '',
    description: book.description || '',
    rating: book.rating || null,
    review: book.review || null,
    favouriteId: book.favouriteId || 0,
    status: book.status || null
  });

  const mapNewArrivalBook = (book) => ({
    id: book.bookId?.toString() || '',
    title: book.title || 'Untitled',
    author: book.author || 'Unknown Author',
    year: book.yearPublished || null,
    image: book.bookImageUrl || null,
    category: book.genre || null,
    subject: null,
    language: book.language || 'English',
    available: book.availableCopies || 0,
    total: book.totalCopies || 0,
    isbn: null,
    description: null,
    status: book.status || null
  });

  const responseData = response?.data || response || {};
  const topRatedData = responseData?.topRated || [];
  const newArrivalsData = responseData?.newArrivals || [];
  const totalBooksAvailable = responseData?.totalBooksAvailable ?? 0;

  const formatBookCount = (count) => {
    const n = Number(count) || 0;
    if (n >= 1000) {
      const rounded = Math.floor(n / 1000) * 1000;
      return `${rounded.toLocaleString()}+`;
    }
    return n.toLocaleString();
  };

  const topRated = topRatedData.map(mapTopRatedBook);
  const newArrivals = newArrivalsData.map(mapNewArrivalBook);

  const allBooks = [...topRated, ...newArrivals];
  
  const seenTitles = new Set();
  const searchSuggestions = allBooks
    .map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      category: book.category,
      isbn: book.isbn
    }))
    .filter((book) => {
      const titleLower = book.title?.toLowerCase();
      if (titleLower && !seenTitles.has(titleLower)) {
        seenTitles.add(titleLower);
        return true;
      }
      return false;
    });

  const valueProps = [
    {
      icon: BookOpen,
      title: `${formatBookCount(totalBooksAvailable)} Books`,
      description: 'Physical books, eBooks, and audiobooks across all genres',
      color: 'primary'
    },
    {
      icon: Clock,
      title: 'Open 24/7',
      description: 'Access digital resources anytime, anywhere with your library card',
      color: 'accent'
    },
    {
      icon: Users,
      title: 'Community Events',
      description: 'Book clubs, author talks, and reading programs for all ages',
      color: 'primary'
    },
    {
      icon: Award,
      title: 'Expert Curation',
      description: 'Staff picks and recommendations tailored to your interests',
      color: 'accent'
    }
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query && query.trim()) {
      navigateToCatalog(query.trim());
    }
  };

  const handleSelect = (suggestion) => {
    const selectedValue = suggestion.title || "";
    setSearchQuery(selectedValue);
  };

  const navigateToCatalog = (query = null) => {
    const searchParams = new URLSearchParams();
    const trimmedQuery = query || searchQuery.trim();
    
    if (trimmedQuery) {
      searchParams.set('searchKey', trimmedQuery);
      
      const matchedGenre = availableCategories.find(
        (category) => category.toLowerCase() === trimmedQuery.toLowerCase()
      );
      
      const matchedLanguage = availableLanguages.find(
        (lang) => lang.toLowerCase() === trimmedQuery.toLowerCase()
      );
      
      if (matchedGenre) {
        searchParams.set('categoryName', matchedGenre);
      }
      
      if (matchedLanguage) {
        searchParams.set('language', matchedLanguage);
      }
    }
    
    router.push(`/catalog?${searchParams.toString()}`);
  };

  const handleBrowseBooks = () => {
    navigateToCatalog();
  };

  return (
    <div className="min-h-screen bg-white">
      <main id="main-content">
        <section className="relative bg-gradient-to-br from-primary/8 via-white to-accent/6 overflow-hidden" 
        style={{ background: 'linear-gradient(to right,rgba(11, 99, 206, 0.39) 8%, #FFFFFF,rgba(0, 168, 132, 0.2) 94%)' }}
        >
          <div className="relative mx-auto px-4 md:px-6 lg:px-8 py-15 md:py-15 lg:py-15">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 leading-[1.1]">
                Discover Your Next
                <span className="block text-[#0B63CE] mt-2">Great Read</span>
              </h1>

              <span className="text-md md:text-md text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Dive into {formatBookCount(totalBooksAvailable)} stories, open to everyone
              </span>

              <div className="mb-4 mt-6">
                <SearchAutocomplete
                  placeholder="Search by title, author, ISBN, or topic..."
                  suggestions={searchSuggestions}
                  onSearch={handleSearch}
                  onSelect={handleSelect}
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
                <Button
                  variant="default"
                  onClick={handleBrowseBooks}
                  className="bg-[#0B63CE] text-md hover:bg-[#1565C0] text-white font-semibold rounded-lg min-w-[200px] p-6 "
                >
                  Browse Books
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </div>

              <div className="flex items-center justify-center gap-25 md:gap-25 max-w-2xl mx-auto pt-3">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-semibold text-foreground mb-1">
                    {responseData.totalBooksAvailable || 0}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Books Available</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-semibold text-foreground mb-1">
                    {responseData.activeMembers || 0}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Active Members</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-15 md:py-15 bg-[#F2F8F8]">
          <div className="mx-auto px-4 md:px-6 lg:px-15">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                Everything You Need in One Place
              </h2>
              <span className="text-md text-muted-foreground max-w-2xl mx-auto">
                Access a world of knowledge with comprehensive services designed for modern readers
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {valueProps.map((prop, index) => {
                const Icon = prop.icon;
                return (
                  <div
                    key={index}
                    className="group text-center p-8 rounded-2xl border border-border bg-white shadow-md hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                  >
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-lg mb-5 group-hover:scale-110 transition-transform duration-300 ${
                      prop.color === 'primary' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-[#00A884]/10 text-[#00A884]'
                    }`}>
                      <Icon size={28} strokeWidth={2} />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">{prop.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{prop.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-15 md:py-15">
          <div className="mx-auto px-4 md:px-6 lg:px-15">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Sparkles className="text-primary" size={24} />
                  </div>
                  <h2 className="text-2xl md:text-2xl font-semibold !mb-0">New Arrivals</h2>
                </div>
                <p className="text-muted-foreground pl-[52px]">Fresh reads just added to our collection</p>
              </div>
              <Button
                variant="ghost"
                className="group hidden md:flex"
                onClick={() => router.push('/catalog')}
              >
                View All
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {newArrivals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {newArrivals.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No data found</p>
              </div>
            )}

            <div className="mt-8 text-center md:hidden">
              <Button
                variant="outline"
                onClick={() => router.push('/catalog')}
                className="w-full sm:w-auto"
              >
                View All Books
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        </section>

        <section className="pb-15 md:pb-15">
          <div className="mx-auto px-4 md:px-6 lg:px-15">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#00A884]/10 rounded-lg flex items-center justify-center">
                    <Star className="text-[#00A884] fill-[#00A884]" size={24} />
                  </div>
                  <h2 className="text-2xl md:text-2xl font-semibold !mb-0 text-gray-800">Top Rated</h2>
                </div>
                <p className="text-gray-600 pl-[52px]">Handpicked perfection for you</p>
              </div>
              <Button
                variant="ghost"
                className="group hidden md:flex"
                onClick={() => router.push('/catalog')}
              >
                View All
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {topRated.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {topRated.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No data found</p>
              </div>
            )}

            <div className="mt-8 text-center md:hidden">
              <Button
                variant="outline"
                onClick={() => router.push('/catalog')}
                className="w-full sm:w-auto"
              >
                View All Picks
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <CustomerFooter />
    </div>
  );
};

export default HomeSection;
