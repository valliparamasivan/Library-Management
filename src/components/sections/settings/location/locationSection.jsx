"use client";

import useURLParams from '@/components/custom-hooks/useURLParams';
import PageLayout from '@/components/layouts/PageLayout';
import SearchWidget from '@/components/widgets/SearchWidget';
import TableWidget from '@/components/widgets/TableWidget';
import ButtonWidget from '@/components/widgets/ButtonWidget';
import { getStatusColor } from '@/helpers/FuntionalHelpers';
import { SquarePen, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import SettingsViewNavigation from '../utils/settingsViewNavigation';
import LocationFormDialog from './utils/locationFormDialog';

const LocationSection = ({ response }) => {
    console.log("response", response);
    const breadcrumbs = [
        { label: 'Settings', href: '/settings' },
    ]

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

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
            "sectionName",
            "shelfName",
            "rowName",
            "status",
            "actions",
        ],
    });

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
            key: "serialNumber",
            label: "S.No",
            sortable: false,
            minWidth: "80px",
            lgMinWidth: "100px",
            render: (record, index) => {
                const serialNumber = currentPage * itemsPerPage + index + 1;
                return (
                    <span>{String(serialNumber).padStart(2, "0")}</span>
                );
            },
        },
        {
            key: "sectionName",
            label: "Section Name",
            sortable: true,
            minWidth: "150px",
            lgMinWidth: "180px",
        },
        {
            key: "shelfName",
            label: "Shelf Name",
            sortable: true,
            minWidth: "120px",
            lgMinWidth: "150px",
        },
        {
            key: "rowName",
            label: "Row Name",
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
                const statusText = isActive ? "Active" : "Inactive";
                const statusColor = getStatusColor(statusText);
                return (
                    <span className={`inline-flex items-center justify-center w-20 px-3 py-1.5 text-xs font-medium rounded-sm ${statusColor}`}>
                        {statusText}
                    </span>
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
                        onClick={() => handleEditClick(record.locationId)}
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
                        <SettingsViewNavigation currentPage="location" />
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
                            Add Location
                        </ButtonWidget>
                        <LocationFormDialog
                            isOpen={isDialogOpen}
                            onOpenChange={handleDialogOpenChange}
                            id={editingId}
                            locationData={editingId ? response?.data?.content?.find(item => item.locationId === editingId) : null}
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

export default LocationSection  