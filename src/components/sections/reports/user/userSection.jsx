"use client";

import React, { useState, useEffect } from 'react'
import PageLayout from '@/components/layouts/PageLayout'
import ReportViewNavigation from '../utils/reportViewNavigation'
import SearchWidget from '@/components/widgets/SearchWidget'
import BulkExportWidget from '@/components/widgets/BulkExportWidget'
import useURLParams from '@/components/custom-hooks/useURLParams'
import TableWidget from '@/components/widgets/TableWidget'
import { Checkbox } from '@/components/ui/checkbox'
import DateRangePicker from '@/components/widgets/DateRangePicker'
import { Calendar } from 'lucide-react'
import ButtonWidget from '@/components/widgets/ButtonWidget'
import UserStatusFilter from '@/components/sections/reports/user/utils/UserStatusFilter'
import { getUserStatusColor } from '@/helpers/FuntionalHelpers'
import { useExportReportToExcel } from '@/store/hooks/ExportHooks'

const UserSection = ({response}) => {
  console.log(response);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { mutateAsync: exportToExcel } = useExportReportToExcel();
  const breadcrumbs = [
    { label: 'User', href: '/reports/user' },
  ]


  const {
    page: currentPage,
    size: itemsPerPage,
    search: searchTerm,
    hideColumns,
    handlePageChange,
    handleSearch,
    handleSort,
    getSortIcon,
    toggleColumnVisibility,
    isColumnVisible,
    handleDateRangeChange,
    getDateRange,
    getCurrentParams,
  } = useURLParams({
    defaultColumns: [
      "sno",
      "userId",
      "joinedDate",
      "name",
      "email",
      "phone",
      "policyName",
      "status",
    ],
    additionalParams: {
      fromDate: {
        paramName: "startDate",
        defaultValue: "",
      },
      toDate: {
        paramName: "endDate",
        defaultValue: "",
      },
      status: {
        paramName: "type",
        defaultValue: "",
      },
    },
  });

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(response.data.content.map((item) => item.internalUserId));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
      setSelectAll(false);
    } else {
      const newSelected = [...selectedRows, id];
      setSelectedRows(newSelected);
      setSelectAll(newSelected.length === response.data.content.length);
    }
  };

  useEffect(() => {
    setSelectedRows([]);
    setSelectAll(false);
  }, [searchTerm]);

  const defaultColumns = [
    {
      key: "sno",
      label: "S.No",
      sortable: false,
      minWidth: "50px",
      lgMinWidth: "60px",
      headerRender: () => (
        <div className="flex items-center gap-2">
          <Checkbox 
            checked={selectAll} 
            onCheckedChange={handleSelectAll}
            onClick={(e) => e.stopPropagation()}
          />
          <span>S.No</span>
        </div>
      ),
      render: (record, index) => {
        const serialNumber = currentPage * itemsPerPage + index + 1;
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedRows.includes(record.internalUserId)}
              onCheckedChange={() => handleSelectRow(record.internalUserId)}
              onClick={(e) => e.stopPropagation()}
            />
            <span>{String(serialNumber).padStart(2, '0')}</span>
          </div>
        );
      },
    },
    {
      key: "userId",
      label: "User ID",
      sortable: true,
    },
    {
      key: "joinedDate",
      label: "Joining Date",
      sortable: true,
    },
    {
      key: "name",
      label: "User Name",
      sortable: true,
    },
    {
      key: "email",
      label: "Email ID",
      sortable: true,
    },
    {
      key: "phone",
      label: "Mobile No",
      sortable: true,
    },
    {
      key: "policyName",
      label: "Policy",
      sortable: true,
    },
    {key: "status",
      label: "Status",
      sortable: true,
        render: (record) => {
          const statusText = record.status === true ? "Active" : "Inactive";
          return (
            <span className={`inline-flex px-2.5 py-1 w-20 justify-center text-xs font-medium rounded-sm ${getUserStatusColor(statusText)}`}>
          {statusText}
        </span>
          );
        },
    },
  ];
  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div>
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 sm:gap-4 mb-4 py-2 xl:py-0 border-b -mx-4 px-4">
          <div className="w-full xl:flex-1">
            <ReportViewNavigation currentPage="user" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full xl:w-auto xl:flex-shrink-0">
            <SearchWidget
              placeholder="Search by User ID"
              value={searchTerm}
              onSearch={handleSearch}
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
            <UserStatusFilter />
            <BulkExportWidget
              title="Export"
              exportFn={exportToExcel}
              selectedItems={selectedRows}
              getItemId={(item) => item.internalUserId}
              params={getCurrentParams()}
              filenameBase="user-report"
              successMessage="User report exported successfully!"
              loading={isExporting}
              requireSelection={false}
              keyName="selectedIds"
              moduleType={1}
              downloadType={3}
              className="h-9 px-3"
            />
          </div>
        </div>
        <TableWidget
          columns={defaultColumns}
          response={response}
          handleSort={handleSort}
          getSortIcon={getSortIcon}
          searchTerm={searchTerm}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          handlePageChange={handlePageChange}
        />
      </div>
    </PageLayout>
  )
}

export default UserSection;