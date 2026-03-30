"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "lucide-react";
import PageLayout from "@/components/layouts/PageLayout";
import TitleWidget from "@/components/widgets/TitleWidget";
import SearchWidget from "@/components/widgets/SearchWidget";
import TableWidget from "@/components/widgets/TableWidget";
import DateRangePicker from "@/components/widgets/DateRangePicker";
import DocumentWidget from "@/components/widgets/DocumentWidget";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import useURLParams from "@/components/custom-hooks/useURLParams";
import BulkExportWidget from "@/components/widgets/BulkExportWidget";
import { useExportReportToExcel } from "@/store/hooks/ExportHooks";

const ActivitylogSection = ({response}) => {
    console.log(response);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const { mutateAsync: exportToExcel } = useExportReportToExcel();
    const breadcrumbs = [
        { label: 'Activity Log', href: '/activitylog' },
    ];

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
            "checkbox",
            "serialNumber",
            "timeStamp",
            "book",
            "rfid",
            "action",
            "user",
            "userId",
            "employee",
            "employeeId",
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
            },
    });

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedRows([]);
        } else {
            setSelectedRows(response.data.content.map((item) => item.activityLogId));
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
            key: "checkbox",
            label: "S.No",
            sortable: false,
            minWidth: "50px",
            lgMinWidth: "60px",
            headerRender: () => (
                <div className="flex items-center gap-2">
                    <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
                    <span>S.No</span>
                </div>
            ),
            render: (record, index) => {
                const serialNumber = currentPage * itemsPerPage + index + 1;
                return (
                    <div className="flex items-center gap-2">
                        <Checkbox
                            checked={selectedRows.includes(record.activityLogId)}
                            onCheckedChange={() => handleSelectRow(record.activityLogId)}
                        />
                        <span>{String(serialNumber).padStart(2, "0")}</span>
                    </div>
                );
            },
        },
        {
            key: "dateTime",
            label: "Time Stamp",
            sortable: true,
            minWidth: "150px",
            lgMinWidth: "180px",
        },
        {
            key: "bookTitle",
            label: "Book",
            sortable: true,
            minWidth: "120px",
            lgMinWidth: "150px",
        },
        {
            key: "rfid",
            label: "RFID",
            sortable: true,
            minWidth: "120px",
            lgMinWidth: "150px",
        },
        {
            key: "activityMessage",
            label: "Action",
            sortable: true,
            minWidth: "120px",
            lgMinWidth: "150px",
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
            key: "employeeName",
            label: "Employee",
            sortable: true,
            minWidth: "120px",
            lgMinWidth: "150px",
        },
        {
            key: "employeeCode",
            label: "Employee ID",
            sortable: true,
            minWidth: "120px",
            lgMinWidth: "150px",
        },
    ];

    return (
        <PageLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 mb-4 py-2 border-b -mx-4 px-4">
                <TitleWidget title="Activity Log" />
                <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
                    <div className="flex items-center gap-2 flex-wrap">
                        <SearchWidget
                            placeholder="Search by loan ID, title, author, ISBN..."
                            value={searchTerm}
                            onSearch={handleSearch}
                            className="w-full sm:w-80 rounded-[14px]!"
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
                        <BulkExportWidget
                            title="Export"
                            exportFn={exportToExcel}
                            selectedItems={selectedRows}
                            getItemId={(item) => item.activityLogId}
                            params={getCurrentParams()}
                            filenameBase="activitylog-report"
                            successMessage="Activity log report exported successfully!"
                            loading={isExporting}
                            requireSelection={false}
                            keyName="selectedIds"
                            moduleType={4}
                            downloadType={3}
                            className="h-9 px-3"
                        />
                    </div>
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
        </PageLayout>
    );
};

export default ActivitylogSection;
