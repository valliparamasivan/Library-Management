"use client";

import React, { useState } from "react";
import PageLayout from "@/components/layouts/PageLayout";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import ImageWidget from "@/components/widgets/ImageWidget";
import TableWidget from "@/components/widgets/TableWidget";
import SearchWidget from "@/components/widgets/SearchWidget";
import DateRangePicker from "@/components/widgets/DateRangePicker";
import useURLParams from "@/components/custom-hooks/useURLParams";
import { ArrowLeft, Calendar, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import userImage from "@/assets/image/user.png";
import actionIcon from "@/assets/icons/19.svg";
import { getUserStatusColor } from "@/helpers/FuntionalHelpers";
import TransactionStatusFilter from "./utils/transactionStatusFilter";
import TransferDialog from "./utils/transferDialog";
import TransferSuccessDialog from "./utils/transferSuccessDialog";
import RenewBookDueDateDialog from "./utils/renewBookDueDateDialog";
import RenewSuccessDialog from "./utils/renewSuccessDialog";
import RenewLimitReachedModal from "./utils/RenewLimitReachedModal";

const USER_MOCK = {
  userName: "John Smith",
  userId: "LIB2024P9789",
  libraryCardId: "LIB2024P9789",
  status: "Active",
  statusType: "Active",
};

const CHECKIN_TRANSACTIONS_MOCK = [
  { id: 1, sNo: "01", bookTitle: "The Great Gatsby", rfid: "RFID00124", checkOutDate: "01-11-2025", dueDate: "01-11-2025", checkInDate: "01-11-2025", renewedDate: "-", renewalCount: 1, maxRenewals: 3, overdueDays: 0, fine: "$0", status: "Checked-Out" },
  { id: 2, sNo: "02", bookTitle: "The Great Gatsby", rfid: "RFID00124", checkOutDate: "15-10-2025", dueDate: "15-10-2025", checkInDate: "-", renewedDate: "15-10-2025", renewalCount: 3, maxRenewals: 3, overdueDays: 0, fine: "$0", status: "Renewed" },
  { id: 3, sNo: "03", bookTitle: "The Great Gatsby", rfid: "RFID00124", checkOutDate: "30-09-2025", dueDate: "30-09-2025", checkInDate: "-", renewedDate: "-", renewalCount: 1, maxRenewals: 3, overdueDays: 0, fine: "$0", status: "Checked-Out" },
  { id: 4, sNo: "04", bookTitle: "The Great Gatsby", rfid: "RFID00124", checkOutDate: "25-09-2025", dueDate: "25-09-2025", checkInDate: "-", renewedDate: "-", renewalCount: 3, maxRenewals: 3, overdueDays: 3, fine: "₹ 30", status: "Overdue" },
];

const getTransactionStatusClass = (status) => {
  switch (status) {
    case "Check-In":
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

const CheckInTransactionsSection = () => {
  const router = useRouter();
  const user = USER_MOCK;
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedItemForTransfer, setSelectedItemForTransfer] = useState(null);
  const [isTransferSuccessOpen, setIsTransferSuccessOpen] = useState(false);
  const [isRenewDialogOpen, setIsRenewDialogOpen] = useState(false);
  const [selectedItemForRenew, setSelectedItemForRenew] = useState(null);
  const [isRenewSuccessOpen, setIsRenewSuccessOpen] = useState(false);
  const [isRenewLimitModalOpen, setIsRenewLimitModalOpen] = useState(false);

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

  const handleTransferConfirm = () => {
    setIsTransferDialogOpen(false);
    setIsTransferSuccessOpen(true);
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

  const handleRenewConfirm = () => {
    setIsRenewDialogOpen(false);
    setIsRenewSuccessOpen(true);
  };

  const breadcrumbs = [
    { label: "Circulation", href: "/circulation" },
    { label: "Check-In", href: "/circulation/checkin" },
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
      status: {
        paramName: "status",
        defaultValue: "all-status",
      },
    },
  });

  const transactionsResponse = {
    data: {
      content: CHECKIN_TRANSACTIONS_MOCK,
      totalPages: 1,
      totalElements: CHECKIN_TRANSACTIONS_MOCK.length,
      pageSize: CHECKIN_TRANSACTIONS_MOCK.length,
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
      render: (record) => (
        <span className={`font-medium ${record.fine !== "$0" ? "text-red-600" : "text-gray-900"}`}>
          {record.fine}
        </span>
      ),
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
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <ArrowLeft
              className="h-5 w-5 flex-shrink-0 cursor-pointer text-gray-600 hover:text-gray-900"
              onClick={() => router.push("/circulation/checkin")}
            />
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
              <ImageWidget src={userImage} alt={user.userName} className="w-full h-full object-cover rounded-md" />
            </div>
            <div className="flex flex-col min-w-0 gap-0.5 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate">{user.userName}</h2>
                <span className={`inline-flex px-1.5 sm:px-2 md:px-4 mt-1.5 py-0.5 sm:py-1 text-xs font-medium rounded-sm flex-shrink-0 ${getUserStatusColor(user.statusType)}`}>
                  {user.status}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-wrap text-xs sm:text-sm text-[#62748E]">
                <span className="truncate">{user.libraryCardId}</span>
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
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
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
        </div>
      </div>
      <TransferDialog
        isOpen={isTransferDialogOpen}
        onOpenChange={setIsTransferDialogOpen}
        item={selectedItemForTransfer}
        onConfirm={handleTransferConfirm}
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
      />
      <RenewSuccessDialog
        isOpen={isRenewSuccessOpen}
        onOpenChange={setIsRenewSuccessOpen}
        item={selectedItemForRenew}
      />
      <RenewLimitReachedModal
        isOpen={isRenewLimitModalOpen}
        onOpenChange={setIsRenewLimitModalOpen}
        userName={user.userName}
        userDetailId={user.libraryCardId}
      />
    </PageLayout>
  );
};

export default CheckInTransactionsSection;
