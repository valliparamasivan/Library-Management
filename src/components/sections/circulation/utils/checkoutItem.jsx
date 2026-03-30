"use client";

import React, { useState, useEffect } from "react";
import PageLayout from "@/components/layouts/PageLayout";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import ImageWidget from "@/components/widgets/ImageWidget";
import FormInput from "@/components/form/FormInput";
import { useForm } from "react-hook-form";
import { ArrowLeft, CircleCheck, X, Search, ScanLine, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import bookImage from "@/assets/image/book.png";
import { useSearchBookOrUser, useScanUser } from "@/store/hooks/CirculationHooks";
import useErrorHandler from "@/components/custom-hooks/useErrorHandler";

const CheckoutItem = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookId = searchParams.get("bookId");

  const { mutateAsync: searchUser, isPending: isSearchingUser } = useSearchBookOrUser();
  const { mutateAsync: scanUserApi, isPending: isScanningUser } = useScanUser();
  const { showErrorToast } = useErrorHandler();

  const { control, watch, reset } = useForm({
    defaultValues: { userSearch: "" },
  });

  const userSearchValue = watch("userSearch");

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [showUserSelection, setShowUserSelection] = useState(false);
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [scanUserInput, setScanUserInput] = useState("");

  useEffect(() => {
    if (bookId) {
      try {
        const stored = sessionStorage.getItem("checkoutBook");
        if (stored) {
          const book = JSON.parse(stored);
          setCheckoutItems([
            {
              id: String(book.bookCopyId || book.bookId),
              title: book.title,
              refId: book.rfid || book.isbn || String(book.bookId),
              author: book.author || "",
              year: book.year || "",
              image: bookImage,
            },
          ]);
        }
      } catch {
        // fallback if sessionStorage fails
      }
    }
  }, [bookId]);

  const handleRemoveItem = (id) => {
    setCheckoutItems((prev) => prev.filter((item) => id !== item.id));
    if (checkoutItems.length === 1) {
      router.push("/circulation");
    }
  };

  const handleClearAll = () => {
    setCheckoutItems([]);
    router.push("/circulation");
  };

  const handleSelectUser = () => {
    setShowUserSelection(true);
  };

  const handleUserSearch = async () => {
    const value = userSearchValue?.trim();
    if (!value) {
      setUserSearchResults([]);
      return;
    }

    try {
      const response = await searchUser({ type: 1, searchKey: value });
      const users = response?.data || [];
      setUserSearchResults(
        users.map((u) => ({
          id: u.userId,
          internalUserId: u.internalUserId,
          name: u.userName,
          email: u.email,
        }))
      );
    } catch (error) {
      showErrorToast(error);
      setUserSearchResults([]);
    }
  };

  const handleUserSelect = (user) => {
    sessionStorage.setItem("checkoutItems", JSON.stringify(checkoutItems));
    router.push(`/circulation/checkout?userId=${user.id}`);
  };

  const handleScanUserCard = async () => {
    const value = scanUserInput.trim();
    if (!value) return;

    try {
      const response = await scanUserApi({ userId: value });
      const userData = response?.data;
      if (userData) {
        sessionStorage.setItem("checkoutItems", JSON.stringify(checkoutItems));
        router.push(`/circulation/checkout?userId=${userData.userId || value}`);
      }
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleCancelUserSelection = () => {
    setShowUserSelection(false);
    setUserSearchResults([]);
    setScanUserInput("");
    reset({ userSearch: "" });
  };

  const breadcrumbs = [
    { label: "Circulation", href: "/circulation" },
    { label: "Check-Out" },
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div>
        {/* Top Navigation */}
        <div className="flex items-center gap-2 border-b border-gray-200 -mx-4 px-4 py-3 mb-6">
          <ArrowLeft
            className="h-5 w-5 flex-shrink-0 cursor-pointer text-gray-600 hover:text-gray-900"
            onClick={() => router.push("/circulation")}
          />
          <h1 className="text-lg font-semibold text-gray-900">Check-Out</h1>
        </div>

        {/* Check-Out Items Section */}
        <div className="bg-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Check-Out Items</h2>
            {checkoutItems.length > 0 && (
              <ButtonWidget
                type="button"
                onClick={handleClearAll}
                className="text-sm border border-[#00796B] bg-white hover:bg-gray-50 text-[#00796B] rounded-lg px-4 py-2"
              >
                Clear All
              </ButtonWidget>
            )}
          </div>

          {checkoutItems.length > 0 && (
            <p className="text-sm text-gray-600 pb-4">Items ({String(checkoutItems.length).padStart(2, "0")})</p>
          )}

          {/* Items List */}
          {checkoutItems.length > 0 ? (
            <div className="space-y-3 mb-6">
              {checkoutItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 bg-white"
                >
                  {/* Checkmark Icon */}
                  <div className="w-8 h-8 rounded-full bg-[#DCFCE7] flex items-center justify-center flex-shrink-0">
                    <CircleCheck className="w-4 h-4 text-[#00A63E]" strokeWidth={2.5} />
                  </div>

                  {/* Book Cover */}
                  <div className="w-16 h-20 rounded overflow-hidden flex-shrink-0">
                    <ImageWidget
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Book Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {item.title} - {item.refId}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      by {item.author} - {item.year}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1 rounded hover:bg-gray-200 text-gray-600 flex-shrink-0"
                    aria-label="Remove item"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No items selected for checkout</p>
            </div>
          )}

          {/* Select User Button */}
          {checkoutItems.length > 0 && !showUserSelection && (
            <div className="flex justify-center">
              <ButtonWidget
                type="button"
                onClick={handleSelectUser}
                className="bg-[#00796B] hover:bg-[#00695C] text-white rounded-lg px-8 py-3 text-base font-medium"
              >
                Select User
              </ButtonWidget>
            </div>
          )}

          {/* User Selection Section */}
          {showUserSelection && (
            <>
              {/* Divider */}
              <div className="my-6"></div>

              {/* Search User Section */}
              <div className="mb-6">
                <h3 className="text-center text-lg font-semibold text-gray-900 mb-4">Search User</h3>
                <div className="flex justify-center">
                  <div className="relative w-full max-w-md">
                    <FormInput
                      control={control}
                      name="userSearch"
                      placeholder="Search User"
                      className="rounded-lg border border-gray-200 h-10 pr-20 pl-4 text-sm"
                    />
                  {userSearchValue && (
                    <button
                      type="button"
                      onClick={() => {
                        reset({ userSearch: "" });
                        setUserSearchResults([]);
                      }}
                      className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleUserSearch}
                    disabled={isSearchingUser}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#00796B] text-white h-8 w-8 rounded-lg flex items-center justify-center hover:bg-[#00695C] transition-colors shadow-sm disabled:opacity-60"
                  >
                    {isSearchingUser ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </button>
                  </div>
                </div>

                {/* User Search Results */}
                {userSearchResults.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {userSearchResults.map((user) => (
                      <div key={user.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-600">{user.id} · {user.email}</p>
                          </div>
                          <ButtonWidget
                            type="button"
                            onClick={() => handleUserSelect(user)}
                            className="bg-[#00796B] hover:bg-[#00695C] text-white px-4 py-2 rounded-lg text-sm"
                          >
                            Select
                          </ButtonWidget>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Or Separator */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500">Or</span>
                </div>
              </div>

              {/* Scan User Card Section */}
              <div className="mb-6 flex justify-center">
                <div className="w-full max-w-2xl bg-[#F9F9F9] border border-gray-200 rounded-xl p-6 flex flex-col items-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Scan User Card</h3>
                  <div className="w-12 h-12 bg-[#B3DDB580] rounded-md flex items-center justify-center mb-6">
                    {isScanningUser ? (
                      <Loader2 className="w-10 h-10 text-[#00796B] animate-spin" strokeWidth={1.5} />
                    ) : (
                      <ScanLine className="w-10 h-10 text-[#00796B]" strokeWidth={1.5} />
                    )}
                  </div>
                  {isScanningUser && (
                    <p className="text-sm text-gray-500 mb-4">Verifying...</p>
                  )}
                  <input
                    type="text"
                    value={scanUserInput}
                    onChange={(e) => setScanUserInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleScanUserCard(); }}
                    autoFocus
                    className="sr-only"
                  />
                  <ButtonWidget
                    type="button"
                    loader={false}
                    onClick={handleCancelUserSelection}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg px-6 py-2"
                  >
                    Cancel
                  </ButtonWidget>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default CheckoutItem;
