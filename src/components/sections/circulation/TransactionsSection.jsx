"use client";

import React, { useState, useEffect, useCallback } from "react";
import PageLayout from "@/components/layouts/PageLayout";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import ImageWidget from "@/components/widgets/ImageWidget";
import TableWidget from "@/components/widgets/TableWidget";
import SearchWidget from "@/components/widgets/SearchWidget";
import DateRangePicker from "@/components/widgets/DateRangePicker";
import useURLParams from "@/components/custom-hooks/useURLParams";
import { ArrowLeft, Calendar, RefreshCw, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import userImage from "@/assets/image/user.png";
import actionIcon from "@/assets/icons/19.svg";
import { getUserStatusColor } from "@/helpers/FuntionalHelpers";
import TransactionStatusFilter from "./utils/transactionStatusFilter";
import TransferDialog from "./utils/transferDialog";
import TransferSuccessDialog from "./utils/transferSuccessDialog";
import RenewBookDueDateDialog from "./utils/renewBookDueDateDialog";
import RenewSuccessDialog from "./utils/renewSuccessDialog";
import RenewLimitReachedModal from "./utils/RenewLimitReachedModal";
import { useGetUserTransactions, useSearchBookOrUser, useReturnBook, useRenewBook } from "@/store/hooks/CirculationHooks";
import useErrorHandler from "@/components/custom-hooks/useErrorHandler";

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

const TransactionsSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userIdParam = searchParams.get("userId");
  const internalUserIdParam = searchParams.get("internalUserId");

  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const { mutateAsync: fetchUserTransactions } = useGetUserTransactions();
  const { mutateAsync: searchUserApi } = useSearchBookOrUser();
  const { mutateAsync: returnBookApi, isPending: isReturningBook } = useReturnBook();
  const { mutateAsync: renewBookApi, isPending: isRenewingBook } = useRenewBook();
  const { showErrorToast } = useErrorHandler();

  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedItemForTransfer, setSelectedItemForTransfer] = useState(null);
  const [isTransferSuccessOpen, setIsTransferSuccessOpen] = useState(false);
  const [isRenewDialogOpen, setIsRenewDialogOpen] = useState(false);
  const [selectedItemForRenew, setSelectedItemForRenew] = useState(null);
  const [isRenewSuccessOpen, setIsRenewSuccessOpen] = useState(false);
  const [isRenewLimitModalOpen, setIsRenewLimitModalOpen] = useState(false);

  const breadcrumbs = [
    { label: "Circulation", href: "/circulation" },
    { label: "Check-Out", href: "/circulation/checkout" },
    { label: "Transactions" },
  ];

  const {
    page: currentPage,
    size: itemsPerPage,
    search: searchTerm,
    status: statusFilter,
    handlePageChange,
    handleSearch,
    handleSort,
    getSortIcon,
    handleDateRangeChange,
    getDateRange,
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
    additionalParams: {
      fromDate: {
        paramName: "fromDate",
        defaultValue: "",
      },
      toDate: {
        paramName: "toDate",
        defaultValue: "",
      },
      status: {
        paramName: "status",
        defaultValue: "all-status",
      },
    },
  });

  const dateRange = getDateRange("fromDate", "toDate");

  const statusToTypeMap = {
    "all-status": 1,
    "Checked-Out": 2,
    "Renewed": 3,
    "Overdue": 4,
  };

  const mapTransactions = useCallback((items) => {
    return items.map((tx) => ({
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
  }, []);

  const fetchTransactions = useCallback(() => {
    if (!internalUserIdParam) {
      setIsLoadingTransactions(false);
      return;
    }

    setIsLoadingTransactions(true);

    const params = { userId: Number(internalUserIdParam) };

    if (searchTerm) params.searchKey = searchTerm;

    const typeVal = statusToTypeMap[statusFilter] ?? 1;
    params.type = typeVal;

    if (dateRange?.from) {
      const fmt = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${dd}`;
      };
      params.startDate = fmt(dateRange.from);
      if (dateRange.to) params.endDate = fmt(dateRange.to);
    }

    fetchUserTransactions(params)
      .then((response) => {
        const items = response?.data || [];
        setTransactions(mapTransactions(items));
      })
      .catch((error) => showErrorToast(error))
      .finally(() => setIsLoadingTransactions(false));
  }, [internalUserIdParam, searchTerm, statusFilter, dateRange?.from?.getTime(), dateRange?.to?.getTime()]);

  useEffect(() => {
    if (!internalUserIdParam) {
      setIsLoadingTransactions(false);
      return;
    }

    if (userIdParam) {
      searchUserApi({ type: 1, searchKey: userIdParam })
        .then((response) => {
          const found = response?.data?.[0];
          if (found) {
            setUser({
              userName: found.userName,
              userId: found.userId,
              libraryCardId: found.userId,
              internalUserId: found.internalUserId,
              status: found.status || "Active",
              statusType: found.status || "Active",
            });
          }
        })
        .catch(() => {});
    }

    fetchTransactions();
  }, [fetchTransactions]);

  const handleTransferClick = (record) => {
    const item = {
      title: record.bookTitle,
      refId: record.rfid,
      dueDate: record.dueDate,
      status: record.status === "Overdue" ? "overdue" : "onTime",
    };
    setSelectedItemForTransfer(item);
    setIsTransferDialogOpen(true);
  };

  const handleTransferConfirm = async () => {
    try {
      await returnBookApi({
        userId: String(internalUserIdParam),
        rfidList: [selectedItemForTransfer?.refId],
      });
      setIsTransferDialogOpen(false);
      setIsTransferSuccessOpen(true);
      fetchTransactions();
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleRenewClick = (record) => {
    const item = {
      title: record.bookTitle,
      refId: record.rfid,
      dueDate: record.dueDate,
      status: record.status === "Overdue" ? "overdue" : "onTime",
    };
    setSelectedItemForRenew(item);
    setIsRenewDialogOpen(true);
  };

  const handleRenewConfirm = async () => {
    try {
      await renewBookApi({
        userId: String(internalUserIdParam),
        rfidList: [selectedItemForRenew?.refId],
      });
      setIsRenewDialogOpen(false);
      setIsRenewSuccessOpen(true);
      fetchTransactions();
    } catch (error) {
      showErrorToast(error);
    }
  };

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
        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-sm ${getTransactionStatusClass(record.status)}`}>
          {record.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      minWidth: "120px",
      render: (record) => {
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
              className={`h-8 w-8 p-0 rounded bg-white border border-gray-300 flex items-center justify-center ${
                isOverdue
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
    },
  ];


  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div>
  
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-200 -mx-4 px-2 py-2">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <ArrowLeft
              className="h-5 w-5 flex-shrink-0 cursor-pointer text-gray-600 hover:text-gray-900"
              onClick={() => router.back()}
            />
            <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
              <ImageWidget src={userImage} alt={user?.userName || ""} className="w-full h-full object-cover rounded-md" />
            </div>
            <div className="flex flex-col min-w-0 gap-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">{user?.userName || "-"}</h2>
                <span className={`inline-flex px-2 sm:px-4 mt-1.5 py-1 text-xs font-medium rounded-sm ${getUserStatusColor(user?.statusType)}`}>
                  {user?.status || "-"}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-wrap text-xs sm:text-sm text-[#62748E]">
                <span>{user?.libraryCardId || "-"}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0 sm:max-w-md w-full sm:w-auto">
            <SearchWidget
              placeholder="Search by User ID, User Name, RFID..."
              value={searchTerm}
              onSearch={handleSearch}
              className="w-full sm:w-auto"
              debounceMs={300}
            />
            <div className="flex items-center gap-2">
              <DateRangePicker
                onDateRangeChange={handleDateRangeChange}
                initialDateRange={getDateRange()}
                trigger={
                  <ButtonWidget
                    type="button"
                    className="h-9 px-3 rounded-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm flex items-center gap-2 flex-shrink-0"
                  >
                    <Calendar className="w-4 h-4 text-[#00796B]" />
                    <span className="hidden sm:inline">Date</span>
                  </ButtonWidget>
                }
              />
            <TransactionStatusFilter />
            </div>
          </div>
        </div>
        <div className="mt-2 space-y-4">
          <p className="text-sm text-gray-600">{transactionsResponse.data.totalElements} Records found</p>
          {isLoadingTransactions ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-[#00796B]" />
              <span className="ml-2 text-sm text-gray-500">Loading transactions...</span>
            </div>
          ) : (
            <TableWidget
              columns={transactionColumns}
              response={transactionsResponse}
              handleSort={handleSort}
              getSortIcon={getSortIcon}
              searchTerm={searchTerm}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              handlePageChange={handlePageChange}
              height="h-[calc(100vh-280px)] sm:h-[calc(100vh-260px)] md:h-[calc(100vh-250px)] lg:h-[calc(100vh-240px)] xl:h-[calc(90vh-230px)]"
            />
          )}
        </div>
      </div>
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
        userName={user?.userName}
        userDetailId={user?.libraryCardId}
      />
    </PageLayout>
  );
};

export default TransactionsSection;
