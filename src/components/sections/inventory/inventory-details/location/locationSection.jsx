"use client";

import bookImage from '@/assets/image/book.png';
import useURLParams from '@/components/custom-hooks/useURLParams';
import PageLayout from '@/components/layouts/PageLayout';
import ButtonWidget from '@/components/widgets/ButtonWidget';
import ImageWidget from '@/components/widgets/ImageWidget';
import SearchWidget from '@/components/widgets/SearchWidget';
import TableWidget from '@/components/widgets/TableWidget';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import InventoryDetailsNavigation from '../utils/inventoryDetailsNavigation';
import AssignLocationDialog from './utils/assignLocationDialog';

const LocationSection = ({ slug }) => {
    const router = useRouter();
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const breadcrumbs = [
        { label: 'Inventory', href: '/inventory' },
        { label: 'Location' },
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
            "locationName",
            "shelfName",
            "availableBooks",
            "actions",
        ],
    });

    const dummyData = [
        {
            id: 1,
            serialNumber: "01",
            locationName: "Second Floor",
            shelfName: "Shelf Name 2",
            availableBooks: 23,
        },
        {
            id: 2,
            serialNumber: "02",
            locationName: "Third Floor",
            shelfName: "Shelf Name 3",
            availableBooks: 2,
        },
        {
            id: 3,
            serialNumber: "03",
            locationName: "Fourth Floor",
            shelfName: "Shelf Name 4",
            availableBooks: 5,
        },
        {
            id: 4,
            serialNumber: "04",
            locationName: "Fifth Floor",
            shelfName: "Shelf Name 5",
            availableBooks: 12,
        },
        {
            id: 5,
            serialNumber: "05",
            locationName: "Rooftop Terrace",
            shelfName: "Shelf Name 6",
            availableBooks: 34,
        },
        {
            id: 6,
            serialNumber: "06",
            locationName: "Basement Level",
            shelfName: "Shelf Name 7",
            availableBooks: 73,
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

    const handleAssignLocation = () => {
        setEditingId(null);
        setIsAssignDialogOpen(true);
    };

    const handleChangeLocation = (id) => {
        setEditingId(id);
        setIsAssignDialogOpen(true);
    };

    const handleDialogOpenChange = (open) => {
        setIsAssignDialogOpen(open);
        if (!open) {
            setEditingId(null);
        }
    };

    const defaultColumns = [
        {
            key: "serialNumber",
            label: "S.No",
            sortable: true,
            minWidth: "80px",
            lgMinWidth: "100px",
        },
        {
            key: "locationName",
            label: "Location Name",
            sortable: true,
            minWidth: "150px",
            lgMinWidth: "180px",
        },
        {
            key: "shelfName",
            label: "Shelf Name",
            sortable: true,
            minWidth: "150px",
            lgMinWidth: "180px",
        },
        {
            key: "availableBooks",
            label: "Available Books",
            sortable: true,
            minWidth: "120px",
            lgMinWidth: "150px",
        },
        {
            key: "actions",
            label: "Actions",
            sortable: false,
            minWidth: "150px",
            lgMinWidth: "180px",
            render: (record) => (
                <ButtonWidget
                    onClick={() => handleChangeLocation(record.id)}
                    className="h-8 px-3 rounded-sm bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 flex items-center gap-2 text-sm"
                >
                    <MapPin className="w-4 h-4 text-[#00796B]" />
                    Change Location
                </ButtonWidget>
            ),
        },
    ];

    const bookTitle = "The Time Traveler";

    return (
        <PageLayout breadcrumbs={breadcrumbs}>
            <div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 border-b -mx-4 px-4 p-4">
                    <div className="flex items-center gap-3">
                        <ArrowLeft   className="h-5 w-5 cursor-pointer text-gray-600 hover:text-gray-900"  onClick={() => router.push('/inventory')} 
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
                    <ButtonWidget onClick={handleAssignLocation} className="h-9 px-4 rounded-sm bg-[#00796B] hover:bg-[#00796B]/90 text-white border-0 flex items-center gap-2"><MapPin className="w-4 h-4 text-white" />Assign Location</ButtonWidget>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 mb-4 border-b -mx-4 px-4">                    
                    <div className="flex-1">
                        <InventoryDetailsNavigation currentPage="location" slug={slug} />
                    </div>
                    <div className="flex-shrink-0">
                        <SearchWidget placeholder="Search by Location, Shelf Name" value={searchTerm} onSearch={handleSearch} className="w-full sm:w-80 rounded-[14px]!"/>
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
                    height="h-[calc(100vh-295px)]"
                />

                <AssignLocationDialog
                    isOpen={isAssignDialogOpen}
                    onOpenChange={handleDialogOpenChange}
                    id={editingId}
                />
            </div>
        </PageLayout>
    );
};

export default LocationSection;