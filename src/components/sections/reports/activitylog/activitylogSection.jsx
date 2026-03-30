"use client";

import React, { useState } from 'react'
import PageLayout from '@/components/layouts/PageLayout'
import ReportViewNavigation from '../utils/reportViewNavigation'
import SearchWidget from '@/components/widgets/SearchWidget'
import ActionFilters from '@/components/widgets/ActionFilters'
import useURLParams from '@/components/custom-hooks/useURLParams'
import TableWidget from '@/components/widgets/TableWidget'
import DateRangePicker from '@/components/widgets/DateRangePicker'
import { Calendar } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import ButtonWidget from '@/components/widgets/ButtonWidget'

const ActivitylogSection = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const breadcrumbs = [
    { label: 'Activity Log', href: '/reports/activitylog' },
  ]

  const handleDownloadAction = () => {
    console.log("Download action");
  };

  const dummyData = [
    { id: 1, sno: 1, userName: "John Smith", userId: "U00014859", action: "Book Issued", actionCategory: "Circulation", timestamp: "2025-11-02 12:00 PM", status: "Success", ipAddress: "192.168.1.105", remarks: "Some description" },
    { id: 2, sno: 5, userName: "John Smith", userId: "U00014859", action: "User Login", actionCategory: "Authentication", timestamp: "2025-11-02 01:00 PM", status: "Success", ipAddress: "192.168.1.105", remarks: "Some description" },
    { id: 3, sno: 6, userName: "John Smith", userId: "U00014859", action: "Book Returned", actionCategory: "Circulation", timestamp: "2025-11-02 02:00 PM", status: "Success", ipAddress: "192.168.1.105", remarks: "Some description" },
    { id: 4, sno: 4, userName: "John Smith", userId: "U00014859", action: "New User Added", actionCategory: "User Management", timestamp: "2025-11-02 03:00 PM", status: "Failed", ipAddress: "192.168.1.105", remarks: "Some description" },
    { id: 5, sno: 5, userName: "John Smith", userId: "U00014859", action: "Reports Generated", actionCategory: "Reports & Analytics", timestamp: "2025-11-02 04:00 PM", status: "Success", ipAddress: "192.168.1.105", remarks: "Some description" },
    { id: 6, sno: 6, userName: "John Smith", userId: "U00014859", action: "Settings Changed", actionCategory: "System Settings", timestamp: "2025-11-02 05:00 PM", status: "Success", ipAddress: "192.168.1.105", remarks: "Some description" },
    { id: 7, sno: 7, userName: "John Smith", userId: "U00014859", action: "Book Issued", actionCategory: "Circulation", timestamp: "2025-11-02 06:00 PM", status: "Success", ipAddress: "192.168.1.105", remarks: "Some description" },
  ];

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(dummyData.map((item) => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id, checked) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const isAllSelected = selectedRows.length === dummyData.length && dummyData.length > 0;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < dummyData.length;

  const {
    page: currentPage,
    size: itemsPerPage,
    search: searchTerm,
    hideColumns,
    handlePageChange,
    handleSearch,
    handleSort,
    getSortIcon,
    handleDateRangeChange,
    getDateRange,
    toggleColumnVisibility,
    isColumnVisible,
  } = useURLParams({
    defaultColumns: [
      "sno",
      "userEmployee",
      "action",
      "timestamp",
      "status",
      "ipAddress",
      "remarks",
    ],
  });

  const defaultColumns = [
    {
      key: "sno",
      label: "S.No",
      sortable: false,
      render: (record) => (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedRows.includes(record.id)}
            onCheckedChange={(checked) => handleSelectRow(record.id, checked)}
          />
          <span>{String(record.sno).padStart(2, '0')}</span>
        </div>
      ),
      headerRender: () => (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isAllSelected ? true : isIndeterminate ? "indeterminate" : false}
            onCheckedChange={handleSelectAll}
            onClick={(e) => e.stopPropagation()}
          />
          <span>S.No</span>
        </div>
      ),
    },
    {
      key: "userEmployee",
      label: "User/Employee",
      sortable: true,
      render: (record) => (
        <div className="flex flex-col">
          <span className="font-normal text-gray-900">{record.userName}</span>
          <span className="text-xs text-gray-500">User ID: {record.userId}</span>
        </div>
      ),
    },
    {
      key: "action",
      label: "Action",
      sortable: true,
      render: (record) => (
        <div className="flex flex-col">
          <span className="font-normal text-gray-900">{record.action}</span>
          <span className="text-xs text-gray-500">{record.actionCategory}</span>
        </div>
      ),
    },
    {
      key: "timestamp",
      label: "Time Stamp",
      sortable: true,
      render: (record) => record.timestamp,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (record) => (
        <span
          className={`inline-flex px-2 py-1 rounded-sm text-xs font-medium ${
            record.status === "Success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {record.status}
        </span>
      ),
    },
    {
      key: "ipAddress",
      label: "IP address",
      sortable: true,
      render: (record) => record.ipAddress,
    },
    {
      key: "remarks",
      label: "Remarks",
      sortable: true,
      render: (record) => record.remarks,
    },
  ];

  const response = {
    data: {
      content: dummyData,
      totalPages: 1,
      totalElements: dummyData.length,
      pageSize: dummyData.length,
    },
  };

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div>
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 sm:gap-4 mb-4 py-2 xl:py-0 border-b -mx-4 px-4">
          <div className="w-full xl:flex-1">
            <ReportViewNavigation currentPage="activitylog" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full xl:w-auto xl:flex-shrink-0">
            <SearchWidget
              placeholder="Search"
              className="w-full sm:w-60 rounded-[14px]!"
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
            {/* <ActivityFilter /> */}
            <ActionFilters
              onDownload={handleDownloadAction}
              endpoint="activitylog"
              fileBaseName="activitylog"
              tooltipWidth="w-200"
              hideFilter={true}
            />
          </div>
        </div>
        <TableWidget
          columns={defaultColumns}
          response={response}
          handleSort={handleSort}
          getSortIcon={getSortIcon}
          toggleColumnVisibility={toggleColumnVisibility}
          isColumnVisible={isColumnVisible}
        />
      </div>
    </PageLayout>
  )
}

export default ActivitylogSection;
