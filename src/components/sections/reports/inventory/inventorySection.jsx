"use client";

import React, { useState, useEffect } from 'react'
import PageLayout from '@/components/layouts/PageLayout'
import ReportViewNavigation from '../utils/reportViewNavigation'
import SearchWidget from '@/components/widgets/SearchWidget'
import ActionFilters from '@/components/widgets/ActionFilters'
import useURLParams from '@/components/custom-hooks/useURLParams'
import TableWidget from '@/components/widgets/TableWidget'
import { Checkbox } from '@/components/ui/checkbox'
import DateRangePicker from '@/components/widgets/DateRangePicker';
import { Calendar, BookOpen ,BookMinus} from 'lucide-react';
import InventoryFilter from './utils/inventoryFilter'
import ButtonWidget from '@/components/widgets/ButtonWidget'
import { getStatusColor } from '@/helpers/FuntionalHelpers'
import { useExportReportToExcel } from '@/store/hooks/ExportHooks';
import BulkExportWidget from '@/components/widgets/BulkExportWidget';

const InventorySection = ({response}) => {
  console.log(response);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { mutateAsync: exportToExcel } = useExportReportToExcel();
  const breadcrumbs = [
    { label: 'Inventory', href: '/reports/inventory' },
  ]

  const handleDownloadAction = () => {
    console.log("Download action");
  };

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
      "title",
      "author",
      "isbn",
      "language",
      "publisher",
      "year",
      "category",
      "availability",
      "rfid",
      "location",
      "status",
      "bookCopyId",
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
      availability: {
        paramName: "availabilityType",
        defaultValue: "",
      },
    },
  });

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(response.data.content.map((item) => item.bookCopyId || item.rfid || `${item.isbn}-${item.rfid}`));
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
        const recordId = record.bookCopyId;
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedRows.includes(recordId)}
              onCheckedChange={() => handleSelectRow(recordId)}
              onClick={(e) => e.stopPropagation()}
            />
            <span>{String(serialNumber).padStart(2, '0')}</span>
          </div>
        );
      },
    },
    {
      key: "title",
      label: "Title",
      sortable: true,
    },
    {
      key: "author",
      label: "Author",
      sortable: true,
    },
    {
      key: "isbn",
      label: "ISBN",
      sortable: true,
    },
    {
      key: "language",
      label: "Language",
      sortable: true,
    },
    {
      key: "publisher",
      label: "Publisher",
      sortable: true,
    },
    {
      key: "year",
      label: "Publish Year",
      sortable: true,
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
    },
    {
      key: "availability",
      label: "Availability",
      sortable: true,
      render: (record) => (
        <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md bg-[#F0FDF4] border border-[#00A63E] text-[#1A1A1A]">
          {/* <BookMinus className="w-4 h-4 text-[#00796B]" /> */}
          {record.availability}
        </span>
      ),
    },
    {
      key: "rfid",
      label: "RFID",
      sortable: true,
    },
    {
      key: "location",
      label: "Location",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (record) => {
        const isActive = record.status ?? false;
        const statusText = isActive ? "Active" : "Inactive";
        const statusColor = getStatusColor(statusText);
        return (
          <span className={`inline-flex items-center justify-center w-20 px-3 py-1.5 text-xs font-medium rounded-sm ${statusColor}`}>
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
            <ReportViewNavigation currentPage="inventory" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full xl:w-auto xl:flex-shrink-0">
            <SearchWidget
              placeholder="Search"
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
            <InventoryFilter />
            <BulkExportWidget
              title="Export"
              exportFn={exportToExcel}
              selectedItems={selectedRows}
              getItemId={(item) => item.bookCopyId}
              params={getCurrentParams()}
              filenameBase="inventory-report"
              successMessage="Inventory report exported successfully!"
              loading={isExporting}
              requireSelection={false}
              keyName="ids"
              moduleType={3}
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

export default InventorySection;