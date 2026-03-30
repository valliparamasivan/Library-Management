"use client";

import React, { useState, useEffect } from "react";
import PageLayout from "@/components/layouts/PageLayout";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import ImageWidget from "@/components/widgets/ImageWidget";
import { ArrowLeft, CircleCheck, Mail, Phone, ScanLine, X, Plus, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import bookImage from "@/assets/image/book.png";
import CheckoutConfirmDialog from "./utils/checkoutConfirmDialog";
import SuccessDialog from "./utils/successDialog";
import { useSearchBookOrUser, useIssueBook, useScanBook } from "@/store/hooks/CirculationHooks";
import useErrorHandler from "@/components/custom-hooks/useErrorHandler";

const BARCODE_BARS = [2, 1, 2, 3, 1, 2, 1, 2, 3, 2, 1, 3, 2, 1, 2, 3, 1, 2];

const LibraryCardBarcode = () => {
  const totalWidth = BARCODE_BARS.reduce((acc, w) => acc + w * 2 + 1, 0);
  let x = 0;
  return (
    <svg viewBox={`0 0 ${totalWidth} 28`} className="w-full h-8 text-gray-900" preserveAspectRatio="xMidYMid meet">
      {BARCODE_BARS.map((w, i) => {
        const rect = <rect key={i} x={x} y={0} width={w * 2} height={28} fill="currentColor" />;
        x += w * 2 + 1;
        return rect;
      })}
    </svg>
  );
};

const CheckoutSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userIdParam = searchParams.get("userId");

  const { mutateAsync: searchUserApi, isPending: isLoadingUser } = useSearchBookOrUser();
  const { mutateAsync: issueBookApi, isPending: isIssuingBook } = useIssueBook();
  const { mutateAsync: scanBookApi, isPending: isScanning } = useScanBook();
  const { showErrorToast } = useErrorHandler();

  const [user, setUser] = useState(null);
  const [showCheckoutItems, setShowCheckoutItems] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [isCheckoutConfirmOpen, setIsCheckoutConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [lastCheckedOutItems, setLastCheckedOutItems] = useState([]);

  useEffect(() => {
    if (userIdParam) {
      searchUserApi({ type: 1, searchKey: userIdParam })
        .then((response) => {
          const users = response?.data || [];
          const found = users[0];
          if (found) {
            setUser({
              internalUserId: found.internalUserId,
              userName: found.userName,
              email: found.email,
              phone: found.phoneNumber,
              libraryCardId: found.userId,
              policy: found.policyType,
              maxBooks: "-",
              issued: String(found.bookIssuedCount || 0).padStart(2, "0"),
              pendingFine: "-",
            });
          }
        })
        .catch((error) => showErrorToast(error));
    } else {
      try {
        const storedUser = sessionStorage.getItem("checkoutUser");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          sessionStorage.removeItem("checkoutUser");
          if (parsed.libraryCardId) {
            router.replace(`/circulation/checkout?userId=${parsed.libraryCardId}`, { scroll: false });
          }
        }
      } catch {
        // fallback
      }
    }
  }, [userIdParam]);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("checkoutItems");
      if (stored) {
        const items = JSON.parse(stored);
        if (items.length > 0) {
          setCheckoutItems(
            items.map((item) => ({
              id: item.id || item.refId,
              title: item.title || "",
              refId: item.refId || "",
              author: item.author || "",
              year: item.year || "",
              dueDate: item.dueDate || "-",
              image: bookImage,
            }))
          );
          setShowCheckoutItems(true);
          sessionStorage.removeItem("checkoutItems");
        }
      }
    } catch {
      // fallback if sessionStorage fails
    }
  }, []);

  const handleCheckoutAll = async () => {
    try {
      const rfids = checkoutItems.map((item) => item.refId);
      const response = await scanBookApi({ type: 1, rfids, userId: String(user?.internalUserId) });
      const scannedBooks = response?.data || [];
      setCheckoutItems((prev) =>
        prev.map((item) => {
          const matched = scannedBooks.find((b) => b.rfid === item.refId || b.isbn === item.refId);
          return matched ? { ...item, dueDate: matched.dueDate || item.dueDate } : item;
        })
      );
      setIsCheckoutConfirmOpen(true);
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleRemoveItem = (id) => setCheckoutItems((prev) => prev.filter((item) => item.id !== id));
  const handleClearAll = () => {
    setCheckoutItems([]);
    setShowCheckoutItems(false);
  };
  const handleConfirmCheckout = async () => {
    try {
      const rfidList = checkoutItems.map((item) => item.refId);
      await issueBookApi({ userId: user?.internalUserId, rfidList });
      setLastCheckedOutItems(checkoutItems.map(({ title, refId, dueDate }) => ({ title, refId, dueDate })));
      setIsCheckoutConfirmOpen(false);
      setShowCheckoutItems(false);
      setCheckoutItems([]);
      setIsSuccessOpen(true);
    } catch (error) {
      setIsCheckoutConfirmOpen(false);
      showErrorToast(error);
    }
  };

  const breadcrumbs = [
    { label: "Circulation", href: "/circulation" },
    { label: "Check-Out" },
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div className="flex items-center gap-2 border-b border-gray-200 -mx-4 px-4 py-3 mb-6">
        <ArrowLeft
          className="h-5 w-5 flex-shrink-0 cursor-pointer text-gray-600 hover:text-gray-900"
          onClick={() => router.push("/circulation")}
        />
        <h1 className="text-lg font-semibold text-gray-900">Check-Out</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 pb-4">
        <div className="space-y-4 max-w-xs lg:max-w-none">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">User Details</h2>

            {isLoadingUser ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-[#00796B]" />
              </div>
            ) : user ? (
              <>
                <div className="bg-gradient-to-br from-[#0B63CE] to-[#00A884] rounded-xl p-5 text-white shadow-md min-h-[260px] flex flex-col mb-4">
                  <p className="text-xs font-medium tracking-widest opacity-90 mb-1">LIBRARY CARD</p>
                  <h3 className="text-xl font-bold text-white mb-3">{user.userName}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 flex-shrink-0 opacity-90" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 flex-shrink-0 opacity-90" />
                      <span>{user.phone}</span>
                    </div>
                  </div>
                  <div className="mt-auto pt-4">
                    <div className="bg-white rounded-lg px-3 py-3 text-gray-900">
                      <p className="text-xs font-medium text-center text-gray-600 mb-1">User ID</p>
                      <LibraryCardBarcode />
                      <p className="text-sm font-semibold text-center mt-2">{user.libraryCardId}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 mb-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-3">
                    <p className="text-xs text-gray-500 mb-0.5">Policy</p>
                    <p className="text-sm font-semibold text-gray-900">{user.policy}</p>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-3">
                    <p className="text-xs text-gray-500 mb-0.5">Max Books</p>
                    <p className="text-sm font-semibold text-gray-900">{user.maxBooks}</p>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-3">
                    <p className="text-xs text-gray-500 mb-0.5">Issued</p>
                    <p className="text-sm font-semibold text-gray-900">{user.issued}</p>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-3">
                    <p className="text-xs text-gray-500 mb-0.5">Pending Fine</p>
                    <p className="text-sm font-semibold text-gray-900">{user.pendingFine}</p>
                  </div>
                </div>

                <ButtonWidget
                  type="button"
                  onClick={() => {
                    router.push(`/circulation/transactions?userId=${user?.libraryCardId}&internalUserId=${user?.internalUserId}`);
                  }}
                  className="w-full rounded-lg border-1 border-[#00796B] bg-transparent text-[#00796B] hover:bg-[#00796B]/5 py-2"
                >
                  View Transactions
                </ButtonWidget>
              </>
            ) : (
              <div className="text-center py-20 text-gray-400 text-sm">No user selected</div>
            )}
          </div>
        </div>

        <div className="min-w-0 h-full">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full min-h-[320px] flex flex-col relative p-6">
            {!showCheckoutItems ? (
              <>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <p className="text-base text-gray-500 mb-6 text-center">Scan Books to Check-Out</p>
                  <button
                    type="button"
                    onClick={() => setShowCheckoutItems(true)}
                    className="w-20 h-20 rounded-lg bg-[#B3DDB580] flex items-center justify-center cursor-pointer hover:bg-[#B3DDB5]/60 transition-colors"
                  >
                    <ScanLine className="w-10 h-10 text-[#00796B]" strokeWidth={1.5} />
                  </button>
                </div>
                <div className="absolute bottom-6 left-6">
                  <ButtonWidget
                    type="button"
                    onClick={() => router.push("/circulation")}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg px-5 py-2"
                  >
                    Cancel
                  </ButtonWidget>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-900">Check-Out Items</h2>
                  <div className="flex items-center gap-2">
                    <ButtonWidget
                      type="button"
                      onClick={handleClearAll}
                      className="text-sm border border-[#00796B] bg-white hover:bg-gray-50 text-gray-700 rounded-lg px-3 py-1.5"
                    >
                      Clear All
                    </ButtonWidget>
                    <ButtonWidget
                      type="button"
                      onClick={() => {
                        sessionStorage.setItem("checkoutItems", JSON.stringify(
                          checkoutItems.map(({ id, title, refId, author, year, dueDate }) => ({ id, title, refId, author, year, dueDate }))
                        ));
                        if (user) sessionStorage.setItem("checkoutUser", JSON.stringify(user));
                        router.push("/circulation/add-book");
                      }}
                      className="text-sm bg-[#00796B] hover:bg-[#00695C] text-white rounded-lg px-3 py-1.5 flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      Add Book
                    </ButtonWidget>
                  </div>
                </div>
                <div className="hidden sm:flex items-center justify-between text-xs text-[#1A1A1A] font-medium mb-3 px-1">
                  <span>Items ({checkoutItems.length})</span>
                  <span>Due Date</span>
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto min-h-0">
                  {checkoutItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-[#DCFCE7] flex items-center justify-center flex-shrink-0">
                          <CircleCheck className="w-3.5 h-3.5 text-[#00A63E]" strokeWidth={2.5} />
                        </div>
                        <ImageWidget src={item.image} alt={item.title} className="w-12 h-12 rounded object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">
                            <span className="text-[#1A1A1A] font-semibold">{item.title}</span>
                            <span className="text-[#67667A] font-normal"> - {item.refId}</span>
                          </p>
                          <p className="text-xs text-[#67667A] font-normal">by {item.author} - {item.year}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                        <div className="flex sm:contents items-center gap-2">
                          <span className="text-xs text-[#67667A] font-medium sm:hidden">Due Date:</span>
                          <span className="text-sm text-[#1A1A1A] font-medium">{item.dueDate}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1 rounded hover:bg-gray-100 text-[#1A1A1A] flex-shrink-0"
                          aria-label="Remove"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-3 -mx-6 px-6 pt-4 pb-6 mt-4 bg-[#F8FAFC] border-t border-[#E2E8F0]">
                  <ButtonWidget
                    type="button"
                    onClick={() => router.push("/circulation")}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg px-5 py-2"
                  >
                    Cancel
                  </ButtonWidget>
                  <ButtonWidget
                    type="button"
                    loader={false}
                    onClick={handleCheckoutAll}
                    disabled={isScanning}
                    className="bg-[#00796B] hover:bg-[#00796B]/90 text-white rounded-lg px-5 py-2"
                  >
                    {isScanning ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      "Check-Out all"
                    )}
                  </ButtonWidget>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <CheckoutConfirmDialog
        isOpen={isCheckoutConfirmOpen}
        onOpenChange={setIsCheckoutConfirmOpen}
        checkoutItems={checkoutItems}
        onConfirm={handleConfirmCheckout}
        isLoading={isIssuingBook}
      />
      <SuccessDialog
        isOpen={isSuccessOpen}
        onOpenChange={setIsSuccessOpen}
        items={lastCheckedOutItems}
      />
    </PageLayout>
  );
};

export default CheckoutSection;
