"use client";

import bookImage from '@/assets/image/book.png';
import unlinkIcon from '@/assets/icons/18.svg';
import useURLParams from '@/components/custom-hooks/useURLParams';
import PageLayout from '@/components/layouts/PageLayout';
import ButtonWidget from '@/components/widgets/ButtonWidget';
import ImageWidget from '@/components/widgets/ImageWidget';
import SearchWidget from '@/components/widgets/SearchWidget';
import TableWidget from '@/components/widgets/TableWidget';
import { getStatusColor } from '@/helpers/FuntionalHelpers';
import { ArrowLeft, Book, MapPin, Printer, RotateCw, SquarePen, Tag } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import InventoryDetailsNavigation from '../utils/inventoryDetailsNavigation';
import ReleaseRfidDialog from './utils/releaseRfidDialog';
import AssignLocationDialog from '../location/utils/assignLocationDialog';
import RfidStatusFilter from './utils/rfidStatusFilter';
import BulkRfidPrintDialog from './utils/BulkRfidPrintDialog';
import ReprintDialog from './utils/ReprintDialog';
import TagRfid from './utils/TagRfid';
import PrintRfidTag from './utils/PrintRfidTag';

const RfidSection = ({ slug, bookData: apiBookData, response: apiResponse, sectionDropdown, shelfDropdown, rowDropdown }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const typeFilter = searchParams.get('type');
    const statusFilter = typeFilter === null ? 1 : parseInt(typeFilter, 10);

    const [isReleaseDialogOpen, setIsReleaseDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [releaseRfidData, setReleaseRfidData] = useState(null);
    const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isStatusActive, setIsStatusActive] = useState(true);
    const [isBulkPrintDialogOpen, setIsBulkPrintDialogOpen] = useState(false);
    const [isReprintDialogOpen, setIsReprintDialogOpen] = useState(false);
    const [reprintingRecord, setReprintingRecord] = useState(null);
    const [isTagRfidDialogOpen, setIsTagRfidDialogOpen] = useState(false);
    const [taggingRfidId, setTaggingRfidId] = useState("");
    const [taggingRecord, setTaggingRecord] = useState(null);
    const [isPrintRfidTagDialogOpen, setIsPrintRfidTagDialogOpen] = useState(false);
    const [printingRfidId, setPrintingRfidId] = useState("");

    useEffect(() => {
        setSelectedRows([]);
        setSelectAll(false);
    }, [statusFilter]);

    const breadcrumbs = [
        { label: 'Inventory', href: '/inventory' },
        { label: 'RFID' },
    ];

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
            "checkbox",
            "serialNumber",
            "rfidTagId",
            "status",
            "sectionName",
            "locationName",
            "actions",
        ],
    });

    const bookData = apiBookData?.data ? {
        title: apiBookData.data.title || "",
        availableCopies: apiBookData.data.availableCopies || 0,
        totalCopies: apiBookData.data.totalCopies || 0,
        countLabel: `${apiBookData.data.availableCopies || 0}/${apiBookData.data.totalCopies || 0}`,
        bookImageUrl: apiBookData.data.bookImageUrl,
    } : {
        title: "",
        availableCopies: 0,
        totalCopies: 0,
        countLabel: "0/0",
        bookImageUrl: null,
    };

    const displayImageUrl = bookData?.bookImageUrl 
        ? `https://libraryapi.corpfield.com/books-image/${bookData.bookImageUrl}` 
        : bookImage;

    const mapStatusToDisplay = (status) => {
        const statusMap = {
            'TAGGED': 'Tagged',
            'PRINTED_UNMAPPED': 'Printed Unmapped',
            'UNTAGGED': 'Untagged',
        };
        return statusMap[status] || status;
    };

    const mappedResponse = apiResponse?.data ? {
        data: {
            ...apiResponse.data,
            content: apiResponse.data.content?.map((item, index) => ({
                id: item.bookCopyId,
                bookCopyId: item.bookCopyId,
                serialNumber: String(currentPage * itemsPerPage + index + 1).padStart(2, '0'),
                rfidTagId: item.rfid || "",
                status: mapStatusToDisplay(item.status),
                statusValue: item.status,
                sectionName: item.sectionName || "-",
                locationName: item.locationName || "-",
                rfidId: item.rfidId,
                sectionId: item.sectionId ?? item.locationId,
                shelfId: item.shelfId,
                rowId: item.rowId,
            })) || [],
        },
    } : apiResponse;

    useEffect(() => {
        const currentPageData = mappedResponse?.data?.content || [];
        if (currentPageData.length > 0) {
            const currentPageIds = currentPageData.map((item) => item.id);
            const allCurrentPageSelected = currentPageIds.every((id) => selectedRows.includes(id));
            setSelectAll(allCurrentPageSelected);
        } else {
            setSelectAll(false);
        }
    }, [currentPage, itemsPerPage, mappedResponse, selectedRows]);

    const handleSelectAll = () => {
        const currentPageData = mappedResponse?.data?.content || [];
        if (selectAll) {
            const currentPageIds = currentPageData.map((item) => item.id);
            setSelectedRows(selectedRows.filter((id) => !currentPageIds.includes(id)));
        } else {
            const currentPageIds = currentPageData.map((item) => item.id);
            const newSelected = [...new Set([...selectedRows, ...currentPageIds])];
            setSelectedRows(newSelected);
        }
        setSelectAll(!selectAll);
    };

    const handleSelectRow = (id) => {
        const currentPageData = mappedResponse?.data?.content || [];
        if (selectedRows.includes(id)) {
            setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
            setSelectAll(false);
        } else {
            const newSelected = [...selectedRows, id];
            setSelectedRows(newSelected);
            const currentPageIds = currentPageData.map((item) => item.id);
            setSelectAll(currentPageIds.every((pageId) => newSelected.includes(pageId)));
        }
    };

    const [printingRecord, setPrintingRecord] = useState(null);
    const handlePrintRfid = (record) => {
        setPrintingRfidId(record.rfidTagId || "");
        setPrintingRecord(record);
        setIsPrintRfidTagDialogOpen(true);
    };

    const handleBulkPrintRfid = () => {
        setIsBulkPrintDialogOpen(true);
    };

    const selectedRecords = (mappedResponse?.data?.content || []).filter((r) => selectedRows.includes(r.id));
    const bulkPrintSelectedCount = selectedRecords.length;
    const bulkPrintEligibleCount = selectedRecords.filter(
        (r) => r.status === 'Printed Unmapped' || r.status === 'Untagged'
    ).length;
    const bulkPrintSkippedCount = selectedRecords.filter((r) => r.status === 'Tagged').length;
    const bulkPrintTags = selectedRecords
        .map((r) => r.rfidTagId)
        .filter(Boolean);


    const handleTagRfid = (record) => {
        setTaggingRfidId(record.rfidTagId || "");
        setTaggingRecord(record);
        setIsTagRfidDialogOpen(true);
    };

    const handleTagRfidDialogOpenChange = (open) => {
        setIsTagRfidDialogOpen(open);
        if (!open) {
            setTaggingRfidId("");
            setTaggingRecord(null);
        }
    };

    const handleReleaseRfid = (record) => {
        setEditingId(record.id);
        setReleaseRfidData({ rfidTagId: record.rfidTagId });
        setIsReleaseDialogOpen(true);
    };

    const handleReleaseDialogOpenChange = (open) => {
        setIsReleaseDialogOpen(open);
        if (!open) {
            setReleaseRfidData(null);
        }
    };

    const handleLocation = (record) => {
        setEditingId(record);
        setIsLocationDialogOpen(true);
    };

    const handleLocationDialogOpenChange = (open) => {
        setIsLocationDialogOpen(open);
    };

    const handleReprintRfid = (record) => {
        setReprintingRecord(record);
        setIsReprintDialogOpen(true);
    };

    const handleReprintDialogOpenChange = (open) => {
        setIsReprintDialogOpen(open);
        if (!open) {
            setReprintingRecord(null);
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
            key: "rfidTagId",
            label: "RFID",
            sortable: true,
            minWidth: "150px",
            lgMinWidth: "180px",
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
            key: "sectionName",
            label: "Section",
            sortable: true,
            minWidth: "120px",
            lgMinWidth: "150px",
            render: (record) => (
                <span className="text-sm text-gray-700">{record.sectionName || '-'}</span>
            ),
        },
        {
            key: "locationName",
            label: "Location Name",
            sortable: true,
            minWidth: "150px",
            lgMinWidth: "180px",
            render: (record) => (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">
                        {record.locationName && record.locationName !== '-' ? record.locationName : '-'}
                    </span>
                    {record.locationName && record.locationName !== '-' && (
                        <SquarePen
                            className="w-4 h-4 text-[#00796B] cursor-pointer flex-shrink-0 hover:text-[#005a4d]"
                            onClick={(e) => { e.stopPropagation(); handleLocation(record); }}
                            title="Edit location"
                        />
                    )}
                </div>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            sortable: false,
            minWidth: "150px",
            lgMinWidth: "180px",
            render: (record) => (
                <div className="flex items-center gap-1">
                    {record.status === "Tagged" && (
                        <>
                            <ButtonWidget
                                onClick={() => handleReprintRfid(record)}
                                loader={false}
                                className="h-8 w-8 p-0 rounded-md bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 flex items-center justify-center"
                                title="Refresh"
                            >
                                <RotateCw className="w-4 h-4 text-[#4CAF50]" />
                            </ButtonWidget>
                            <ButtonWidget
                                onClick={() => handleReleaseRfid(record)}
                                className="h-8 w-8 p-0 rounded-md bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 flex items-center justify-center"
                                title="Release RFID"
                            >
                                <ImageWidget src={unlinkIcon} alt="Release RFID" className="w-4 h-4" />
                            </ButtonWidget>
                        </>
                    )}
                    {record.status === "Untagged" && (
                        <ButtonWidget
                            onClick={() => handlePrintRfid(record)}
                            loader={false}
                            className="h-8 w-8 p-0 rounded-md bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 flex items-center justify-center"
                            title="Print"
                        >
                            <Printer className="w-4 h-4 text-[#E77B33]" />
                        </ButtonWidget>
                    )}
                    {record.status === "Printed Unmapped" && (
                        <>
                            <ButtonWidget
                                onClick={() => handleReprintRfid(record)}
                                loader={false}
                                className="h-8 w-8 p-0 rounded-md bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 flex items-center justify-center"
                                title="Reprint"
                            >
                                <RotateCw className="w-4 h-4 text-[#4CAF50]" />
                            </ButtonWidget>
                            <ButtonWidget
                                onClick={() => handleTagRfid(record)}
                                loader={false}
                                className="h-8 w-8 p-0 rounded-md bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 flex items-center justify-center"
                                title="Tag RFID"
                            >
                                <Tag className="w-4 h-4 text-[#00796B]" />
                            </ButtonWidget>
                            <ButtonWidget
                                onClick={() => handleLocation(record)}
                                loader={false}
                                className="h-8 w-8 p-0 rounded-md bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 flex items-center justify-center"
                                title="Assign Location"
                            >
                                <MapPin className="w-4 h-4 text-[#3B31E2]" />
                            </ButtonWidget>
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <PageLayout breadcrumbs={breadcrumbs}>
            <div>
                <div className="flex flex-col gap-3 border-b border-gray-200 -mx-4 px-4 py-3">
                    <div className="flex flex-row items-center justify-between gap-4 border-b border-gray-200 pb-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <ArrowLeft
                                className="h-5 w-5 flex-shrink-0 cursor-pointer text-gray-600 hover:text-gray-900"
                                onClick={() => router.push('/inventory')}
                            />
                            <ImageWidget
                                src={displayImageUrl}
                                alt={bookData.title}
                                className="w-10 h-12 rounded flex-shrink-0 object-cover"
                            />
                            <div className="flex flex-col min-w-0">
                                <h2 className="text-lg font-semibold text-gray-900">{bookData.title}</h2>
                            </div>
                            <div className="flex items-center gap-3 ml-2 sm:ml-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#E8F5E9] border border-[#9CCC65] rounded-md">
                                    <Book className="w-4 h-4 text-[#00796B]" />
                                    <span className="text-sm font-medium text-gray-700">{bookData.countLabel}</span>
                                </div>
                                <span className={`inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-sm ${getStatusColor(isStatusActive ? "Active" : "Inactive")}`}>
                                    {isStatusActive ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 sm:gap-4 py-2 xl:py-0">
                        <div className="w-full xl:flex-1">
                            <InventoryDetailsNavigation currentPage="rfid" slug={slug} />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full xl:w-auto xl:flex-shrink-0">
                            <SearchWidget
                                placeholder="Search by RFID"
                                value={searchTerm}
                                onSearch={handleSearch}
                                className="w-full sm:w-80 rounded-[14px]!"
                            />
                            <ButtonWidget
                                onClick={handleBulkPrintRfid}
                                disabled={selectedRows.length === 0}
                                loader={false}
                                className={`h-9 px-4 rounded-md flex items-center gap-2 text-sm border-0 ${
                                    selectedRows.length === 0
                                        ? "bg-[#807F94] hover:bg-[#807F94] text-white"
                                        : "bg-[#00796B] hover:bg-[#00796B]/90 text-white"
                                }`}
                            >
                                <Printer className="w-4 h-4 text-white" />
                                Print RFID
                            </ButtonWidget>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 mt-2 mb-2">
                    <span className="text-sm text-gray-700">
                        {mappedResponse?.data?.totalElements ?? 0} Records found
                    </span>
                    <RfidStatusFilter />
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
                    height="h-[calc(100vh-355px)]"
                />

                <ReleaseRfidDialog
                    isOpen={isReleaseDialogOpen}
                    onOpenChange={handleReleaseDialogOpenChange}
                    id={editingId}
                    rfidData={releaseRfidData}
                    bookTitle={bookData.title}
                />

                <AssignLocationDialog
                    isOpen={isLocationDialogOpen}
                    onOpenChange={handleLocationDialogOpenChange}
                    id={editingId}
                    sectionDropdown={sectionDropdown}
                    shelfDropdown={shelfDropdown}
                    rowDropdown={rowDropdown}
                />

                <BulkRfidPrintDialog
                    isOpen={isBulkPrintDialogOpen}
                    onOpenChange={setIsBulkPrintDialogOpen}
                    selectedCount={bulkPrintSelectedCount}
                    eligibleCount={bulkPrintEligibleCount}
                    skippedCount={bulkPrintSkippedCount}
                    tagsToPrint={bulkPrintTags}
                />

                <ReprintDialog
                    isOpen={isReprintDialogOpen}
                    onOpenChange={handleReprintDialogOpenChange}
                    currentRfid={reprintingRecord?.rfidTagId || ""}
                    newRfid={reprintingRecord?.rfidTagId || ""}
                    rfidId={reprintingRecord?.rfidId}
                />

                <TagRfid
                    isOpen={isTagRfidDialogOpen}
                    onOpenChange={handleTagRfidDialogOpenChange}
                    rfidTagId={taggingRfidId}
                    bookTitle={bookData.title}
                    record={taggingRecord}
                    sectionDropdown={sectionDropdown}
                    shelfDropdown={shelfDropdown}
                    rowDropdown={rowDropdown}
                />

                <PrintRfidTag
                    isOpen={isPrintRfidTagDialogOpen}
                    onOpenChange={setIsPrintRfidTagDialogOpen}
                    rfidTagId={printingRfidId}
                    rfidId={printingRecord?.rfidId}
                />
            </div>
        </PageLayout>
    );
};

export default RfidSection;