"use client";

import bookImage from '@/assets/image/book.png';
import icon3Svg from '@/assets/icons/16.svg';
import useURLParams from '@/components/custom-hooks/useURLParams';
import PageLayout from '@/components/layouts/PageLayout';
import ButtonWidget from '@/components/widgets/ButtonWidget';
import ImageWidget from '@/components/widgets/ImageWidget';
import SearchWidget from '@/components/widgets/SearchWidget';
import ExpandableTableWidget from '@/components/widgets/ExpandableTableWidget';
import { getLoanActionTypeColor } from '@/helpers/FuntionalHelpers';
import { ArrowLeft, Book, Calendar, FileText, Info, RefreshCw, Settings, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { useReturnBook, useRenewBook } from '@/store/hooks/CirculationHooks';
import usePermissions from '@/components/custom-hooks/usePermissions';
import useErrorHandler from '@/components/custom-hooks/useErrorHandler';
import InventoryDetailsNavigation from '../utils/inventoryDetailsNavigation';
import ReturnDialog from './utils/returnDialog';
import RenewDialog from './utils/renewDialog';
import RenewLimitReachedModal from './utils/RenewLimitReachedModal';
import LoanStatusFilter from './utils/loanStatusFilter';
import RenewalHistoryDialog from './utils/renewalHistoryDialog';
import CheckInDialog from '@/components/sections/inventory/inventory-details/loan/utils/CheckInDialog';
import RenewConfirmDialog from '@/components/sections/inventory/inventory-details/loan/utils/RenewConfirmDialog';
import TransferSuccessDialog from '@/components/sections/inventory/inventory-details/loan/utils/CheckinSuccesPopup';
import RenewSuccessDialog from '@/components/sections/inventory/inventory-details/loan/utils/RenewSuccessPopup';


const LoanSection = ({ slug, loansResponse, bookData: apiBookData }) => {
    const router = useRouter();
    const { canAnyEdit } = usePermissions();
    const loanPerms = ["Active Transactions"];
    const { mutateAsync: returnBookApi } = useReturnBook();
    const { mutateAsync: renewBookApi } = useRenewBook();
    const { showErrorToast } = useErrorHandler();
    const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
    const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
    const [isTransferSuccessOpen, setIsTransferSuccessOpen] = useState(false);
    const [isRenewBookDueDateDialogOpen, setIsRenewBookDueDateDialogOpen] = useState(false);
    const [isRenewSuccessDialogOpen, setIsRenewSuccessDialogOpen] = useState(false);
    const [isRenewDialogOpen, setIsRenewDialogOpen] = useState(false);
    const [selectedBookData, setSelectedBookData] = useState(null);
    const [isRenewLimitModalOpen, setIsRenewLimitModalOpen] = useState(false);
    const [renewLimitUser, setRenewLimitUser] = useState({ userName: "", userDetailId: "" });
    const [isRenewalHistoryDialogOpen, setIsRenewalHistoryDialogOpen] = useState(false);
    const [selectedRenewalHistory, setSelectedRenewalHistory] = useState([]);

    const extractErrorMessage = (error, fallback) => {
        const errData = error?.data || error?.response?.data;
        const fieldErrors = errData?.errorMessages;
        if (fieldErrors) {
            const firstMsg = Object.values(fieldErrors).flat().filter(Boolean)[0];
            if (firstMsg) return firstMsg;
        }
        return errData?.message || error?.message || fallback;
    };

    const handleTransferConfirm = async () => {
        try {
            await returnBookApi({
                userId: String(selectedBookData?.internalUserId),
                rfidList: [selectedBookData?.rfid],
            });
            setIsTransferDialogOpen(false);
            setIsTransferSuccessOpen(true);
            router.refresh();
        } catch (error) {
            showErrorToast(extractErrorMessage(error, "Check-in failed"));
        }
    };

    const handleRenewConfirm = async () => {
        try {
            await renewBookApi({
                userId: String(selectedBookData?.internalUserId),
                rfidList: [selectedBookData?.rfid],
            });
            setIsRenewBookDueDateDialogOpen(false);
            setIsRenewSuccessDialogOpen(true);
            router.refresh();
        } catch (error) {
            showErrorToast(extractErrorMessage(error, "Renewal failed"));
        }
    };
    
    const breadcrumbs = [
        { label: 'Inventory', href: '/inventory' },
        { label: 'Loan' },
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
            "serialNumber",
            "userName",
            "checkOutDate",
            "dueDate",
            "checkInDate",
            "renewedDate",
            "renewalCount",
            "overdueDays",
            "fine",
            "status",
            "actions",
        ],
    });

    const bookTitle = apiBookData?.data?.title || "Untitled";
    const bookImageUrl = apiBookData?.data?.bookImageUrl || null;
    const displayImageUrl = bookImageUrl
        ? `https://libraryapi.corpfield.com/books-image/${bookImageUrl}`
        : bookImage;

    const mappedContent = useMemo(() => {
        const content = loansResponse?.data?.content ?? [];

        const parseRenewalCount = (renewalCount) => {
            const parts = String(renewalCount ?? "0/0").split("/");
            const current = parseInt(parts[0] || "0", 10);
            const max = parseInt(parts[1] || "0", 10);
            return {
                current: Number.isFinite(current) ? current : 0,
                max: Number.isFinite(max) ? max : 0,
            };
        };

        const parseFineAmount = (fine) => {
            if (typeof fine === "number") return Number.isFinite(fine) ? fine : 0;
            if (typeof fine === "string") {
                const n = parseFloat(fine.replace(/[^0-9.\-]/g, ""));
                return Number.isFinite(n) ? n : 0;
            }
            return 0;
        };

        return content.map((loan, index) => {
            const { current, max } = parseRenewalCount(loan?.renewalCount);
            const fineAmount = parseFineAmount(loan?.fine);

            return {
                // Unique per row for expansion + selection
                id: `${loan?.internalUserId ?? ""}-${loan?.userId ?? ""}-${loan?.checkOutDate ?? ""}-${loan?.dueDate ?? ""}-${loan?.checkInDate ?? ""}-${loan?.renewedDate ?? ""}-${loan?.renewalCount ?? ""}-${index}`,

                userName: loan?.userName ?? "",
                userId: loan?.userId ?? "",
                fullName: loan?.userName ?? "",
                userDetailId: loan?.userId ?? "",
                internalUserId: loan?.internalUserId ?? "",
                rfid: loan?.rfid ?? "",

                checkOutDate: loan?.checkOutDate ?? null,
                dueDate: loan?.dueDate ?? null,
                checkInDate: loan?.checkInDate ?? null,
                renewedDate: loan?.renewedDate ?? null,

                renewalCount: current,
                maxRenewals: max,

                overdueDays: loan?.overdueDays ?? 0,
                fine: fineAmount,
                fineAmount: fineAmount,

                // Keep original status label so the color helper matches
                status: loan?.status ?? "",
                statusLabel: loan?.status ?? "",

                // Book info for dialogs & expanded view
                bookTitle,
                bookId: slug,
                title: bookTitle,
                refId: slug,

                issueDate: loan?.checkOutDate ?? null,
                renewDate: loan?.renewedDate ?? null,

            };
        });
    }, [loansResponse, slug, bookTitle]);

    const response = loansResponse?.data
        ? {
            ...loansResponse,
            data: {
                ...loansResponse.data,
                content: mappedContent,
                pageSize: loansResponse?.data?.pageSize ?? loansResponse?.data?.size ?? mappedContent.length,
            },
        }
        : {
            data: {
                content: mappedContent,
                totalPages: 1,
                totalElements: mappedContent.length,
                pageSize: mappedContent.length,
            },
        };

    const defaultColumns = [
        {
            key: "serialNumber",
            label: "S.No",
            sortable: false,
            minWidth: "80px",
            lgMinWidth: "100px",
            render: (record, index) => String(currentPage * itemsPerPage + index + 1).padStart(2, '0'),
        },
        {
            key: "name",
            label: "User",
            sortable: true,
            minWidth: "150px",
            lgMinWidth: "180px",
            render: (record) => (
                <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-900">{record.userName}</p>
                    <p className="text-xs text-gray-500">User ID: {record.userId}</p>
                </div>
            ),
        },
        {
            key: "checkOutDate",
            label: "Check-Out Date",
            sortable: true,
            minWidth: "120px",
            lgMinWidth: "150px",
            render: (record) => (
                <p className="text-sm text-gray-900">{record.checkOutDate || "-"}</p>
            ),
        },
        {
            key: "dueDate",
            label: "Due Date",
            sortable: true,
            minWidth: "120px",
            lgMinWidth: "150px",
            render: (record) => (
                <p className="text-sm text-gray-900">{record.dueDate || "-"}</p>
            ),
        },
        {
            key: "checkInDate",
            label: "Check-In Date",
            sortable: true,
            minWidth: "120px",
            lgMinWidth: "150px",
            render: (record) => (
                <p className="text-sm text-gray-900">{record.checkInDate || "-"}</p>
            ),
        },
        {
            key: "renewedDate",
            label: "Renewed Date",
            sortable: true,
            minWidth: "120px",
            lgMinWidth: "150px",
            render: (record) => {
                const handleRenewalHistoryClick = () => {
                    // Generate renewal history from record data
                    const renewalHistory = [];
                    if (record.renewalCount > 0) {
                        // Create mock renewal history based on renewal count
                        for (let i = 1; i <= record.renewalCount; i++) {
                            const renewalDate = record.renewedDate || record.dueDate;
                            renewalHistory.push({
                                sNo: String(i).padStart(2, '0'),
                                dueDate: record.dueDate || "-",
                                renewedDate: renewalDate || "-",
                                renewalCount: `${i}/${record.maxRenewals || 3}`
                            });
                        }
                    }
                    setSelectedRenewalHistory(renewalHistory);
                    setIsRenewalHistoryDialogOpen(true);
                };
                
                return (
                    <div className="flex items-center gap-1">
                        <p className="text-sm text-gray-900">{record.renewedDate || "-"}</p>
                        {record.renewedDate && record.renewedDate !== "-" && (
                            <button
                                onClick={handleRenewalHistoryClick}
                                className="cursor-pointer hover:opacity-70 transition-opacity"
                                aria-label="View renewal history"
                            >
                                <Info className="w-4 h-4 text-green-500 flex-shrink-0" />
                            </button>
                        )}
                    </div>
                );
            },
        },
        {
            key: "renewalCount",
            label: "Renewal Count",
            sortable: true,
            minWidth: "120px",
            lgMinWidth: "150px",
            render: (record) => (
                <p className={`text-sm font-medium ${(() => {
                    const current = Number(record.renewalCount ?? 0);
                    const max = Number(record.maxRenewals ?? 0);
                    const reached = max > 0 && current >= max;
                    return reached ? "text-red-600" : "text-gray-900";
                })()}`}>
                    {record.maxRenewals > 0 ? `${record.renewalCount}/${record.maxRenewals}` : `${record.renewalCount}`}
                </p>
            ),
        },
        {
            key: "overdueDays",
            label: "Overdue Days",
            sortable: true,
            minWidth: "120px",
            lgMinWidth: "150px",
            render: (record) => (
                <p className={`text-sm font-medium ${record.overdueDays > 0 ? "text-red-600" : "text-gray-900"}`}>
                    {String(record.overdueDays || 0).padStart(2, '0')}
                </p>
            ),
        },
        {
            key: "fineAmount",
            label: "Fine",
            sortable: true,
            minWidth: "100px",
            lgMinWidth: "120px",
            render: (record) => (
                <p className={`text-sm font-medium ${(() => {
                    const fineAmountNum = Number(record.fineAmount ?? record.fine ?? 0);
                    return fineAmountNum > 0 ? "text-red-600" : "text-gray-900";
                })()}`}>
                    {`$${Number(record.fineAmount ?? record.fine ?? 0)}`}
                </p>
            ),
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            minWidth: "120px",
            lgMinWidth: "150px",
            render: (record) => {
                const displayStatus = record.status || "Unknown";
                const statusForColor = displayStatus === "Checked-Out" ? "Checked-out" : displayStatus;
                return (
                    <span
                        className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-sm ${getLoanActionTypeColor(
                            statusForColor
                        )}`}
                    >
                        {displayStatus}
                    </span>
                );
            },
        },
       
        ...(canAnyEdit(loanPerms) ? [{
            key: "actions",
            label: "Actions",
            sortable: false,
            minWidth: "140px",
            lgMinWidth: "160px",
            render: (record, index, isExpanded, handleRowToggle) => {
                const status = (record.status || "").toLowerCase();
                const isCheckedIn = ["checked-in", "check-in", "returned"].includes(status);
                const isReturnDisabled = isCheckedIn;

                const renewalCurrent = Number(record.renewalCount ?? 0);
                const renewalMax = Number(record.maxRenewals ?? 0);
                const isRenewLimitReached = renewalMax > 0 && renewalCurrent >= renewalMax;

                const isRenewDisabledByStatus = isCheckedIn || ["overdue", "reserved"].includes(status);
                const isRenewDisabled = isRenewDisabledByStatus || isRenewLimitReached;

                const handleReturnClick = () => {
                    setSelectedBookData({ ...record, fullName: record.fullName || record.userName, userDetailId: record.userDetailId || record.userId });
                    setIsTransferDialogOpen(true);
                };
                const handleRenewClick = () => {
                    if (isRenewDisabled) {
                        setRenewLimitUser({
                            userName: record.fullName || record.userName || "",
                            userDetailId: record.userDetailId || record.userId || "",
                        });
                        setIsRenewLimitModalOpen(true);
                    } else {
                        setSelectedBookData({ ...record, fullName: record.fullName || record.userName, userDetailId: record.userDetailId || record.userId });
                        setIsRenewBookDueDateDialogOpen(true);
                    }
                };
                return (
                    <div className="flex items-center gap-1.5">
                        <ButtonWidget
                            onClick={handleReturnClick}
                            disabled={isReturnDisabled}
                            loader={false}
                            className={`h-8 w-8 p-0 rounded-sm flex items-center justify-center flex-shrink-0 border border-gray-300 ${
                                isReturnDisabled
                                    ? "bg-white text-gray-400 cursor-not-allowed"
                                    : "bg-white hover:bg-gray-50 text-[#00796B]"
                            }`}
                            title="Return"
                        >
                            <ImageWidget
                                src={icon3Svg}
                                alt="Return"
                                className="w-4 h-4"
                                width={16}
                                height={16}
                            />
                        </ButtonWidget>
                        <ButtonWidget
                            onClick={handleRenewClick}
                            loader={false}
                            variant="outline"
                            className={`h-8 w-8 p-0 rounded-sm flex items-center justify-center flex-shrink-0 border border-gray-300 ${
                                isRenewDisabled
                                    ? "bg-white hover:bg-white text-gray-400 cursor-pointer"
                                    : "bg-white hover:bg-white text-[#00796B]"
                            }`}
                            title={isRenewDisabled ? "Renew limit reached" : "Renew"}
                        >
                            <RefreshCw className="w-4 h-4" />
                        </ButtonWidget>
                    </div>
                );
            },
        }] : []),
    ];

    const renderExpandedContent = (record) => {
        const fineAmountNum = Number(record.fineAmount ?? record.fine ?? 0);
        const formattedFine = `$${fineAmountNum}`;

        return (
            <div className="bg-white rounded-lg p-3 sm:p-4 lg:p-6 mx-1 sm:mx-2 my-1 sm:my-2 max-w-full overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">User Information</h3>
                            <User className="w-5 h-5 text-[#3B31E2] flex-shrink-0" />
                        </div>
                        <div className="space-y-3 flex flex-col sm:flex-row gap-2">
                            <div className="flex flex-col gap-3 flex-1">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Full Name</p>
                                    <p className="text-sm font-medium text-gray-900">{record.fullName || record.userName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Policy</p>
                                    <p className="text-sm font-medium text-gray-900">{record.policy || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                                    <p className="text-sm font-medium text-gray-900">{record.phoneNumber || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Email ID</p>
                                    <p className="text-sm font-medium text-gray-900">{record.emailId || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex flex-col flex-1">
                                <p className="text-xs text-gray-500 mb-1">User ID</p>
                                <p className="text-sm font-medium text-gray-900">{record.userDetailId || record.userId}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Book</h3>
                            <Book className="w-5 h-5 text-[#3B31E2] flex-shrink-0" />
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Book Title</p>
                                <p className="text-sm font-medium text-gray-900">{record.bookTitle}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">RFID Tag</p>
                                <p className="text-sm font-medium text-gray-900">{record.rfidTag || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">ISBN</p>
                                <p className="text-sm font-medium text-gray-900">{record.isbn || record.bookId}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
                            <Calendar className="w-5 h-5 text-[#3B31E2] flex-shrink-0" />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                            <div className="flex flex-col gap-3 flex-1">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Reserve Date</p>
                                    <p className="text-sm font-medium text-gray-900">{record.reserveDate || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Renew Date</p>
                                    <p className="text-sm font-medium text-gray-900">{record.renewDate || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Issue Date</p>
                                    <p className="text-sm font-medium text-gray-900">{record.issueDate || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 flex-1">
                                {record.overdueSince && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Overdue Since</p>
                                        <p className="text-sm font-medium text-red-600">{record.overdueSince}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Due Date</p>
                                    <p className="text-sm font-medium text-gray-900">{record.dueDate}</p>
                                </div>
                                {record.overdueDays && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Overdue Days</p>
                                        <p className="text-sm font-medium text-red-600">{record.overdueDays}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Admin & Financial</h3>
                            <Settings className="w-5 h-5 text-[#3B31E2] flex-shrink-0" />
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Logged by</p>
                                <p className="text-sm font-medium text-gray-900">{record.loggedBy || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Fine Amount</p>
                                <p className={`text-sm font-medium ${fineAmountNum > 0 ? "text-red-600" : "text-gray-900"}`}>
                                    {formattedFine}
                                </p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm text-gray-500 font-medium">REMARKS</p>
                                    <FileText className="w-4 h-4 text-[#3B31E2] flex-shrink-0" />
                                </div>
                                <p className="text-sm font-medium text-gray-900 break-words whitespace-normal max-w-full">{record.remarks || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <PageLayout breadcrumbs={breadcrumbs}>
            <div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 border-b -mx-4 px-4 p-4">
                    <div className="flex items-center gap-3">
                        <ArrowLeft
                            className="h-5 w-5 cursor-pointer text-gray-600 hover:text-gray-900"
                            onClick={() => router.push('/inventory')}
                        />
                        <div className="flex items-center gap-2">
                            <ImageWidget
                                src={displayImageUrl}
                                alt={bookTitle}
                                className="w-8 h-8 rounded flex-shrink-0 object-cover"
                            />
                            <h2 className="text-xl font-semibold text-gray-900">{bookTitle}</h2>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 sm:gap-4 mb-4 py-2 xl:py-0 border-b -mx-4 px-4">
                    <div className="w-full xl:flex-1">
                        <InventoryDetailsNavigation currentPage="loan" slug={slug} />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full xl:w-auto xl:flex-shrink-0">
                        <SearchWidget
                            placeholder="Search by Book, User, Book ID"
                            value={searchTerm}
                            onSearch={handleSearch}
                            className="w-full sm:w-80 rounded-[14px]!"
                        />
                        <LoanStatusFilter />
                    </div>
                </div>

                <ExpandableTableWidget
                    columns={defaultColumns}
                    response={response}
                    handleSort={handleSort}
                    getSortIcon={getSortIcon}
                    searchTerm={searchTerm}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    handlePageChange={handlePageChange}
                    renderExpandedContent={renderExpandedContent}
                    getRowId={(record) => record.id}
                    noDataTitle="No loan records found"
                    noDataDescription="No loan records have been added yet."
                    noDataIcon="book"
                />
                <ReturnDialog
                    isOpen={isReturnDialogOpen}
                    onOpenChange={setIsReturnDialogOpen}
                    bookData={selectedBookData}
                />
                <CheckInDialog
                    isOpen={isTransferDialogOpen}
                    onOpenChange={setIsTransferDialogOpen}
                    item={selectedBookData ? {
                        title: selectedBookData.bookTitle || selectedBookData.title,
                        refId: selectedBookData.bookId || selectedBookData.refId,
                        status: selectedBookData.status?.toLowerCase() === "overdue" ? "overdue" : "on-time",
                        overdueDays: selectedBookData.overdueDays || 0
                    } : null}
                    onConfirm={handleTransferConfirm}
                />
                <TransferSuccessDialog
                    isOpen={isTransferSuccessOpen}
                    onOpenChange={setIsTransferSuccessOpen}
                    item={selectedBookData ? {
                        title: selectedBookData.bookTitle || selectedBookData.title,
                        refId: selectedBookData.bookId || selectedBookData.refId,
                        status: selectedBookData.status?.toLowerCase() === "overdue" ? "overdue" : "on-time",
                        overdueDays: selectedBookData.overdueDays || 0
                    } : null}
                />
                <RenewConfirmDialog
                    isOpen={isRenewBookDueDateDialogOpen}
                    onOpenChange={setIsRenewBookDueDateDialogOpen}
                    item={selectedBookData ? {
                        title: selectedBookData.bookTitle || selectedBookData.title,
                        refId: selectedBookData.bookId || selectedBookData.refId,
                        dueDate: selectedBookData.dueDate || ""
                    } : null}
                    onConfirm={handleRenewConfirm}
                />
                <RenewSuccessDialog
                    isOpen={isRenewSuccessDialogOpen}
                    onOpenChange={setIsRenewSuccessDialogOpen}
                    item={selectedBookData ? {
                        title: selectedBookData.bookTitle || selectedBookData.title,
                        refId: selectedBookData.bookId || selectedBookData.refId,
                        dueDate: selectedBookData.dueDate || ""
                    } : null}
                />
                <RenewDialog
                    isOpen={isRenewDialogOpen}
                    onOpenChange={setIsRenewDialogOpen}
                    bookData={selectedBookData}
                />
                <RenewLimitReachedModal
                    isOpen={isRenewLimitModalOpen}
                    onOpenChange={setIsRenewLimitModalOpen}
                    userName={renewLimitUser.userName}
                    userDetailId={renewLimitUser.userDetailId}
                />
                <RenewalHistoryDialog
                    isOpen={isRenewalHistoryDialogOpen}
                    onOpenChange={setIsRenewalHistoryDialogOpen}
                    renewalHistory={selectedRenewalHistory}
                />
            </div>
        </PageLayout>
    );
};

export default LoanSection;
