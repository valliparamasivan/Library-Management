"use client";

import useURLParams from '@/components/custom-hooks/useURLParams';
import PageLayout from '@/components/layouts/PageLayout';
import CheckInDialog from '@/components/sections/loans/utils/CheckInDialog';
import ConfirmSuccessPopup from '@/components/sections/loans/utils/ConfirmSuccessPopup';
import LoanStatusFilter from '@/components/sections/loans/utils/LoanStatusFilter';
import RenewConfirmDialog from '@/components/sections/loans/utils/RenewConfirmDialog';
import RenewSuccessPopup from '@/components/sections/loans/utils/RenewSuccessPopup';
import ButtonWidget from '@/components/widgets/ButtonWidget';
import SearchWidget from '@/components/widgets/SearchWidget';
import TitleWidget from '@/components/widgets/TitleWidget';
import DateRangePicker from '@/components/widgets/DateRangePicker';
import ImageWidget from '@/components/widgets/ImageWidget';
import book from '@/assets/image/book.png';
import ExpandableTableWidget from '@/components/widgets/ExpandableTableWidget';
import { getLoanActionTypeColor } from '@/helpers/FuntionalHelpers';
import RenewLimitReachedModal from './utils/RenewLimitReachedModal';
import { useReturnBook, useRenewBook } from '@/store/hooks/CirculationHooks';
import useErrorHandler from '@/components/custom-hooks/useErrorHandler';
import { Calendar, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import icon3Svg from '@/assets/icons/16.svg';

const LoansSection = ({ response }) => {

  const router = useRouter();
  const { mutateAsync: returnBookApi, isPending: isReturningBook } = useReturnBook();
  const { mutateAsync: renewBookApi, isPending: isRenewingBook } = useRenewBook();
  const { showErrorToast } = useErrorHandler();

  const [isRenewConfirmDialogOpen, setIsRenewConfirmDialogOpen] = useState(false);
  const [isRenewSuccessOpen, setIsRenewSuccessOpen] = useState(false);
  const [isCheckInDialogOpen, setIsCheckInDialogOpen] = useState(false);
  const [isCheckInSuccessOpen, setIsCheckInSuccessOpen] = useState(false);
  const [selectedRenewItem, setSelectedRenewItem] = useState(null);
  const [selectedCheckInUserData, setSelectedCheckInUserData] = useState(null);
  const [isRenewLimitModalOpen, setIsRenewLimitModalOpen] = useState(false);
  const [renewLimitUser, setRenewLimitUser] = useState({ userName: "", userDetailId: "" });
  
  const {
    page: currentPage,
    size: itemsPerPage,
    search: searchTerm,
    handlePageChange,
    handleSearch,
    handleSort,
    getSortIcon,
    handleDateRangeChange,
    getDateRange,
  } = useURLParams({
    sortOrderParam: "sortMethod",
    defaultColumns: [
      "serialNumber",
      "bookDetails",
      "user",
      "checkOutDate",
      "dueDate",
      "checkInDate",
      "renewedDate",
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
      type: {
        paramName: "type",
        defaultValue: "",
      },
    },
  });

  const handleRenewClick = (record) => {
    setSelectedRenewItem({
      title: record.bookTitle,
      refId: record.rfid,
      dueDate: record.dueDate,
      userId: String(record.assignedUserId),
      rfid: record.rfid,
    });
    setIsRenewConfirmDialogOpen(true);
  };

  const handleRenewConfirm = async () => {
    try {
      await renewBookApi({
        userId: selectedRenewItem?.userId,
        rfidList: [selectedRenewItem?.rfid],
      });
      setIsRenewConfirmDialogOpen(false);
      setIsRenewSuccessOpen(true);
      router.refresh();
    } catch (error) {
      setIsRenewConfirmDialogOpen(false);
      const errorMessages = error?.data?.errorMessages || error?.errorMessages;
      if (errorMessages) {
        const firstMessage = Object.values(errorMessages).flat()[0];
        if (firstMessage) {
          showErrorToast(firstMessage);
          return;
        }
      }
      showErrorToast(error);
    }
  };

  const handleCheckInConfirm = async () => {
    try {
      await returnBookApi({
        userId: selectedCheckInUserData?.assignedUserId,
        rfidList: [selectedCheckInUserData?.rfid],
      });
      setIsCheckInDialogOpen(false);
      setIsCheckInSuccessOpen(true);
      router.refresh();
    } catch (error) {
      setIsCheckInDialogOpen(false);
      const errorMessages = error?.data?.errorMessages || error?.errorMessages;
      if (errorMessages) {
        const firstMessage = Object.values(errorMessages).flat()[0];
        if (firstMessage) {
          showErrorToast(firstMessage);
          return;
        }
      }
      showErrorToast(error);
    }
  };

  const handleCheckInClick = (record) => {
    const isOverdue = record.status?.toLowerCase() === "overdue" || (record.daysLeft !== undefined && record.daysLeft < 0);
    
    const userData = {
      fullName: record.userName,
      userDetailId: record.userId,
      assignedUserId: String(record.assignedUserId),
      rfid: record.rfid,
      emailId: record.emailId || "N/A",
      phoneNumber: record.phoneNumber || "N/A",
      policy: record.policy || "Student Policy",
      bookTitle: record.bookTitle,
      bookId: record.bookId,
      title: record.bookTitle,
      refId: record.rfid,
      status: isOverdue ? "overdue" : "on-time",
      overdueDays: record.daysLeft !== undefined && record.daysLeft < 0 ? Math.abs(record.daysLeft) : 0,
    };

    const items = [
      {
        id: record.circulationLogId,
        bookTitle: record.bookTitle,
        bookId: record.rfid,
        author: record.author || "Unknown",
        year: new Date().getFullYear().toString(),
        dueDate: record.dueDate || "-",
        image: book,
      },
    ];

    setSelectedCheckInUserData({ ...userData, items });
    setIsCheckInDialogOpen(true);
  };

  const parseRenewalCount = (renewalCount) => {
    if (!renewalCount) return { current: 0, max: 0 };
    const parts = String(renewalCount).split("/");
    return { current: parseInt(parts[0]) || 0, max: parseInt(parts[1]) || 0 };
  };

  const defaultColumns = [
    {
      key: "serialNumber",
      label: "S.No",
      sortable: false,
      minWidth: "80px",
      lgMinWidth: "100px",
      render: (record, index) => {
        const serialNumber = currentPage * itemsPerPage + index + 1;
        return <span>{String(serialNumber).padStart(2, "0")}</span>;
      },
    },
    {
      key: "bookTitle",
      label: "Book Details",
      sortable: true,
      minWidth: "200px",
      lgMinWidth: "250px",
      render: (record) => (
        <div className="flex flex-col">
          <p className="text-sm font-medium text-gray-900">{record.bookTitle}</p>
          <p className="text-xs text-gray-500">{record.rfid}</p>
        </div>
      ),
    },
    {
      key: "userName",
      label: "User",
      sortable: true,
      minWidth: "150px",
      lgMinWidth: "180px",
      render: (record) => (
        <div className="flex flex-col">
          <p className="text-sm font-medium text-gray-900">{record.userName}</p>
          <p className="text-xs text-gray-500">{record.userId}</p>
        </div>
      ),
    },
    {
      key: "checkOutDate",
      label: "Check Out Date",
      sortable: true,
      minWidth: "120px",
      lgMinWidth: "150px",
    },
    {
      key: "dueDate",
      label: "Due Date",
      sortable: true,
      minWidth: "120px",
      lgMinWidth: "150px",
    },
    {
      key: "checkInDate",
      label: "Check In Date",
      sortable: true,
      minWidth: "120px",
      lgMinWidth: "150px",
      render: (record) => (
        <p className="text-sm text-gray-900">{record.checkInDate || "-"}</p>
      ),
    },
    {
      key: "renewedDate",
      label: "Renewed Date",
      sortable: true,
      minWidth: "120px",
      lgMinWidth: "150px",
      render: (record) => (
        <p className="text-sm text-gray-900">{record.renewedDate || "-"}</p>
      ),
    },
    {
      key: "renewalCount",
      label: "Renewal Count",
      sortable: true,
      minWidth: "100px",
      lgMinWidth: "120px",
      render: (record) => {
        const { current, max } = parseRenewalCount(record.renewalCount);
        return (
          <p className={`text-sm ${current >= max ? "text-red-600" : "text-gray-900"}`}>
            {record.renewalCount}
          </p>
        );
      },
    },
    {
      key: "daysLeft",
      label: "Days Left",
      sortable: true,
      minWidth: "120px",
      lgMinWidth: "150px",
      render: (record) => (
        <p className={`text-sm ${record.daysLeft < 0 ? "text-red-600" : "text-gray-900"}`}>
          {record.daysLeft}
        </p>
      ),
    },
    {
      key: "fineAmount",
      label: "Fine",
      sortable: true,
      minWidth: "100px",
      lgMinWidth: "120px",
      render: (record) => (
        <p className={`text-sm ${record.fineAmount > 0 ? "text-red-600" : "text-gray-900"}`}>
          ${record.fineAmount}
        </p>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      minWidth: "120px",
      lgMinWidth: "150px",
      render: (record) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getLoanActionTypeColor(
            record.status
          )}`}
        >
          {record.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      minWidth: "100px",
      lgMinWidth: "120px",
      render: (record) => {
        const status = (record.status || "").toLowerCase();
        const isReturnDisabled = ["on-time", "returned"].includes(status);
        const { current, max } = parseRenewalCount(record.renewalCount);
        const isRenewLimitReached = current >= max;
        const isRenewDisabled = ["on-time", "returned", "checked-in", "overdue", "reserved"].includes(status) || isRenewLimitReached;

        const handleReturnClick = () => {
          handleCheckInClick(record);
        };

        const onRenewClick = () => {
          if (isRenewLimitReached || ["on-time", "returned", "checked-in", "overdue", "reserved"].includes(status)) {
            setRenewLimitUser({
              userName: record.userName || "",
              userDetailId: record.userId || "",
            });
            setIsRenewLimitModalOpen(true);
          } else {
            handleRenewClick(record);
          }
        };
        
        return (
          <div className="flex items-center gap-1.5">
            <ButtonWidget
              onClick={handleReturnClick}
              disabled={isReturnDisabled}
              loader={false}
              className={`h-8 w-8 p-0 rounded-sm flex items-center justify-center flex-shrink-0 border border-gray-300 ${
                isReturnDisabled
                  ? "bg-white text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-50 text-[#00796B]"
              }`}
              title="Return"
            >
              <ImageWidget
                src={icon3Svg}
                alt="Return"
                className="w-4 h-4"
                width={16}
                height={16}
              />
            </ButtonWidget>
            <ButtonWidget
              onClick={onRenewClick}
              loader={false}
              variant="outline"
              className={`h-8 w-8 p-0 rounded-sm flex items-center justify-center flex-shrink-0 border border-gray-300 ${
                isRenewDisabled
                  ? "bg-white hover:bg-white text-gray-400 cursor-pointer"
                  : "bg-white hover:bg-white text-[#00796B] hover:text-[#00796B]"
              }`}
              title={isRenewDisabled ? "Renew limit reached" : "Renew"}
            >
              <RefreshCw className="w-4 h-4" />
            </ButtonWidget>
          </div>
        );
      },
    },
  ];

  const breadcrumbs = [
    { label: 'Loans', href: '/loans' }
  ]

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 mb-4 py-2 border-b -mx-4 px-4">
          <TitleWidget
            title="Loans"
          />
          <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 flex-wrap">
              <SearchWidget
                placeholder="Search by User ID, User Name, RFID..."
                value={searchTerm}
                onSearch={handleSearch}
                className="flex-1 min-w-[300px]"
              />
              <DateRangePicker
                onDateRangeChange={handleDateRangeChange}
                initialDateRange={getDateRange()}
                trigger={
                  <ButtonWidget
                    type="button"
                    className="h-9 px-3 rounded-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-[#00796B]" />
                    Date
                  </ButtonWidget>
                }
              />
              <LoanStatusFilter />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <ExpandableTableWidget
            columns={defaultColumns}
            response={response}
            handleSort={handleSort}
            getSortIcon={getSortIcon}
            searchTerm={searchTerm}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            handlePageChange={handlePageChange}
            getRowId={(record) => record.circulationLogId}
            height="h-[calc(100vh-230px)]"
            noDataTitle="No loan records found"
            noDataDescription="No loan records have been added yet."
            noDataIcon="book"
          />
          <RenewConfirmDialog
            isOpen={isRenewConfirmDialogOpen}
            onOpenChange={setIsRenewConfirmDialogOpen}
            item={selectedRenewItem}
            onConfirm={handleRenewConfirm}
            loading={isRenewingBook}
          />
          <RenewSuccessPopup
            isOpen={isRenewSuccessOpen}
            onOpenChange={setIsRenewSuccessOpen}
            item={selectedRenewItem}
          />
          <CheckInDialog
            isOpen={isCheckInDialogOpen}
            onOpenChange={setIsCheckInDialogOpen}
            item={selectedCheckInUserData ? {
                title: selectedCheckInUserData.title || selectedCheckInUserData.bookTitle,
                refId: selectedCheckInUserData.refId || selectedCheckInUserData.bookId,
                status: selectedCheckInUserData.status || "on-time",
                overdueDays: selectedCheckInUserData.overdueDays || 0
            } : null}
            onConfirm={handleCheckInConfirm}
            loading={isReturningBook}
          />
          <ConfirmSuccessPopup
            isOpen={isCheckInSuccessOpen}
            onOpenChange={setIsCheckInSuccessOpen}
            item={selectedCheckInUserData ? {
                title: selectedCheckInUserData.title || selectedCheckInUserData.bookTitle,
                refId: selectedCheckInUserData.refId || selectedCheckInUserData.bookId,
                status: selectedCheckInUserData.status || "on-time",
                overdueDays: selectedCheckInUserData.overdueDays || 0
            } : null}
          />
           <RenewLimitReachedModal
                    isOpen={isRenewLimitModalOpen}
                    onOpenChange={setIsRenewLimitModalOpen}
                    userName={renewLimitUser.userName}
                    userDetailId={renewLimitUser.userDetailId}
                />
        </div>
      </div>
    </PageLayout>
  );
};

export default LoansSection;
