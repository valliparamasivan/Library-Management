"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import PageLayout from "@/components/layouts/PageLayout";
import FormInput from "@/components/form/FormInput";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { Check, Search, ScanLine, X, User, BookOpen, BookMinus, RotateCw, CircleArrowRight, ArrowLeftRight, ArrowRight, ChevronDown, RefreshCw, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import refresh from "@/assets/icons/11.svg";
import circleArrow from "@/assets/icons/21.svg";
import ImageWidget from "@/components/widgets/ImageWidget";
import BookFilter from "./utils/BookFilter";
import TableWidget from "@/components/widgets/TableWidget";
import useURLParams from "@/components/custom-hooks/useURLParams";
import usePermissions from "@/components/custom-hooks/usePermissions";
import { useSearchBookOrUser, useGetUserTransactions, useReturnBook, useRenewBook, useScanUser } from "@/store/hooks/CirculationHooks";
import useErrorHandler from "@/components/custom-hooks/useErrorHandler";
import userImage from '@/assets/image/user.png';
import actionIcon from "@/assets/icons/19.svg";
import TransferDialog from "./utils/transferDialog";
import TransferSuccessDialog from "./utils/transferSuccessDialog";
import RenewBookDueDateDialog from "./utils/renewBookDueDateDialog";
import RenewSuccessDialog from "./utils/renewSuccessDialog";
import RenewLimitReachedModal from "./utils/RenewLimitReachedModal";
import ReturnDialog from "./utils/returnDialog";

const getTransactionStatusClass = (status) => {
  switch (status) {
    case "Check-In":
    case "Checked-In":
      return "bg-[#4CAF5033] text-[#4CAF50]";
    case "Renewed":
      return "bg-[#900AEF33] text-[#900AEF]";
    case "Checked-Out":
      return "bg-[#E77B3333] text-[#E77B33]";
    case "Overdue":
      return "bg-[#F4433633] text-[#F44336]";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const CirculationSection = () => {
  const router = useRouter();
  const { canAnyEdit } = usePermissions();
  const circulationPerms = ["Circulation", "Active Transactions"];

  const { control, watch, reset } = useForm({
    defaultValues: { userOrBookRfid: "" },
  });

  const searchValue = watch("userOrBookRfid");

  const { mutateAsync: searchBookOrUser, isPending: isSearching } = useSearchBookOrUser();
  const { mutateAsync: fetchUserTransactions, isPending: isLoadingTransactions } = useGetUserTransactions();
  const { mutateAsync: returnBookApi, isPending: isReturningBook } = useReturnBook();
  const { mutateAsync: renewBookApi, isPending: isRenewingBook } = useRenewBook();
  const { mutateAsync: scanUserApi, isPending: isScanningUser } = useScanUser();
  const { showErrorToast, showSuccessToast } = useErrorHandler();

  const [searchType, setSearchType] = useState("user");
  const [searchMode, setSearchMode] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [loanFilter, setLoanFilter] = useState("ALL");

  const [isScanUserCardOpen, setIsScanUserCardOpen] = useState(false);
  const [scanTargetRoute, setScanTargetRoute] = useState("/circulation/checkout");
  const [scanUserInput, setScanUserInput] = useState("");
  const [showTransactions, setShowTransactions] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedItemForTransfer, setSelectedItemForTransfer] = useState(null);
  const [isTransferSuccessOpen, setIsTransferSuccessOpen] = useState(false);
  const [isRenewDialogOpen, setIsRenewDialogOpen] = useState(false);
  const [selectedItemForRenew, setSelectedItemForRenew] = useState(null);
  const [isRenewSuccessOpen, setIsRenewSuccessOpen] = useState(false);
  const [isRenewLimitModalOpen, setIsRenewLimitModalOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [selectedItemForReturn, setSelectedItemForReturn] = useState(null);

  const breadcrumbs = [{ label: "Circulation", href: "/circulation" }];

  // ===== ORIGINAL FUNCTIONS (UNCHANGED) =====
  const openScanForCheckout = () => {
    // If user searched → go directly
    if (searchMode === "user" && searchResult) {
      router.push(`/circulation/checkout?userId=${searchResult.id}`);
      return;
    }

    // If specific RFID searched → go with rfid
    if (searchMode === "book-rfid" && searchResult) {
      router.push(`/circulation/checkout?rfid=${searchResult.copy.rfid}`);
      return;
    }

    // Otherwise open scanner modal (original behavior)
    setScanTargetRoute("/circulation/checkout");
    setIsScanUserCardOpen(true);
  };

  const openScanForCheckin = () => {
    if (searchMode === "book-rfid" && searchResult) {
      router.push(`/circulation/check-in?rfid=${searchResult.copy.rfid}`);
      return;
    }

    setScanTargetRoute("/circulation/checkin");
    setIsScanUserCardOpen(true);
  };

  const closeScanUserCard = () => {
    setIsScanUserCardOpen(false);
    setScanUserInput("");
  };

  const handleScanUser = async () => {
    const value = scanUserInput.trim();
    if (!value) return;

    try {
      const response = await scanUserApi({ userId: value });
      const userData = response?.data;
      if (userData) {
        router.push(`${scanTargetRoute}?userId=${userData.userId || value}`);
      }
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleSearch = async (filterOverride) => {
    const value = searchValue?.trim();

    if (!value) {
      setSearchMode(null);
      setSearchResult(null);
      return;
    }

    const type = searchType === "user" ? 1 : 2;
    const currentFilter = filterOverride || loanFilter;

    try {
      const response = await searchBookOrUser({ type, searchKey: value, loanFilter: currentFilter });
      const results = response?.data;

      if (!results || (Array.isArray(results) && results.length === 0)) {
        setSearchMode("not-found");
        setSearchResult(null);
        return;
      }

      if (searchType === "user") {
        const users = (Array.isArray(results) ? results : [results]).map((u) => ({
          id: u.userId,
          internalUserId: u.internalUserId,
          name: u.userName,
          email: u.email,
          phone: u.phoneNumber,
          policy: u.policyType,
          profileImgUrl: u.profileImgUrl,
          status: u.status,
          bookIssuedCount: u.bookIssuedCount,
        }));

        if (users.length === 1) {
          setSearchMode("user");
          setSearchResult(users[0]);
        } else {
          setSearchMode("user-list");
          setSearchResult(users);
        }
      } else {
        const { transactionBooks = [], availableBooks = [] } = results;

        if (transactionBooks.length === 0 && availableBooks.length === 0) {
          setSearchMode("not-found");
          setSearchResult(null);
          return;
        }

        const parseYear = (val) => {
          if (!val) return null;
          const str = String(val).trim();
          if (!str) return null;
          if (/^\d{4}$/.test(str)) return str;
          const match = str.match(/^(\d{4})/);
          return match ? match[1] : str;
        };

        const mappedAvailableBooks = availableBooks.map((book) => ({
          bookId: book.bookId,
          bookCopyId: book.bookCopyId,
          rfid: book.rfid,
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          year: parseYear(book.year),
          totalCopies: book.totalCopies || 0,
          issuedCopies: book.issuedCopies || 0,
          availableCopies: ((book.totalCopies || 0) - (book.issuedCopies || 0)) + "/" + (book.totalCopies || 0),
          bookImageUrl: book.bookImageUrl ? `https://libraryapi.corpfield.com/books-image/${book.bookImageUrl}` : null,
        })).filter((book) => {
          const available = (book.totalCopies || 0) - (book.issuedCopies || 0);
          return available > 0;
        });

        const transactionsByBook = {};
        transactionBooks.forEach((tx) => {
          if (!transactionsByBook[tx.bookId]) {
            transactionsByBook[tx.bookId] = {
              bookId: tx.bookId,
              title: tx.title,
              author: tx.author,
              isbn: tx.isbn,
              year: parseYear(tx.year),
              bookImageUrl: tx.bookImageUrl ? `https://libraryapi.corpfield.com/books-image/${tx.bookImageUrl}` : null,
              transactions: [],
            };
          }
          transactionsByBook[tx.bookId].transactions.push({
            circulationLogId: tx.circulationLogId,
            bookCopyId: tx.bookCopyId,
            rfid: tx.rfid,
            userName: tx.userName,
            userId: tx.userId,
            dueDate: formatDate(tx.dueDate),
            renewalCount: tx.renewalCount?.split?.("/")?.[0] ? Number(tx.renewalCount.split("/")[0]) : 0,
            maxRenewals: tx.renewalCount?.split?.("/")?.[1] ? Number(tx.renewalCount.split("/")[1]) : 3,
            fine: tx.fineAmount || 0,
            statusBadge: tx.status === "Overdue" ? "Overdue" : "On-Time",
            overdueDays: 0,
          });
        });

        setSearchMode("book-name");
        setSearchResult({
          availableBooks: mappedAvailableBooks,
          transactionBooks: Object.values(transactionsByBook),
        });
      }
    } catch (error) {
      showErrorToast(error);
      setSearchMode("not-found");
      setSearchResult(null);
    }
  };

  // Debounced live search
  const debounceRef = useRef(null);
  useEffect(() => {
    const value = searchValue?.trim();
    if (!value) {
      setSearchMode(null);
      setSearchResult(null);
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

  // Auto-load transactions when user is selected
  useEffect(() => {
    if (searchMode === "user" && searchResult?.internalUserId && showTransactions) {
      refreshTransactions();
    }
  }, [searchResult?.internalUserId]);

  const clearSearch = () => {
    reset({ userOrBookRfid: "" });
    setSearchMode(null);
    setSearchResult(null);
    setShowTransactions(false);
    setTransactions([]);
    setLoanFilter("ALL");
  };

  const selectUser = (user) => {
    setSearchMode("user");
    setSearchResult(user);
    setShowTransactions(true);
    setTransactions([]);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "-");
  };

  const refreshTransactions = async () => {
    setTransactions([]);

    try {
      const response = await fetchUserTransactions({
        userId: searchResult.internalUserId,
      });
      const items = response?.data || [];

      const mapped = items.map((tx) => ({
        id: tx.circulationLogId,
        bookTitle: tx.bookTitle,
        rfid: tx.rfid || tx.isbn,
        checkOutDate: tx.checkOutDate || "-",
        dueDate: tx.dueDate || "-",
        checkInDate: tx.checkInDate || "-",
        renewedDate: tx.renewedDate || "-",
        renewalCount: tx.renewalCount?.split?.("/")?.[0] ? Number(tx.renewalCount.split("/")[0]) : 0,
        maxRenewals: tx.renewalCount?.split?.("/")?.[1] ? Number(tx.renewalCount.split("/")[1]) : 3,
        overdueDays: tx.daysLeft != null ? Math.abs(Math.min(tx.daysLeft, 0)) : 0,
        fine: tx.fineAmount > 0 ? `₹ ${tx.fineAmount}` : "₹ 0",
        status: tx.statusTag || tx.status,
      }));

      setTransactions(mapped);
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleViewTransactions = async () => {
    if (showTransactions) {
      setShowTransactions(false);
      return;
    }
    setShowTransactions(true);
    refreshTransactions();
  };

  const handleTransferClick = (record) => {
    const item = {
      title: record.bookTitle,
      refId: record.rfid,
      dueDate: record.dueDate,
      status: record.status === "Overdue" ? "overdue" : "onTime",
      userId: searchResult?.internalUserId,
    };
    setSelectedItemForTransfer(item);
    setIsTransferDialogOpen(true);
  };

  const handleTransferConfirm = async () => {
    try {
      await returnBookApi({
        userId: String(selectedItemForTransfer?.userId),
        rfidList: [selectedItemForTransfer?.refId],
      });
      setIsTransferDialogOpen(false);
      showSuccessToast("Book checked in successfully");
      if (showTransactions && searchResult?.internalUserId) {
        refreshTransactions();
      }
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleRenewClick = (record) => {
    const item = {
      title: record.bookTitle,
      refId: record.rfid,
      dueDate: record.dueDate,
      newDueDate: record.newDueDate,
      status: record.status === "Overdue" ? "overdue" : "onTime",
      userId: searchResult?.internalUserId,
    };
    setSelectedItemForRenew(item);
    setIsRenewDialogOpen(true);
  };

  const handleRenewConfirm = async () => {
    try {
      const response = await renewBookApi({
        userId: String(selectedItemForRenew?.userId),
        rfidList: [selectedItemForRenew?.refId],
      });
      const renewed = response?.data?.[0];
      const newDate = renewed?.newDueDate || "";
      setIsRenewDialogOpen(false);
      showSuccessToast(newDate ? `Book renewed successfully. New due date: ${newDate}` : "Book renewed successfully");
      if (showTransactions && searchResult?.internalUserId) {
        refreshTransactions();
      }
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleReturnClick = (copy, bookTitle) => {
    const item = {
      title: bookTitle,
      refId: copy.rfid || copy.isbn,
      dueDate: copy.dueDate,
      status: copy.statusBadge === "Overdue" || copy.overdueDays > 0 ? "overdue" : "onTime",
      userId: copy.userId,
    };
    setSelectedItemForTransfer(item);
    setIsTransferDialogOpen(true);
  };

  const handleReturnConfirm = () => {
    setIsReturnDialogOpen(false);
    // Optionally navigate or show success message
  };

  const handleRenewClickForCopy = (copy, bookTitle) => {
    const isOverdue = copy.statusBadge === "Overdue" || copy.overdueDays > 0;
    
    if (isOverdue) {
      setIsRenewLimitModalOpen(true);
    } else {
      const item = {
        title: bookTitle,
        refId: copy.rfid || copy.isbn,
        dueDate: copy.dueDate,
        status: isOverdue ? "overdue" : "onTime",
        userId: copy.userId,
      };
      setSelectedItemForRenew(item);
      setIsRenewDialogOpen(true);
    }
  };

  const {
    handleSort,
    getSortIcon,
  } = useURLParams({
    defaultColumns: [
      "sNo",
      "bookDetails",
      "checkOutDate",
      "dueDate",
      "checkInDate",
      "renewedDate",
      "renewalCount",
      "overdueDays",
      "fine",
      "status",
      "actions",
    ],
  });

  const transactionsResponse = {
    data: {
      content: transactions,
      totalPages: 1,
      totalElements: transactions.length,
      pageSize: transactions.length,
    },
  };

  const transactionColumns = [
    {
      key: "sNo",
      label: "S.No",
      sortable: false,
      render: (record, index) => String(index + 1).padStart(2, "0"),
    },
    {
      key: "bookDetails",
      label: "Book Details",
      sortable: false,
      render: (record) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{record.bookTitle}</span>
          <span className="text-xs text-gray-500">{record.rfid}</span>
        </div>
      ),
    },
    { key: "checkOutDate", label: "Check-Out Date", sortable: false },
    { key: "dueDate", label: "Due Date", sortable: false },
    { key: "checkInDate", label: "Check-In Date", sortable: false },
    { key: "renewedDate", label: "Renewed Date", sortable: false },
    {
      key: "renewalCount",
      label: "Renewal Count",
      sortable: false,
      render: (record) => (
        <span className={`font-medium ${record.renewalCount >= record.maxRenewals ? "text-red-600" : "text-gray-900"}`}>
          {record.renewalCount}/{record.maxRenewals}
        </span>
      ),
    },
    {
      key: "overdueDays",
      label: "Overdue Days",
      sortable: false,
      render: (record) => (
        <span className={`font-medium ${record.overdueDays > 0 ? "text-red-600" : "text-gray-900"}`}>
          {String(record.overdueDays).padStart(2, "0")}
        </span>
      ),
    },
    {
      key: "fine",
      label: "Fine",
      sortable: false,
      render: (record) => {
        const hasFine = record.fine && record.fine !== "₹ 0";
        return (
          <span className={`font-medium ${hasFine ? "text-red-600" : "text-gray-900"}`}>
            {record.fine}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: false,
      render: (record) => (
        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getTransactionStatusClass(record.status)}`}>
          {record.status}
        </span>
      ),
    },
    ...(canAnyEdit(circulationPerms) ? [{
      key: "actions",
      label: "Actions",
      sortable: false,
      minWidth: "120px",
      render: (record) => {
        const isCheckedIn = record.status === "Check-In" || record.status === "Checked-In" || record.status === "Returned";
        if (isCheckedIn) return <span className="text-xs text-gray-400">—</span>;
        const isOverdue = record.status === "Overdue";
        return (
          <div className="flex items-center gap-1">
            <ButtonWidget
              type="button"
              onClick={() => handleTransferClick(record)}
              className="h-8 w-8 p-0 rounded bg-white hover:bg-gray-50 text-[#00796B] border border-gray-300 flex items-center justify-center"
              title="Transfer"
            >
              <ImageWidget src={actionIcon} alt="Transfer" className="w-5 h-5" />
            </ButtonWidget>
            <ButtonWidget
              type="button"
              loader={false}
              onClick={() => {
                if (isOverdue) {
                  setIsRenewLimitModalOpen(true);
                } else {
                  handleRenewClick(record);
                }
              }}
              className={`h-8 w-8 p-0 rounded bg-white border border-gray-300 flex items-center justify-center ${isOverdue
                  ? "opacity-50 text-gray-400 hover:bg-white"
                  : "hover:bg-gray-50 text-[#00796B]"
                }`}
              title={isOverdue ? "Cannot renew overdue items" : "Renew"}
            >
              <RefreshCw className="w-4 h-4" />
            </ButtonWidget>
          </div>
        );
      },
    }] : []),
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div className="bg-white rounded-lg p-4 md:p-6">

        {/* HEADER (OLD STYLE PRESERVED) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 mb-6">

          <div className="flex items-center gap-2 flex-shrink-0">
            <ImageWidget
              src={circleArrow}
              alt="Circle Arrow"
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
            <h1 className="text-sm sm:text-base font-semibold text-gray-900">
              Circulation Desk
            </h1>
          </div>

          {/* SEARCH BLOCK */}
          <div className="flex-1 flex flex-col items-center gap-2 sm:gap-3 max-w-xl mx-auto lg:mx-0 lg:max-w-md w-full">
            <label className="text-sm sm:text-base font-semibold text-gray-900">
              Search Book/User
            </label>

            <div className="flex items-center gap-2 w-full">

              <select
                value={searchType}
                onChange={(e) => {
                  setSearchType(e.target.value);
                  clearSearch();
                }}
                className="h-9 sm:h-10 border border-gray-200 rounded-lg px-2 text-sm"
              >
                <option value="user">User</option>
                <option value="book">Book</option>
              </select>

              <div className="relative flex-1 min-w-0">
                <FormInput
                  control={control}
                  name="userOrBookRfid"
                  placeholder={`Search ${searchType === "user" ? "User" : "Book"}...`}
                  className="rounded-lg border border-gray-200 h-10 pr-20 pl-4 text-sm"
                />

                {searchValue && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#00796B] text-white h-8 w-8 rounded-lg flex items-center justify-center hover:bg-[#00695C] transition-colors shadow-sm disabled:opacity-60"
                >
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>



          {/* SCANNER BUTTONS (EXACT OLD STYLE) */}
          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap sm:flex-nowrap justify-center lg:justify-start w-full lg:w-auto">
            <ButtonWidget
              type="button"
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-900 flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial"
            >
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Check className="w-1 h-1 text-white" strokeWidth={2} />
              </span>
              <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                RFID Scanner
              </span>
            </ButtonWidget>

            <ButtonWidget
              type="button"
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-900 flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial"
            >
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Check className="w-1 h-1 text-white" strokeWidth={2} />
              </span>
              <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                Book Scanner
              </span>
            </ButtonWidget>
          </div>
        </div>



        {/* CHECK IN / CHECK OUT (100% ORIGINAL) */}
        {!(searchMode === "user" && searchResult) && !(searchMode === "user-list" && searchResult) && !(searchMode === "book-name" && searchResult) && (
          <div className="flex justify-start">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-full">
              <ButtonWidget
                type="button"
                onClick={openScanForCheckout}
                className="bg-white rounded-lg p-14 pl-4 border hover:bg-white/80 border-gray-200 cursor-pointer hover:shadow-md transition-shadow flex flex-col items-start gap-4 text-left w-full"
              >
                <div className="w-10 h-10 rounded-lg bg-[#00796B] flex items-center justify-center flex-shrink-0">
                  <ImageWidget src={refresh} alt="Refresh" className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-semibold text-gray-900">
                  Check-Out
                </span>
              </ButtonWidget>

              <ButtonWidget
                type="button"
                onClick={openScanForCheckin}
                className="bg-white rounded-lg p-14 pl-4 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow hover:bg-white/80 flex flex-col items-start gap-4 text-left w-full"
              >
                <div className="w-10 h-10 rounded-lg bg-[#00953A] flex items-center justify-center flex-shrink-0">
                  <ImageWidget src={refresh} alt="Refresh" className="w-5 h-5 text-white" />
                </div>
                <span className="text-base font-semibold text-gray-900">
                  Check-In
                </span>
              </ButtonWidget>
            </div>
          </div>
        )}

        {/* SEARCH RESULTS */}

        {searchMode === "not-found" && (
          <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-lg">
            No results found.
          </div>
        )}

        {searchMode === "user-list" && searchResult && (
          <div className="mt-6">
            <div className="bg-[#00796B1A] rounded-lg shadow-md overflow-hidden">
              <div className="px-4 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#00796B]" />
                  <h2 className="text-base font-semibold text-black">
                    Search Results ({searchResult.length})
                  </h2>
                </div>
                <button
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                {searchResult.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => selectUser(user)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4 hover:border-[#00796B] hover:shadow-md transition-all text-left"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-[#0B63CE] to-[#00A884] flex-shrink-0">
                      <ImageWidget src={user.profileImgUrl || userImage} alt={user.name || "User"} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {user.name} <span className="font-normal text-gray-500">- {user.id}</span>
                      </h3>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="flex-shrink-0 text-right hidden sm:block">
                      <p className="text-xs text-gray-400">Policy</p>
                      <p className="text-sm font-medium text-gray-700">{user.policy}</p>
                    </div>
                    <div className="flex-shrink-0 text-right hidden sm:block">
                      <p className="text-xs text-gray-400">Books Issued</p>
                      <p className="text-sm font-medium text-gray-700">{String(user.bookIssuedCount).padStart(2, "0")}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {user.status}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {searchMode === "user" && searchResult && (
          <div className="mt-6">
            {/* OUTER BIG CARD */}
            <div className="bg-[#00796B1A] rounded-lg shadow-md overflow-hidden">
              {/* USER DETAILS HEADER */}
              <div className="px-4 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#00796B]" />
                  <h2 className="text-base font-semibold text-black">User Details</h2>
                </div>
                <ButtonWidget
                  type="button"
                  onClick={() => router.push(`/circulation/checkout?userId=${searchResult.id}`)}
                  className="bg-[#00796B] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#00695C] transition-colors"
                >
                  <BookMinus className="w-4 h-4" />
                  <span className="text-sm font-medium">Check Out New Book</span>
                </ButtonWidget>
              </div>

              {/* INNER SMALL CARD WITH USER DETAILS */}
              <div className="p-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 relative shadow-sm">
                  {/* CLOSE ICON */}
                  <button
                    onClick={clearSearch}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* PROFILE PICTURE */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-[#0B63CE] to-[#00A884]">
                        <ImageWidget src={searchResult.profileImgUrl || userImage} alt={searchResult.name || "User"} className="w-full h-full object-cover" />
                      </div>
                    </div>

                    {/* USER INFORMATION AND POLICY */}
                    <div className="flex-2 flex flex-col sm:flex-row sm:items-start gap-10 pr-8">
                      {/* USER INFORMATION */}
                      <div >
                        <h3 className="text-base font-medium text-black mb-2">
                          {searchResult.name} - <span className="text-sm font-normal text-gray-600">{searchResult.id}</span>
                        </h3>
                        <div className="space-y-2">
                          <p className="text-sm font-normal text-gray-600 pb-1">
                            <span className="font-normal">Email ID:</span> <span className="font-medium text-black">{searchResult.email}</span>
                          </p>
                          <p className="text-sm font-normal text-gray-600 pb-1">
                            <span className="font-normal">Phone No:</span> <span className="font-medium text-black">{searchResult.phone}</span>
                          </p>
                        </div>
                      </div>

                      {/* POLICY SECTION - Aligned with name */}
                      <div className="flex-shrink-0 sm:pt-0">
                        <div>
                          <p className="text-xs font-normal text-gray-400 Pb-1">Policy</p>
                          <p className="text-sm font-medium text-black">{searchResult.policy}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* VIEW TRANSACTIONS BUTTON */}
            <div className="mt-4 flex justify-start">
              <ButtonWidget
                type="button"
                onClick={handleViewTransactions}
                className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 flex items-center justify-between gap-2 hover:bg-gray-50 transition-colors text-gray-900"
              >
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="w-4 h-4" />
                  <span className="text-sm font-medium">View Transactions</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showTransactions ? 'rotate-180' : ''}`} />
              </ButtonWidget>
            </div>

            {/* TRANSACTIONS TABLE */}
            {showTransactions && (
              <div className="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                {isLoadingTransactions ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-[#00796B]" />
                    <span className="ml-2 text-sm text-gray-500">Loading transactions...</span>
                  </div>
                ) : (
                  <TableWidget
                    columns={transactionColumns}
                    response={transactionsResponse}
                    handleSort={handleSort}
                    getSortIcon={getSortIcon}
                    height="h-[400px]"
                    showPagination={false}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {searchMode === "book-name" && searchResult && (
          <div className="mt-6 bg-[#E8F1F0] rounded-lg p-6 relative">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Book Details
                </h3>
              </div>
              <BookFilter
                totalCount={searchResult.availableBooks.length + searchResult.transactionBooks.reduce((sum, b) => sum + b.transactions.length, 0)}
                activeFilter={loanFilter}
                onFilterChange={(value) => {
                  const filterMap = { all: "ALL", available: "AVAILABLE", issued: "IN_TRANSACTION" };
                  const apiFilter = filterMap[value] || "ALL";
                  setLoanFilter(apiFilter);
                  handleSearch(apiFilter);
                }}
              />
            </div>

            {/* AVAILABLE BOOKS SECTION */}
            {searchResult.availableBooks.length > 0 && (
              <div className="mb-8">
                <div className="bg-[#E8F1F0] rounded-t-lg px-4 py-3 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-600">Available Books ({String(searchResult.availableBooks.length).padStart(2, "0")})</h4>
                  </div>
                  <div className="flex-shrink-0 w-32 flex justify-center">
                    <h4 className="text-sm font-medium text-gray-600">Status</h4>
                  </div>
                  <div className="flex-shrink-0 w-40 flex justify-center">
                    <h4 className="text-sm font-medium text-gray-600">Actions</h4>
                  </div>
                </div>

                {searchResult.availableBooks.map((book, index) => (
                  <div
                    key={`${book.bookCopyId}-${book.rfid}`}
                    className={`bg-white p-4 shadow-sm border-x border-b border-gray-200 ${index === searchResult.availableBooks.length - 1 ? "rounded-b-lg" : ""} hover:bg-gray-50`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        {book.bookImageUrl ? (
                          <ImageWidget
                            src={book.bookImageUrl}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <BookOpen className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>

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
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 text-green-800 text-sm font-medium rounded-lg">
                          <BookMinus className="w-4 h-4" />
                          {book.availableCopies}
                        </span>
                      </div>

                      <div className="flex-shrink-0 w-40 flex justify-center">
                        <ButtonWidget
                          type="button"
                          onClick={() => {
                            sessionStorage.setItem("checkoutBook", JSON.stringify({
                              bookId: book.bookId,
                              bookCopyId: book.bookCopyId,
                              rfid: book.rfid,
                              title: book.title,
                              author: book.author,
                              isbn: book.isbn,
                              year: book.year || "",
                            }));
                            router.push(`/circulation/checkout-item?bookId=${book.bookId}`);
                          }}
                          className="bg-[#00796B] hover:bg-[#00796B]/90 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                        >
                          <ImageWidget src={refresh} alt="Refresh" className="w-5 h-5 text-white" />
                          Check Out
                        </ButtonWidget>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* IN TRANSACTION SECTION */}
            {searchResult.transactionBooks.length > 0 && (
              <div>
                <div className="bg-[#E8F1F0] rounded-t-lg px-4 py-3 flex items-center">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-600">
                      In Transaction ({String(searchResult.transactionBooks.reduce((sum, b) => sum + b.transactions.length, 0)).padStart(2, "0")})
                    </h4>
                  </div>
                  <div className="flex-shrink-0 w-36 flex justify-start">
                    <h4 className="text-sm font-medium text-gray-600">User</h4>
                  </div>
                  <div className="flex-shrink-0 w-32 flex justify-center">
                    <h4 className="text-sm font-medium text-gray-600">Due Date</h4>
                  </div>
                  <div className="flex-shrink-0 w-32 flex justify-center">
                    <h4 className="text-sm font-medium text-gray-600">Renewal Count</h4>
                  </div>
                  <div className="flex-shrink-0 w-28 flex justify-center">
                    <h4 className="text-sm font-medium text-gray-600">Status</h4>
                  </div>
                  <div className="flex-shrink-0 w-24 flex justify-center">
                    <h4 className="text-sm font-medium text-gray-600">Fine</h4>
                  </div>
                  <div className="flex-shrink-0 w-28 flex justify-center">
                    <h4 className="text-sm font-medium text-gray-600">Actions</h4>
                  </div>
                </div>

                {/* Desktop Rows */}
                <div className="hidden md:block">
                  {searchResult.transactionBooks.map((book) =>
                    book.transactions.map((tx, txIndex) => (
                      <div
                        key={`${tx.circulationLogId}-${tx.bookCopyId}`}
                        className="bg-white px-4 py-4 flex items-start border-x border-b border-gray-200 last:rounded-b-lg hover:bg-gray-50"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                              <ImageWidget
                                src={book.bookImageUrl || ""}
                                alt={book.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h6 className="text-sm font-semibold text-gray-900 mb-1">
                                {book.title}
                              </h6>
                              <p className="text-xs text-gray-600 mb-1">
                                {tx.rfid}
                              </p>
                              <p className="text-xs text-gray-600">
                                by {book.author} - {book.year || "N/A"}
                              </p>
                              {tx.statusBadge === "Overdue" && tx.fine > 0 && (
                                <div className="mt-2">
                                  <span className="inline-flex px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded mb-1">
                                    Overdue
                                  </span>
                                  <p className="text-xs text-red-600">
                                    Fine Amount - ₹{String(tx.fine).padStart(2, "0")}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex-shrink-0 w-36 flex flex-col items-start pt-0.5">
                          <p className="text-sm font-semibold text-gray-900 mb-0.5">
                            {tx.userName}
                          </p>
                          <p className="text-xs text-gray-600">
                            User ID: {tx.userId}
                          </p>
                        </div>

                        <div className="flex-shrink-0 w-32 flex justify-center pt-0.5">
                          <p className="text-sm text-gray-900">{tx.dueDate || "-"}</p>
                        </div>

                        <div className="flex-shrink-0 w-32 flex justify-center pt-0.5">
                          <p className={`text-sm font-medium ${tx.renewalCount >= tx.maxRenewals ? "text-red-600" : "text-gray-900"}`}>
                            {tx.renewalCount}/{tx.maxRenewals}
                          </p>
                        </div>

                        <div className="flex-shrink-0 w-28 flex justify-center pt-0.5">
                          <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded ${tx.statusBadge === "Overdue"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                            }`}>
                            {tx.statusBadge}
                          </span>
                        </div>

                        <div className="flex-shrink-0 w-24 flex justify-center pt-0.5">
                          <p className={`text-sm font-medium ${tx.fine > 0 ? "text-red-600" : "text-gray-900"}`}>
                            {tx.fine > 0 ? `₹${tx.fine}` : "₹ 00"}
                          </p>
                        </div>

                        <div className="flex-shrink-0 w-28 flex justify-center pt-0.5">
                          <div className="flex items-center gap-1">
                            <ButtonWidget
                              type="button"
                              onClick={() => handleReturnClick(tx, book.title)}
                              className="h-8 w-8 p-0 rounded bg-white hover:bg-gray-50 text-[#00796B] border border-gray-300 flex items-center justify-center"
                              title="Return"
                            >
                              <ImageWidget src={actionIcon} alt="Return" className="w-5 h-5" />
                            </ButtonWidget>
                            <ButtonWidget
                              type="button"
                              loader={false}
                              onClick={() => handleRenewClickForCopy(tx, book.title)}
                              className={`h-8 w-8 p-0 rounded bg-white border border-gray-300 flex items-center justify-center ${
                                tx.statusBadge === "Overdue"
                                  ? "opacity-50 text-gray-400 hover:bg-white"
                                  : "hover:bg-gray-50 text-[#00796B]"
                              }`}
                              title={tx.statusBadge === "Overdue" ? "Cannot renew overdue items" : "Renew"}
                            >
                              <RefreshCw className="w-4 h-4" />
                            </ButtonWidget>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Mobile/Tablet Cards */}
                <div className="md:hidden space-y-4 mt-2">
                  {searchResult.transactionBooks.map((book) =>
                    book.transactions.map((tx) => (
                      <div key={`${tx.circulationLogId}-${tx.bookCopyId}`} className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-12 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                            <ImageWidget
                              src={book.bookImageUrl || ""}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h6 className="text-sm font-semibold text-gray-900 mb-1">
                              {book.title}
                            </h6>
                            <p className="text-xs text-gray-600 mb-1">
                              {tx.rfid}
                            </p>
                            <p className="text-xs text-gray-600 mb-2">
                              by {book.author} - {book.year || "N/A"}
                            </p>
                            {tx.statusBadge === "Overdue" && tx.fine > 0 && (
                              <div className="mb-2">
                                <span className="inline-flex px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded">
                                  Overdue
                                </span>
                                <p className="text-xs text-red-600 mt-1">
                                  Fine Amount - ₹{String(tx.fine).padStart(2, "0")}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">User</p>
                            <p className="text-sm font-medium text-gray-900">{tx.userName}</p>
                            <p className="text-xs text-gray-600">User ID: {tx.userId}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Due Date</p>
                            <p className="text-sm text-gray-900">{tx.dueDate || "-"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Renewal Count</p>
                            <p className={`text-sm font-medium ${tx.renewalCount >= tx.maxRenewals ? "text-red-600" : "text-gray-900"}`}>
                              {tx.renewalCount}/{tx.maxRenewals}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Status</p>
                            <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded ${tx.statusBadge === "Overdue"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                              }`}>
                              {tx.statusBadge}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Fine</p>
                            <p className={`text-sm font-medium ${tx.fine > 0 ? "text-red-600" : "text-gray-900"}`}>
                              {tx.fine > 0 ? `₹${tx.fine}` : "₹ 00"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                          <button
                            type="button"
                            onClick={() => handleReturnClick(tx, book.title)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors"
                          >
                            <RotateCw className="w-4 h-4" />
                            Return
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRenewClickForCopy(tx, book.title)}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              tx.statusBadge === "Overdue"
                                ? "bg-gray-100 opacity-50 text-gray-400 cursor-not-allowed"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            }`}
                            disabled={tx.statusBadge === "Overdue"}
                          >
                            <RefreshCw className="w-4 h-4" />
                            Renew
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {searchMode === "book-rfid" && searchResult && (
          <div className="mt-6 bg-[#E8F1F0] rounded-lg p-6 relative">

            {/* CLOSE ICON */}
            <button
              onClick={clearSearch}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-semibold mb-3">
              {searchResult.book.title}
            </h3>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p>RFID: {searchResult.copy.rfid}</p>
              <p>Status: {searchResult.copy.status}</p>
            </div>
          </div>
        )}

        {isScanUserCardOpen && (
          <div className="mt-6 flex justify-center">
            <div className="w-full max-w-2xl bg-[#F9F9F9] border border-gray-200 rounded-xl p-6 flex flex-col items-center">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Scan User Card
              </h2>
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
                onKeyDown={(e) => { if (e.key === "Enter") handleScanUser(); }}
                autoFocus
                className="sr-only"
              />
              <ButtonWidget
                type="button"
                loader={false}
                onClick={closeScanUserCard}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg px-6 py-2"
              >
                Cancel
              </ButtonWidget>
            </div>
          </div>
        )}

        {/* TRANSACTION DIALOGS */}
        <TransferDialog
          isOpen={isTransferDialogOpen}
          onOpenChange={setIsTransferDialogOpen}
          item={selectedItemForTransfer}
          onConfirm={handleTransferConfirm}
          isLoading={isReturningBook}
        />
        <TransferSuccessDialog
          isOpen={isTransferSuccessOpen}
          onOpenChange={setIsTransferSuccessOpen}
          item={selectedItemForTransfer}
        />
        <RenewBookDueDateDialog
          isOpen={isRenewDialogOpen}
          onOpenChange={setIsRenewDialogOpen}
          item={selectedItemForRenew}
          onConfirm={handleRenewConfirm}
          isLoading={isRenewingBook}
        />
        <RenewSuccessDialog
          isOpen={isRenewSuccessOpen}
          onOpenChange={setIsRenewSuccessOpen}
          item={selectedItemForRenew}
        />
        <RenewLimitReachedModal
          isOpen={isRenewLimitModalOpen}
          onOpenChange={setIsRenewLimitModalOpen}
          userName={searchResult?.name || "User"}
          userDetailId={searchResult?.id || ""}
        />
        <ReturnDialog
          isOpen={isReturnDialogOpen}
          onOpenChange={setIsReturnDialogOpen}
          bookData={selectedItemForReturn?.bookData}
          userData={selectedItemForReturn?.userData}
        />
      </div>
    </PageLayout>
  );
};



export default CirculationSection;