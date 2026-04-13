"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import ImageWidget from "@/components/widgets/ImageWidget";
import checkoutIcon from "@/assets/icons/16.svg";
import useURLParams from "@/components/custom-hooks/useURLParams";
import PageLayout from "@/components/layouts/PageLayout";
import TitleWidget from "@/components/widgets/TitleWidget";
import SearchWidget from "@/components/widgets/SearchWidget";
import TableWidget from "@/components/widgets/TableWidget";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import usePermissions from "@/components/custom-hooks/usePermissions";
import useErrorHandler from "@/components/custom-hooks/useErrorHandler";
import { useCheckoutReservedBook } from "@/store/hooks/ReservedBookHooks";

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "issued", label: "Issued" },
];

const getStatusBadge = (issued) => {
  if (issued) {
    return "bg-[#F0FDF4] text-[#00A63E] border border-[#00A63E]/20";
  }
  return "bg-[#FFF7ED] text-[#F97316] border border-[#F97316]/20";
};

const ReservedBooksSection = ({ response }) => {
  const router = useRouter();
  const { canView, canEdit, isLoading: isPermissionsLoading, permissions } = usePermissions();
  const canViewReserved = canView("Reserved Books");
  const canEditReserved = canEdit("Reserved Books");

  const { mutateAsync: checkoutApi, isPending: isCheckingOut } = useCheckoutReservedBook();
  const { showSuccessToast, showErrorToast } = useErrorHandler();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedReserve, setSelectedReserve] = useState(null);

  const breadcrumbs = [{ label: "Reserved Books", href: "/reserved-books" }];

  const {
    page: currentPage,
    size: itemsPerPage,
    search: searchTerm,
    status: statusFilter,
    handlePageChange,
    handleSearch,
    handleSort,
    getSortIcon,
    handleFilter,
  } = useURLParams({
    defaultColumns: [
      "bookTitle", "userName", "reservedDate", "waitingCount", "status", "actions",
    ],
    additionalParams: {
      status: {
        paramName: "status",
        defaultValue: "",
      },
    },
  });

  useEffect(() => {
    if (isPermissionsLoading) return;
    if (permissions.length > 0 && !canViewReserved) {
      router.replace("/dashboard");
    }
  }, [isPermissionsLoading, permissions.length, canViewReserved, router]);

  const handleCheckoutClick = (record) => {
    setSelectedReserve(record);
    setIsConfirmOpen(true);
  };

  const handleCheckoutConfirm = async () => {
    try {
      const res = await checkoutApi(selectedReserve.reserveId);
      showSuccessToast(res.message || "Book checked out successfully");
      setIsConfirmOpen(false);
      setSelectedReserve(null);
      router.refresh();
    } catch (error) {
      const errData = error?.data || error?.response?.data || error;
      const fieldErrors = errData?.errorMessages;
      let message = errData?.message || error?.message || "Checkout failed";
      if (fieldErrors) {
        const firstMsg = Object.values(fieldErrors).flat().filter(Boolean)[0];
        if (firstMsg) message = firstMsg;
      }
      showErrorToast(message);
    }
  };

  const columns = [
    {
      key: "sno",
      label: "S.No",
      sortable: false,
      minWidth: "60px",
      render: (_, index) => {
        const sn = currentPage * itemsPerPage + index + 1;
        return <span>{String(sn).padStart(2, "0")}</span>;
      },
    },
    {
      key: "bookTitle",
      label: "Book",
      sortable: true,
      minWidth: "180px",
      render: (record) => (
        <div>
          <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{record.bookTitle}</p>
          <p className="text-xs text-gray-500">{record.isbn}</p>
        </div>
      ),
    },
    {
      key: "author",
      label: "Author",
      sortable: false,
      minWidth: "130px",
      render: (record) => (
        <span className="text-sm text-gray-600">{record.author || "-"}</span>
      ),
    },
    {
      key: "userName",
      label: "Reserved By",
      sortable: true,
      minWidth: "140px",
      render: (record) => (
        <div>
          <p className="text-sm text-gray-900">{record.userName || "-"}</p>
          <p className="text-xs text-gray-500">{record.userDetailId || ""}</p>
        </div>
      ),
    },
    {
      key: "reservedDate",
      label: "Reserved Date",
      sortable: true,
      minWidth: "120px",
      render: (record) => (
        <span className="text-sm text-gray-600">{record.reservedDate || "-"}</span>
      ),
    },
    {
      key: "waitingCount",
      label: "Waiting",
      sortable: true,
      minWidth: "80px",
      render: (record) => (
        <span className={`text-sm font-medium ${record.waitingCount > 0 ? "text-[#F97316]" : "text-gray-600"}`}>
          {record.waitingCount ?? 0}
        </span>
      ),
    },
    {
      key: "expiryDate",
      label: "Expires On",
      sortable: false,
      minWidth: "110px",
      render: (record) => {
        if (record.issued || !record.expiryDate) return <span className="text-gray-400">-</span>;
        const isExpired = new Date(record.expiryDate.split("-").reverse().join("-")) < new Date();
        return (
          <span className={`text-sm ${isExpired ? "text-red-600 font-medium" : "text-gray-600"}`}>
            {record.expiryDate}
            {isExpired && <span className="text-xs ml-1">(Expired)</span>}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: false,
      minWidth: "100px",
      render: (record) => {
        const issued = record.issued;
        return (
          <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-sm ${getStatusBadge(issued)}`}>
            {issued ? "Issued" : "Active"}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      minWidth: "120px",
      render: (record) => {
        if (record.issued) return null;
        return (
          <ButtonWidget
            onClick={() => handleCheckoutClick(record)}
            className="h-8 w-8 p-0 rounded-sm flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-50 text-[#00796B]"
            title="Check Out"
          >
            <ImageWidget src={checkoutIcon} alt="Check Out" className="w-4 h-4" width={16} height={16} />
          </ButtonWidget>
        );
      },
    },
  ];

  if (!isPermissionsLoading && permissions.length > 0 && !canViewReserved) {
    return null;
  }

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div className="pt-2" />
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4 py-2 border-b -mx-4 px-4">
        <TitleWidget title="Reserved Books" />
        <div className="flex items-center gap-2 flex-wrap">
          <SearchWidget
            placeholder="Search by book, author, user..."
            value={searchTerm}
            onSearch={handleSearch}
            className="w-full sm:w-60 rounded-[14px]!"
          />
          <select
            value={statusFilter || ""}
            onChange={(e) => handleFilter("status", e.target.value)}
            className="h-9 px-3 text-sm border border-gray-300 rounded-sm bg-white focus:outline-none focus:border-[#00796B]"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <TableWidget
        columns={columns}
        response={response}
        handleSort={handleSort}
        getSortIcon={getSortIcon}
        searchTerm={searchTerm}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        handlePageChange={handlePageChange}
        height="h-[calc(100vh-230px)]"
      />

      {/* Checkout Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={(open) => { if (!isCheckingOut) setIsConfirmOpen(open); }}>
        <DialogContent hideClose className="w-[calc(100%-2rem)] sm:max-w-md rounded-2xl p-0 border-0 max-h-[90vh] overflow-hidden flex flex-col shadow-lg">
          <div className="flex items-center justify-center px-4 pt-5">
            <div className="w-10 h-10 rounded-full bg-[#ECFDF5] flex items-center justify-center">
              <LogOut className="w-5 h-5 text-[#00796B]" />
            </div>
          </div>
          <div className="px-4 pt-2 pb-0 flex flex-col items-center text-center">
            <p className="text-base font-medium text-[#1A1A1A]">Check Out Reserved Book?</p>
            <p className="text-sm text-gray-500 mt-1">This will issue the book to the reserved user</p>
            {selectedReserve && (
              <div className="border border-[#E6E6E6] rounded-lg p-3 bg-white mt-3 w-full text-left">
                <p className="text-sm font-semibold text-[#1A1A1A] truncate">{selectedReserve.bookTitle}</p>
                <p className="text-xs text-gray-500 mt-1">Reserved by: <span className="font-medium text-gray-700">{selectedReserve.userName}</span></p>
                <p className="text-xs text-gray-500">Reserved on: {selectedReserve.reservedDate}</p>
              </div>
            )}
          </div>
          <div className="bg-[#F8FAFC] flex items-center gap-3 px-4 pt-3 pb-4 w-full">
            <ButtonWidget
              type="button"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isCheckingOut}
              loader={false}
              className="flex-1 h-10 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-sm"
            >
              Cancel
            </ButtonWidget>
            <ButtonWidget
              type="button"
              onClick={handleCheckoutConfirm}
              disabled={isCheckingOut}
              loading={isCheckingOut}
              className="flex-1 h-10 bg-[#00796B] hover:bg-[#00796B]/90 text-white border-0 rounded-lg text-sm"
            >
              {isCheckingOut ? "Processing..." : "Yes, Check Out"}
            </ButtonWidget>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default ReservedBooksSection;
