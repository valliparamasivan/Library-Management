"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IndianRupee, CircleDollarSign, Clock, Ban } from "lucide-react";
import useURLParams from "@/components/custom-hooks/useURLParams";
import PageLayout from "@/components/layouts/PageLayout";
import TitleWidget from "@/components/widgets/TitleWidget";
import SearchWidget from "@/components/widgets/SearchWidget";
import TableWidget from "@/components/widgets/TableWidget";
import { useFineSummary } from "@/store/hooks/FineHooks";
import usePermissions from "@/components/custom-hooks/usePermissions";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "-";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "OVERDUE", label: "Overdue" },
  { value: "PAID", label: "Paid" },
  { value: "WAIVED", label: "Waived" },
];

const getStatusBadge = (status) => {
  switch (status) {
    case "PAID":
      return "bg-[#F0FDF4] text-[#00A63E] border border-[#00A63E]/20";
    case "WAIVED":
      return "bg-[#FFF7ED] text-[#F97316] border border-[#F97316]/20";
    case "OVERDUE":
    default:
      return "bg-red-50 text-red-600 border border-red-200";
  }
};

const FinesSection = ({ response }) => {
  const router = useRouter();
  const { canView, isLoading: isPermissionsLoading, permissions } = usePermissions();
  const canViewFines = canView("Fines");

  const { data: summaryData } = useFineSummary();
  const summary = summaryData?.data;

  const breadcrumbs = [{ label: "Fines", href: "/fines" }];

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
      "loanId", "bookTitle", "userName", "fineAmount",
      "overdueDays", "dueDate", "status", "paidAt",
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
    if (permissions.length > 0 && !canViewFines) {
      router.replace("/dashboard");
    }
  }, [isPermissionsLoading, permissions.length, canViewFines, router]);

  const columns = [
    {
      key: "sno",
      label: "S.No",
      sortable: false,
      minWidth: "70px",
      render: (_, index) => {
        const sn = currentPage * itemsPerPage + index + 1;
        return <span>{String(sn).padStart(2, "0")}</span>;
      },
    },
    {
      key: "bookTitle",
      label: "Book",
      sortable: true,
      minWidth: "150px",
      render: (record) => (
        <div>
          <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">{record.bookTitle}</p>
          <p className="text-xs text-gray-500">{record.isbn}</p>
        </div>
      ),
    },
    {
      key: "userName",
      label: "User",
      sortable: true,
      minWidth: "130px",
      render: (record) => (
        <div>
          <p className="text-sm text-gray-900">{record.userName || "-"}</p>
          <p className="text-xs text-gray-500">{record.userDetailId || ""}</p>
        </div>
      ),
    },
    {
      key: "fineAmount",
      label: "Fine Amount",
      sortable: true,
      minWidth: "110px",
      render: (record) => (
        <span className="font-semibold text-red-600">
          {record.fineAmount?.toFixed(2)}
        </span>
      ),
    },
    {
      key: "overdueDays",
      label: "Overdue Days",
      sortable: false,
      minWidth: "100px",
      render: (record) => (
        <span className={`text-sm ${record.overdueDays > 0 ? "text-red-600 font-medium" : "text-gray-600"}`}>
          {record.overdueDays > 0 ? record.overdueDays : "-"}
        </span>
      ),
    },
    {
      key: "dueDate",
      label: "Due Date",
      sortable: true,
      minWidth: "100px",
      render: (record) => (
        <span className="text-sm text-gray-600">
          {formatDate(record.dueDate)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      minWidth: "100px",
      render: (record) => {
        const status = record.status || "OVERDUE";
        return (
          <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-sm ${getStatusBadge(status)}`}>
            {status}
          </span>
        );
      },
    },
    {
      key: "paidAt",
      label: "Settlement",
      sortable: true,
      minWidth: "130px",
      render: (record) => {
        if (record.status === "PAID" && record.paidAt) {
          return (
            <div>
              <p className="text-sm text-gray-600">{formatDate(record.paidAt)}</p>
              <p className="text-xs text-gray-400">{record.paymentMethod}</p>
            </div>
          );
        }
        if (record.status === "WAIVED") {
          return (
            <div>
              <p className="text-xs text-orange-600 italic">Waived</p>
              {record.waivedReason && (
                <p className="text-xs text-gray-400 truncate max-w-[120px]" title={record.waivedReason}>{record.waivedReason}</p>
              )}
            </div>
          );
        }
        return <span className="text-gray-400">-</span>;
      },
    },
  ];

  if (!isPermissionsLoading && permissions.length > 0 && !canViewFines) {
    return null;
  }

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div className="pt-2" />
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className="bg-white border rounded-md p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-md">
              <CircleDollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{summary.totalFineAmount?.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Total Fines ({summary.totalFines})</p>
            </div>
          </div>
          <div className="bg-white border rounded-md p-4 flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-md">
              <Clock className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{summary.totalOverdueAmount?.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Overdue ({summary.overdueCount})</p>
            </div>
          </div>
          <div className="bg-white border rounded-md p-4 flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-md">
              <IndianRupee className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{summary.totalPaidAmount?.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Collected ({summary.paidCount})</p>
            </div>
          </div>
          <div className="bg-white border rounded-md p-4 flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-md">
              <Ban className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{summary.totalWaivedAmount?.toFixed(2)}</p>
              <p className="text-xs text-gray-500">Waived ({summary.waivedCount})</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4 py-2 border-b -mx-4 px-4">
        <TitleWidget title="Fines" />
        <div className="flex items-center gap-2 flex-wrap">
          <SearchWidget
            placeholder="Search by book, user, loan ID..."
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

      {/* Table */}
      <TableWidget
        columns={columns}
        response={response}
        handleSort={handleSort}
        getSortIcon={getSortIcon}
        searchTerm={searchTerm}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        handlePageChange={handlePageChange}
        height="h-[calc(100vh-330px)]"
      />
    </PageLayout>
  );
};

export default FinesSection;
