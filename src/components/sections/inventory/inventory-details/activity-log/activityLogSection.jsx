"use client";

import bookImage from '@/assets/image/book.png';
import useURLParams from '@/components/custom-hooks/useURLParams';
import FormSelect from '@/components/form/FormSelect';
import PageLayout from '@/components/layouts/PageLayout';
import ImageWidget from '@/components/widgets/ImageWidget';
import SearchWidget from '@/components/widgets/SearchWidget';
import TableWidget from '@/components/widgets/TableWidget';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import InventoryDetailsNavigation from '../utils/inventoryDetailsNavigation';
import { getActivityActionColor } from '@/helpers/FuntionalHelpers';

const ActivityLogSection = ({ slug }) => {
    const router = useRouter();
    
const breadcrumbs = [
    { label: 'Inventory', href: '/inventory' },
    { label: 'Activity Log' },
    ];

    const { control } = useForm({
        defaultValues: {
            loanStatus: "",
        },
    });

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
            "activity",
            "updatedBy",
            "dateTime",
            "action",
        ],
    });

    const dummyData = [
        {
            id: 1,
            serialNumber: "01",
            rfid: "AHW2542B00124",
            activity: "Fine: $2.50 (3 days overdue)",
            updatedBy: "Jane Doe (Librarian)",
            dateTime: "2025-11-02 12:00 PM",
            action: "RFID Tagged",
            actionType: "RFID Tagged",
        },
        {
            id: 2,
            serialNumber: "02",
            rfid: "AHW2542B00125",
            activity: "Fine: $2.50 (3 days overdue)",
            updatedBy: "Jane Doe (Librarian)",
            dateTime: "2025-11-02 01:00 PM",
            action: "Edited",
            actionType: "Edited",
        },
        {
            id: 3,
            serialNumber: "03",
            rfid: "AHW2542B00131",
            activity: "Fine: $2.50 (3 days overdue)",
            updatedBy: "Jane Doe (Librarian)",
            dateTime: "2025-11-02 02:00 PM",
            action: "RFID Not Tagged",
            actionType: "RFID Not Tagged",
        },
        {
            id: 4,
            serialNumber: "05",
            rfid: "AHW2542B00131",
            activity: "Fine: $2.50 (3 days overdue)",
            updatedBy: "Jane Doe (Librarian)",
            dateTime: "2025-11-02 04:00 PM",
            action: "Deleted",
            actionType: "Deleted",
        },
        {
            id: 5,
            serialNumber: "06",
            rfid: "AHW2542B00131",
            activity: "Fine: $2.50 (3 days overdue)",
            updatedBy: "Jane Doe (Librarian)",
            dateTime: "2025-11-02 04:00 PM",
            action: "Edited",
            actionType: "Edited",
        },
        {
            id: 6,
            serialNumber: "07",
            rfid: "AHW2542B00131",
            activity: "Fine: $2.50 (3 days overdue)",
            updatedBy: "Jane Doe (Librarian)",
            dateTime: "2025-11-02 04:00 PM",
            action: "Book Created",
            actionType: "Book Created",
        },
    ];

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
            key: "serialNumber",
            label: "S.No",
            sortable: false,
            minWidth: "80px",
            lgMinWidth: "100px",
        },
        {
            key: "rfid",
            label: "RFID",
            sortable: true,
            minWidth: "150px",
            lgMinWidth: "180px",
        },
        {
            key: "activity",
            label: "Activity",
            sortable: true,
            minWidth: "200px",
            lgMinWidth: "250px",
        },
        {
            key: "updatedBy",
            label: "Updated By",
            sortable: true,
            minWidth: "180px",
            lgMinWidth: "220px",
        },
        {
            key: "dateTime",
            label: "Date & Time",
            sortable: true,
            minWidth: "180px",
            lgMinWidth: "200px",
        },
        {
            key: "action",
            label: "Action",
            sortable: true,
            minWidth: "150px",
            lgMinWidth: "180px",
            render: (record) => (
                <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getActivityActionColor(
                        record.actionType
                    )}`}
                >
                    {record.action}
                </span>
            ),
        },
    ];

    const bookTitle = "The Time Traveler";

    const loanStatusOptions = [
        { value: "onDue", label: "On Due" },
        { value: "reserved", label: "Reserved" },
        { value: "issued", label: "Issued" },
        { value: "nearDue", label: "Near Due" },
        { value: "overDue", label: "Over Due" },
        { value: "renewed", label: "Renewed" },
    ];

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
                                src={bookImage}
                                alt={bookTitle}
                                className="w-8 h-8 rounded flex-shrink-0 object-cover"
                            />
                            <h2 className="text-xl font-semibold text-gray-900">{bookTitle}</h2>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 sm:gap-4 mb-4 py-2 xl:py-0 border-b -mx-4 px-4">
                    <div className="w-full xl:flex-1">
                        <InventoryDetailsNavigation currentPage="activity-log" slug={slug} />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full xl:w-auto xl:flex-shrink-0">
                        <SearchWidget
                            placeholder="Search by Date"
                            value={searchTerm}
                            onSearch={handleSearch}
                            className="w-full sm:w-80 rounded-[14px]!"
                        />
                        <FormSelect
                            name="loanStatus"
                            control={control}
                            options={loanStatusOptions}
                            placeholder="Status"
                            className='bg-transparent border border-[#D9D9D9] rounded-sm !h-9 w-full sm:w-auto min-w-[140px]'
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
                    height="h-[calc(100vh-290px)]"
                />
            </div>
        </PageLayout>
    );
};

export default ActivityLogSection;