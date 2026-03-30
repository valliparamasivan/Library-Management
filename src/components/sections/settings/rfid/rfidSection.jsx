"use client";

import useURLParams from '@/components/custom-hooks/useURLParams';
import PageLayout from '@/components/layouts/PageLayout';
import { Checkbox } from '@/components/ui/checkbox';
import ButtonWidget from '@/components/widgets/ButtonWidget';
import SearchWidget from '@/components/widgets/SearchWidget';
import TableWidget from '@/components/widgets/TableWidget';
import { getStatusColor } from '@/helpers/FuntionalHelpers';
import { Tag, Unlink, Upload } from 'lucide-react';
import { useState } from 'react';
import SettingsViewNavigation from '../utils/settingsViewNavigation';
import RfidFilter from './utils/rfidFilter';
import ReleaseRfidDialog from './utils/releaseRfidDialog';
import AssignRfidDialog from './utils/assignRfidDialog';
import ScannedTagDialog from './utils/scannedTagDialog';

const RfidSection = () => {
    const breadcrumbs = [
        { label: 'Settings', href: '/settings' },
    ]

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
            "rfid",
            "status",
            "taggedBook",
            "actions",
        ],
    });

    const dummyData = [
        {
            id: 1,
            serialNumber: "01",
            rfid: "DEF2345678",
            status: "Tagged",
            taggedBook: "Pride and Prejudice",
        },
        {
            id: 2,
            serialNumber: "02",
            rfid: "GHI3456789",
            status: "Untagged",
            taggedBook: "",
        },
        {
            id: 3,
            serialNumber: "03",
            rfid: "JKL4567890",
            status: "Untagged",
            taggedBook: "",
        },
        {
            id: 4,
            serialNumber: "04",
            rfid: "MNO5678901",
            status: "Tagged",
            taggedBook: "The Great Gatsby",
        },
        {
            id: 5,
            serialNumber: "05",
            rfid: "PQR6789012",
            status: "Tagged",
            taggedBook: "Moby Dick",
        },
    ];

    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [releaseDialogOpen, setReleaseDialogOpen] = useState(false);
    const [selectedRfid, setSelectedRfid] = useState(null);
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [scannedTagDialogOpen, setScannedTagDialogOpen] = useState(false);

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedRows([]);
        } else {
            setSelectedRows(dummyData.map(item => item.id));
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
            if (newSelected.length === dummyData.length) {
                setSelectAll(true);
            }
        }
    };

    const handleReleaseRfid = (id) => {
        const rfidData = dummyData.find(item => item.id === id);
        if (rfidData) {
            setSelectedRfid(rfidData);
            setReleaseDialogOpen(true);
        }
    };

    const handleConfirmRelease = async (rfidData) => {
    };

    const handleAssignRfid = (id) => {
        setAssignDialogOpen(true);
    };

    const handleScanBarcode = () => {
        setAssignDialogOpen(false);
        setScannedTagDialogOpen(true);
    };

    const handleConfirmAssign = async () => {
    };

    const response = {
        data: {
            content: dummyData,
            totalPages: 1,
            totalElements: dummyData.length,
            pageSize: dummyData.length,
        },
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
            key: "rfid",
            label: "RFID",
            sortable: true,
            minWidth: "120px",
            lgMinWidth: "150px",
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            minWidth: "120px",
            lgMinWidth: "150px",
            render: (record) => (
                <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                        record.status
                    )}`}
                >
                    {record.status}
                </span>
            ),
        },
        {
            key: "taggedBook",
            label: "Tagged Book",
            sortable: true,
            minWidth: "150px",
            lgMinWidth: "180px",
            render: (record) => record.taggedBook || "-",
        },
        {
            key: "actions",
            label: "Actions",
            sortable: false,
            minWidth: "150px",
            lgMinWidth: "180px",
            render: (record) => (
                <div className="flex gap-1">
                    {record.status === "Tagged" ? (
                        <ButtonWidget
                            type="button"
                            onClick={() => handleReleaseRfid(record.id)}
                            className="h-8 px-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 flex items-center gap-2 text-sm w-[140px]"
                        >
                            <Unlink className="w-4 h-4 text-[#00796B]" />
                            Release RFID
                        </ButtonWidget>
                    ) : (
                        <ButtonWidget
                            type="button"
                            onClick={() => handleAssignRfid(record.id)}
                            className="h-8 px-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 flex items-center gap-2 text-sm w-[140px]"
                        >
                            <Tag className="w-4 h-4 text-[#00796B]" />
                            Assign RFID
                        </ButtonWidget>
                    )}
                </div>
            ),
        },
    ];

    return (
        <PageLayout breadcrumbs={breadcrumbs}>
            <div>
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 sm:gap-4 mb-4 py-2 xl:py-0 border-b -mx-4 px-4">
                    <div className="w-full xl:flex-1">
                        <SettingsViewNavigation currentPage="rfid" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full xl:w-auto xl:flex-shrink-0">
                        <SearchWidget
                            placeholder="Search"
                            value={searchTerm}
                            onSearch={handleSearch}
                            className="w-full sm:w-60 rounded-[14px]!"
                        />
                        <RfidFilter />
                        <ButtonWidget
                            type="button"
                            className="h-9 px-3 rounded-sm bg-[#00796B] hover:bg-[#00796B]/90 text-white border-0 shadow-sm flex items-center gap-2"
                        >
                            <Upload className="w-4 h-4 text-white" />
                            Bulk RFID Import
                        </ButtonWidget>
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
            <ReleaseRfidDialog
                open={releaseDialogOpen}
                onOpenChange={setReleaseDialogOpen}
                onConfirm={handleConfirmRelease}
                rfidData={selectedRfid}
            />
            <AssignRfidDialog
                open={assignDialogOpen}
                onOpenChange={setAssignDialogOpen}
                onScan={handleScanBarcode}
            />
            <ScannedTagDialog
                open={scannedTagDialogOpen}
                onOpenChange={setScannedTagDialogOpen}
                onConfirm={handleConfirmAssign}
            />
        </PageLayout>
    )
}

export default RfidSection  