"use client";

import useURLParams from '@/components/custom-hooks/useURLParams';
import PageLayout from '@/components/layouts/PageLayout';
import ButtonWidget from '@/components/widgets/ButtonWidget';
import SearchWidget from '@/components/widgets/SearchWidget';
import TableWidget from '@/components/widgets/TableWidget';
import { getUserStatusColor } from '@/helpers/FuntionalHelpers';
import { Plus, SquarePen } from 'lucide-react';
import { useState } from 'react';
import SettingsViewNavigation from '../utils/settingsViewNavigation';
import PolicyFormDialog from './utils/policyFormDialog';
import usePermissions from '@/components/custom-hooks/usePermissions';

const PolicySection = ({ response }) => {
    const { canAnyAdd, canAnyEdit } = usePermissions();
    const settingsPerms = ["Settings", "Policy"];
    console.log(response);
    const breadcrumbs = [
        { label: 'Settings', href: '/settings' },
    ]

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [selectedPolicyData, setSelectedPolicyData] = useState(null);

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
            "policyName",
            "maxBooksAllowed",
            "loanPeriodDays",
            "finePerDay",
            "maxRenewalPerBook",
            "reservationLimit",
            "reservationHoldPeriodDays",
            "active",
            "actions",
        ],
    });


    const handleConfirmDelete = (id) => {
        console.log("Delete policy:", id);
    };

    const handleEditClick = (record) => {
        setEditingId(record.policyId || record.id);
        setSelectedPolicyData(record);
        setIsDialogOpen(true);
    };

    const handleAddNew = () => {
        setEditingId(null);
        setSelectedPolicyData(null);
        setIsDialogOpen(true);
    };

    const handleDialogOpenChange = (open) => {
        setIsDialogOpen(open);
        if (!open) {
            setEditingId(null);
            setSelectedPolicyData(null);
        }
    };


    const defaultColumns = [
        {
            key: "sno",
            label: "S.No",
            sortable: false,
            minWidth: "80px",
            lgMinWidth: "100px",
            render: (record, index) => {
                const serialNumber = currentPage * itemsPerPage + index + 1;
                return (
                    <span>{String(serialNumber).padStart(2, '0')}</span>
                );
            },
        },
        {
            key: "policyName",
            label: "Policy",
            sortable: true,
            minWidth: "150px",
            lgMinWidth: "180px",
        },
        {
            key: "maxBooksAllowed",
            label: "Max Books",
            sortable: false,
            minWidth: "120px",
            lgMinWidth: "150px",
        },
        {
            key: "loanPeriodDays",
            label: "Loan Period Days",
            sortable: false,
            minWidth: "120px",
            lgMinWidth: "150px",
        },
        {
            key: "finePerDay",
            label: "Fine Rate",
            sortable: false,
            minWidth: "120px",
            lgMinWidth: "150px",
        },
        {
            key: "maxRenewalPerBook",
            label: "Max Renewals",
            sortable: false,
            minWidth: "120px",
            lgMinWidth: "150px",
        },
        {
            key: "reservationLimit",
            label: "Reservation Limit",
            sortable: false,
            minWidth: "120px",
            lgMinWidth: "150px",
            render: (record) => (
                <span className="text-sm text-gray-900">{record.reservationLimit ?? "-"}</span>
            ),
        },
        {
            key: "reservationHoldPeriodDays",
            label: "Hold Period (Days)",
            sortable: false,
            minWidth: "120px",
            lgMinWidth: "150px",
            render: (record) => (
                <span className="text-sm text-gray-900">{record.reservationHoldPeriodDays ?? "-"}</span>
            ),
        },
        {
            key: "active",
            label: "Status",
            sortable: true,
            minWidth: "120px",
            lgMinWidth: "150px",
            render: (record) => {
                const isActive = record.active ?? false;
                const statusText = isActive ? "Active" : "Inactive";
                const statusColor = getUserStatusColor(statusText);
                return (
                    <span className={`inline-flex px-3 py-1.5 text-xs font-medium rounded-sm w-20 justify-center ${statusColor}`}>
                        {statusText}
                    </span>
                );
            },
        },
        ...(canAnyEdit(settingsPerms) ? [{
            key: "actions",
            label: "Actions",
            sortable: false,
            minWidth: "120px",
            render: (record) => (
                <div className="flex gap-1">
                    <button
                        onClick={() => handleEditClick(record)}
                        className="p-1.5 hover:bg-gray-100 rounded border border-gray-300 cursor-pointer"
                        title="Edit"
                    >
                        <SquarePen className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            ),
        }] : []),
    ];

    return (
        <PageLayout breadcrumbs={breadcrumbs}>
            <div>
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 sm:gap-4 mb-4 py-2 xl:py-0 border-b -mx-4 px-4">
                    <div className="w-full xl:flex-1">
                        <SettingsViewNavigation currentPage="policy" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full xl:w-auto xl:flex-shrink-0">
                        <SearchWidget
                            placeholder="Search by Policy Name"
                            value={searchTerm}
                            onSearch={handleSearch}
                            className="w-full sm:w-60 rounded-[14px]!"
                        />
                        {canAnyAdd(settingsPerms) && (
                            <ButtonWidget
                                onClick={handleAddNew}
                                className="h-9 px-3 rounded-sm bg-[#00796B] hover:bg-[#00796B]/90 text-white border-0 shadow-sm flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4 text-white" />
                                Add Policy
                            </ButtonWidget>
                        )}
                        <PolicyFormDialog
                            isOpen={isDialogOpen}
                            onOpenChange={handleDialogOpenChange}
                            id={editingId}
                            policyData={selectedPolicyData}
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

export default PolicySection  