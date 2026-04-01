"use client";

import useURLParams from '@/components/custom-hooks/useURLParams';
import PageLayout from '@/components/layouts/PageLayout';
import { Checkbox } from '@/components/ui/checkbox';
import SearchWidget from '@/components/widgets/SearchWidget';
import TableWidget from '@/components/widgets/TableWidget';
import ButtonWidget from '@/components/widgets/ButtonWidget';
import { getStatusColor } from '@/helpers/FuntionalHelpers';
import { SquarePen, Plus } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SettingsViewNavigation from '../utils/settingsViewNavigation';
import EmployeeFormDialog from './utils/employeeFormDialog';
import { useChangeEmployeeStatus } from '@/store/hooks/SettingsHooks';
import useErrorHandler from '@/components/custom-hooks/useErrorHandler';
import { Switch } from '@/components/ui/switch';

const EmployeeSection = ({ response: apiResponse, rolesResponse }) => {
    const router = useRouter();
    const breadcrumbs = [
        { label: 'Settings', href: '/settings' },
    ]

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const { mutateAsync: changeStatus } = useChangeEmployeeStatus();
    const { showErrorToast, showSuccessToast } = useErrorHandler();

    const handleStatusToggle = async (id) => {
        try {
            const response = await changeStatus(id);
            showSuccessToast(response?.message || "Status updated successfully");
            router.refresh();
        } catch (error) {
            showErrorToast(error);
        }
    };

    const {
        page: currentPage,
        size: itemsPerPage,
        search: searchTerm,
        handlePageChange,
        handleSearch,
        handleSort,
        getSortIcon,
    } = useURLParams({
        defaultColumns: [
            "serialNumber",
            "employeeId",
            "employeeName",
            "email",
            "role",
            "status",
            "actions",
        ],
    });

    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const pageData = apiResponse?.data;
    const mappedResponse = pageData?.content != null ? {
        data: {
          ...pageData,
          pageSize: pageData.size ?? pageData.pageSize,
          content: pageData.content.map((item, index) => ({
            id: item.employeeId,
            serialNumber: String(currentPage * itemsPerPage + index + 1).padStart(2, "0"),
            employeeId: item.employeeCode,
            employeeName: item.employeeName,
            email: item.emailId,
            role: item.role,
            status: item.active,
          })),
        },
    } : apiResponse;

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedRows([]);
        } else {
            const allIds = mappedResponse?.data?.content?.map(item => item.id) || [];
            setSelectedRows(allIds);
        }
        setSelectAll(!selectAll);
    };

    const handleSelectRow = (id) => {
        if (selectedRows.includes(id)) {
            setSelectedRows(selectedRows.filter(rowId => rowId !== id));
            setSelectAll(false);
        } else {
            const newSelected = [...selectedRows, id];
            setSelectedRows(newSelected);
            const totalElements = mappedResponse?.data?.content?.length || 0;
            if (newSelected.length === totalElements && totalElements > 0) {
                setSelectAll(true);
            }
        }
    };


    const handleConfirmDelete = (id) => {
        console.log("Delete employee:", id);
    };

    const handleEditClick = (id) => {
        setEditingId(id);
        setIsDialogOpen(true);
    };

    const handleAddNew = () => {
        setEditingId(null);
        setIsDialogOpen(true);
    };

    const handleDialogOpenChange = (open) => {
        setIsDialogOpen(open);
        if (!open) {
            setEditingId(null);
        }
    };

    const defaultColumns = [
        {
            key: "checkbox",
            label: "",
            sortable: false,
            minWidth: "50px",
            lgMinWidth: "60px",
            headerRender: () => (
                <div className="flex items-center justify-center w-full">
                    <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
                </div>
            ),
            render: (record) => (
                <div className="flex items-center justify-center w-full">
                    <Checkbox
                        checked={selectedRows.includes(record.id)}
                        onCheckedChange={() => handleSelectRow(record.id)}
                    />
                </div>
            ),
        },
        {
            key: "serialNumber",
            label: "S.No",
            sortable: true,
            minWidth: "80px",
            lgMinWidth: "100px",
        },
        {
            key: "employeeId",
            label: "Employee ID",
            sortable: true,
            minWidth: "120px",
            lgMinWidth: "150px",
        },
        {
            key: "employeeName",
            label: "Employee Name",
            sortable: true,
            minWidth: "150px",
            lgMinWidth: "180px",
        },
        {
            key: "email",
            label: "E-Mail ID",
            sortable: true,
            minWidth: "180px",
            lgMinWidth: "220px",
        },
        {
            key: "role",
            label: "Role",
            sortable: true,
            minWidth: "120px",
            lgMinWidth: "150px",
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            minWidth: "100px",
            lgMinWidth: "120px",
            render: (record) => {
                const isActive = record.status ?? false;
                return (
                    <Switch
                        checked={isActive}
                        onCheckedChange={() => handleStatusToggle(record.id)}
                        className="data-[state=checked]:bg-[#00796B] data-[state=unchecked]:bg-gray-300"
                    />
                );
            },
        },
        {
            key: "actions",
            label: "Actions",
            sortable: false,
            minWidth: "120px",
            render: (record) => (
                <div className="flex gap-1">
                    <button
                        onClick={() => handleEditClick(record.id)}
                        className="p-1.5 hover:bg-gray-100 rounded border border-gray-300 cursor-pointer"
                        title="Edit"
                    >
                        <SquarePen className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <PageLayout breadcrumbs={breadcrumbs}>
            <div>
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 sm:gap-4 mb-4 py-2 xl:py-0 border-b -mx-4 px-4">
                    <div className="w-full xl:flex-1">
                        <SettingsViewNavigation currentPage="employees" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full xl:w-auto xl:flex-shrink-0">
                        <SearchWidget
                            placeholder="Search by User Role Name"
                            value={searchTerm}
                            onSearch={handleSearch}
                            className="w-full sm:w-60 rounded-[14px]!"
                        />
                        <ButtonWidget
                            onClick={handleAddNew}
                            className="h-9 px-3 rounded-sm bg-[#00796B] hover:bg-[#00796B]/90 text-white border-0 shadow-sm flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4 text-white" />
                            Add Employee
                        </ButtonWidget>
                        <EmployeeFormDialog
                            isOpen={isDialogOpen}
                            onOpenChange={handleDialogOpenChange}
                            id={editingId}
                            rolesResponse={rolesResponse}
                            employeeData={pageData?.content?.find(emp => emp.employeeId === editingId)}
                        />
                    </div>
                </div>
                <TableWidget
                    columns={defaultColumns}
                    response={mappedResponse}
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

export default EmployeeSection
