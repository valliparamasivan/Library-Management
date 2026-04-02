"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft, Search, ScanLine, User, BookMinus, Plus, X, Loader2 } from "lucide-react";
import PageLayout from "@/components/layouts/PageLayout";
import FormInput from "@/components/form/FormInput";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import ImageWidget from "@/components/widgets/ImageWidget";
import { useSearchBookOrUser } from "@/store/hooks/CirculationHooks";
import useErrorHandler from "@/components/custom-hooks/useErrorHandler";

const BookAddPage = () => {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  const { mutateAsync: searchBookApi, isPending: isSearching } = useSearchBookOrUser();
  const { showErrorToast } = useErrorHandler();

  const { control, watch, reset } = useForm({
    defaultValues: { searchBook: "" },
  });

  const searchValue = watch("searchBook");

  const handleSearch = async () => {
    if (!searchValue?.trim()) return;
    try {
      const response = await searchBookApi({ type: 2, searchKey: searchValue.trim(), loanFilter: "AVAILABLE" });
      const data = response?.data || {};
      const mapped = (data.availableBooks || []).map((book) => ({
          bookId: book.bookId,
          bookCopyId: book.bookCopyId,
          rfid: book.rfid,
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          year: book.year,
          totalCopies: book.totalCopies ?? 0,
          issuedCopies: book.issuedCopies ?? 0,
          availableCopies: ((book.totalCopies ?? 0) - (book.issuedCopies ?? 0)),
          bookImageUrl: book.bookImageUrl,
      })).filter((book) => book.availableCopies > 0);
      setSearchResults({ availableBooks: mapped });
    } catch (error) {
      showErrorToast(error);
    }
  };

  // Debounced live search
  const debounceRef = useRef(null);
  useEffect(() => {
    const value = searchValue?.trim();
    if (!value) {
      setSearchResults(null);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchValue]);

  const handleScanClick = () => {
    setIsScanning(true);
  };

  const handleCancelScan = () => {
    setIsScanning(false);
  };

  const handleAddBook = (book) => {
    try {
      const existing = JSON.parse(sessionStorage.getItem("checkoutItems") || "[]");
      const newItem = {
        id: String(book.bookCopyId || book.bookId),
        title: book.title,
        refId: book.rfid || book.isbn,
        author: book.author,
        year: book.year || "",
        dueDate: "-",
      };
      const alreadyExists = existing.some((item) => item.id === newItem.id);
      if (!alreadyExists) {
        sessionStorage.setItem("checkoutItems", JSON.stringify([...existing, newItem]));
      }
    } catch {
      // fallback
    }
    router.push("/circulation/checkout");
  };

  const handleClearResults = () => {
    setSearchResults(null);
  };

  const breadcrumbs = [
    { label: "Circulation", href: "/circulation" },
    { label: "Add Book" },
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div className="flex items-center gap-2 border-b border-gray-200 -mx-4 px-4 py-3 mb-6">
        <ArrowLeft
          className="h-5 w-5 flex-shrink-0 cursor-pointer text-gray-600 hover:text-gray-900"
          onClick={() => router.back()}
        />
        <h1 className="text-lg font-semibold text-gray-900">Add Book</h1>
      </div>
      <div className="bg-white rounded-lg pt-4 ">
        {!searchResults ? (
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 max-w-md mx-auto">
              <h2 className="text-base font-semibold text-gray-900 mb-4 text-center">Search Book</h2>
              <div className="flex justify-center">
                <div className="relative w-full max-w-md">
                  <FormInput
                    control={control}
                    name="searchBook"
                    placeholder="Search Book"
                    className="rounded-lg border border-gray-200 h-10 pr-20 pl-4 text-sm"
                  />
                  {searchValue && (
                    <button
                      type="button"
                      onClick={() => {
                        reset({ searchBook: "" });
                        setSearchResults(null);
                      }}
                      className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#00796B] text-white h-8 w-8 rounded-lg flex items-center justify-center hover:bg-[#00695C] transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-gray-500">Or</span>
              </div>
            </div>

            <div className="mb-6 flex justify-center">
              <div className="w-full max-w-3xl bg-[#F9F9F9] border border-gray-200 rounded-xl p-6 flex flex-col items-center">
                <button
                  type="button"
                  onClick={handleScanClick}
                  className="flex flex-col items-center cursor-pointer border-0 bg-transparent p-0"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Scan Book</h3>
                  <div className="w-12 h-12 bg-[#B3DDB580] rounded-md flex items-center justify-center mb-6">
                    <ScanLine className="w-10 h-10 text-[#00796B]" strokeWidth={1.5} />
                  </div>
                </button>
                <ButtonWidget
                  type="button"
                  onClick={handleCancelScan}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg px-6 py-2"
                >
                  Cancel
                </ButtonWidget>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#E8F1F0] rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Search Results</h3>
              </div>
              <button
                type="button"
                onClick={handleClearResults}
                className="p-1 rounded hover:bg-gray-100 text-gray-600"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {searchResults.availableBooks?.length > 0 ? (
              <div>
                <div className="bg-[#E8F1F0] rounded-t-lg px-4 py-3 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-600">Available Books</h4>
                  </div>
                  <div className="flex-shrink-0 w-32 flex justify-center">
                    <h4 className="text-sm font-medium text-gray-600">Status</h4>
                  </div>
                  <div className="flex-shrink-0 w-40 flex justify-center">
                    <h4 className="text-sm font-medium text-gray-600">Actions</h4>
                  </div>
                </div>

                <div className="space-y-2">
                  {searchResults.availableBooks.map((book) => (
                    <div key={`${book.bookCopyId}-${book.rfid}`} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <h5 className="text-base font-semibold text-gray-900 mb-1">
                            {book.title}
                          </h5>
                          <p className="text-sm text-gray-600 mb-1">
                            {book.rfid}
                          </p>
                          <p className="text-sm text-gray-600">
                            by {book.author} - {book.year || "N/A"}
                          </p>
                        </div>

                        <div className="flex-shrink-0 w-32 flex justify-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg ${
                            book.availableCopies > 0
                              ? "bg-green-50 border border-green-200 text-green-800"
                              : "bg-red-50 border border-red-200 text-red-800"
                          }`}>
                            <BookMinus className="w-4 h-4" />
                            {book.availableCopies > 0 ? `${book.availableCopies}/${book.totalCopies}` : "Issued"}
                          </span>
                        </div>

                        <div className="flex-shrink-0 w-40 flex justify-center gap-2">
                          <ButtonWidget
                            type="button"
                            onClick={() => handleAddBook(book)}
                            disabled={book.availableCopies <= 0}
                            className={`rounded-lg px-4 py-2 flex items-center gap-1.5 text-sm ${
                              book.availableCopies > 0
                                ? "bg-[#00796B] hover:bg-[#00695C] text-white"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <Plus className="w-4 h-4" />
                            Add
                          </ButtonWidget>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No available books found for your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default BookAddPage;
