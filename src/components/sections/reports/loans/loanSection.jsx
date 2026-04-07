"use client";

import useURLParams from '@/components/custom-hooks/useURLParams';
import PageLayout from '@/components/layouts/PageLayout';
import LoanStatusFilter from '@/components/sections/reports/loans/utils/LoanStatusFilter';
import ButtonWidget from '@/components/widgets/ButtonWidget';
import DateRangePicker from '@/components/widgets/DateRangePicker';
import SelectableExpandableTableWidget from '@/components/widgets/SelectableExpandableTableWidget';
import SearchWidget from '@/components/widgets/SearchWidget';
import { Calendar } from 'lucide-react';
import ReportViewNavigation from '../utils/reportViewNavigation';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useEffect } from 'react';
import { getLoanActionTypeColor } from '@/helpers/FuntionalHelpers';
import { useExportReportToExcel } from '@/store/hooks/ExportHooks';
import BulkExportWidget from '@/components/widgets/BulkExportWidget';
import { useRouter } from 'next/navigation';
import usePermissions from '@/components/custom-hooks/usePermissions';

export default function LoanSection({response}) {
  console.log(response);
  const router = useRouter();
  const { canView, isLoading: isPermissionsLoading, permissions } = usePermissions();
  const canViewReportLoans = canView('Report Loans');
  const canExportReportLoans = canView('Report Loans Export');

  useEffect(() => {
    if (isPermissionsLoading) return;
    if (permissions.length > 0 && !canViewReportLoans) {
      router.replace('/dashboard');
    }
  }, [isPermissionsLoading, permissions.length, canViewReportLoans, router]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { mutateAsync: exportToExcel } = useExportReportToExcel();
  const breadcrumbs = [
    { label: 'Loans', href: '/reports/loan' },
  ]
;

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
    getCurrentParams,
  } = useURLParams({
    defaultColumns: [
      "serialNumber",
      "userName",
      "userId",
      "title",
      "rfid",
      "checkOutDate",
      "dueDate",
      "checkInDate",
      "renewedDate",
      "renewalCount",
      "overdueDays",
      "fineAmount",
      "loanStatus",
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
      setSelectedRows(response.data.content.map((item) => item.circulationLogId));
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
      key: "serialNumber",
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
              checked={selectedRows.includes(record.circulationLogId)}
              onCheckedChange={() => handleSelectRow(record.circulationLogId)}
              onClick={(e) => e.stopPropagation()}
            />
            <span>{String(serialNumber).padStart(2, '0')}</span>
          </div>
        );
      },
    },
    {
      key: "userName",
      label: "User",
      sortable: true,
      minWidth: "120px",
      lgMinWidth: "150px",
    },
    {
      key: "userId",
      label: "User ID",
      sortable: true,
      minWidth: "120px",
      lgMinWidth: "150px",
    },
    {
      key: "title",
      label: "Book Details",
      sortable: true,
      minWidth: "150px",
      lgMinWidth: "180px",
      render: (record) => (
        <span className="text-sm text-gray-900">{record.title}</span>
      ),
    },
    {
      key: "rfid",
      label: "RFID",
      sortable: true,
      minWidth: "120px",
      lgMinWidth: "150px",
    },
    {
      key: "checkOutDate",
      label: "Check-Out Date",
      sortable: true,
      minWidth: "130px",
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
      label: "Check-in Date",
      sortable: true,
      minWidth: "130px",
      lgMinWidth: "150px",
    },
    {
      key: "renewedDate",
      label: "Renewed Date",
      sortable: true,
      minWidth: "120px",
      lgMinWidth: "150px",  
    },
    {
      key:"renewalCount",
      label: "Renewal Count",
      sortable: true,
      minWidth: "120px",
      lgMinWidth: "150px",
      render: (record) => {
        const renewalCount = record.renewalCount;
        return (
          <p className="text-sm text-gray-900">
            {renewalCount}
          </p>
        );
      },
    },
    {
      key: "overdueDays",
      label: "Overdue Days",
      sortable: true,
      minWidth: "120px",
      lgMinWidth: "150px",
      render: (record) => {
        const overdueDays = record.overdueDays;
        const isOverdue = overdueDays > 0;
        return (
          <span className={isOverdue ? "text-[#F44336]" : "text-gray-900"}>
            {String(overdueDays)}
          </span>
        );
      },
    },
    {
      key: "fineAmount",
      label: "Fine",
      sortable: true,
      minWidth: "100px",
      lgMinWidth: "120px",
      render: (record) => {
        const fineAmount = record.fineAmount || 0;
        const formattedFine = `$${fineAmount}`;
        const isOverdue = fineAmount > 0;
        return (
          <span className={isOverdue ? "text-[#F44336]" : "text-gray-900"}>
            {formattedFine}
          </span>
        );
      },
    },
    {
      key: "loanStatus",
      label: "Status",
      sortable: true,
      minWidth: "120px",
      lgMinWidth: "150px",
      render: (record) => {
        return (
          <div className="flex justify-center">
            <span className={`inline-flex px-2.5 py-1 w-24 justify-center text-xs font-medium rounded-sm ${getLoanActionTypeColor(record.loanStatus)}`}>
              {record.loanStatus}
            </span>
          </div>
        );
      },  
    },
  ];

  const renderExpandedContent = (record) => {
    const overdueDays = record.overdueDays || 0;
    const isOverdue = overdueDays > 0;
    const fineAmount = record.fineAmount || 0;
    const formattedFine = `$${fineAmount}`;
    return (
      <div className="p-4 bg-white">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left text-xs font-medium text-gray-700 px-4 py-2">Renewed Date</th>
              <th className="text-left text-xs font-medium text-gray-700 px-4 py-2">Overdue Days</th>
              <th className="text-left text-xs font-medium text-gray-700 px-4 py-2">Fine</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white">
              <td className="px-4 py-2 text-sm text-gray-900">{record.renewedDate || "-"}</td>
              <td className={`px-4 py-2 text-sm ${isOverdue ? "text-red-600" : "text-gray-900"}`}>
                {String(overdueDays).padStart(2, '0')}
              </td>
              <td className={`px-4 py-2 text-sm ${isOverdue ? "text-red-600" : "text-gray-900"}`}>
                {formattedFine}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  if (!isPermissionsLoading && permissions.length > 0 && !canViewReportLoans) {
    return null;
  }

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div>
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 sm:gap-4 mb-4 py-2 xl:py-0 border-b -mx-4 px-4">
          <div className="w-full xl:flex-1">
            <ReportViewNavigation currentPage="loan" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full xl:w-auto xl:flex-shrink-0">
            <SearchWidget
              placeholder="Search by loan ID, title, author, ISBN..."
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
            <LoanStatusFilter />
            {canExportReportLoans && (
              <BulkExportWidget
                title="Export"
                exportFn={exportToExcel}
                selectedItems={selectedRows}
                getItemId={(item) => item.circulationLogId}
                params={getCurrentParams()}
                filenameBase="loan-report"
                successMessage="Loan report exported successfully!"
                loading={isExporting}
                requireSelection={false}
                keyName="ids"
                moduleType={2}
                downloadType={3}
                className="h-9 px-3"
              />
            )}
          </div>
        </div>
        <div className="mt-4">
          <SelectableExpandableTableWidget
            columns={defaultColumns}
            response={response}
            handleSort={handleSort}
            getSortIcon={getSortIcon}
            searchTerm={searchTerm}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            handlePageChange={handlePageChange}
            getRowId={(record) => record.circulationLogId}
            noDataTitle="No loan records found"
            noDataDescription="No loan records have been added yet."
            noDataIcon="book"
            renderExpandedContent={renderExpandedContent}
            height="h-[calc(100vh-230px)]"
          />
        </div>
      </div>
    </PageLayout>
  )
}
