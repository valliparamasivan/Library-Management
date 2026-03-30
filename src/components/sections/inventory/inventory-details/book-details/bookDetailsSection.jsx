"use client";

import bookImage from '@/assets/image/book.png';
import PageLayout from '@/components/layouts/PageLayout';
import ButtonWidget from '@/components/widgets/ButtonWidget';
import ImageWidget from '@/components/widgets/ImageWidget';
import { ArrowLeft, Book, Plus, RotateCw, SquarePen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import InventoryDialog from '../../utils/InventoryDialog';
import InventoryDetailsNavigation from '../utils/inventoryDetailsNavigation';
import QuantityDialog from './utils/quantityDialog';
import { Switch } from '@/components/ui/switch';
import { getStatusColor } from '@/helpers/FuntionalHelpers';
import useErrorHandler from '@/components/custom-hooks/useErrorHandler';
import { useBookChangeStatus } from '@/store/hooks/InventoryHooks';

const deriveBookCatalogActive = (data) => {
    if (!data) return false;
    if (typeof data.available === "boolean") return data.available;
    const s = (data.status || "").toString().toUpperCase();
    if (s === "AVAILABLE" || s === "ACTIVE") return true;
    if (s === "NOT_AVAILABLE" || s === "UNAVAILABLE" || s === "INACTIVE") return false;
    return (data.availableCopies ?? 0) > 0;
};

const BookDetailsSection = ({ slug, bookData: apiBookData, languages, bookCategories, bookTypes }) => {
    const router = useRouter();
    const { mutateAsync: changeBookStatus, isPending: isStatusChangePending } = useBookChangeStatus();
    const { showSuccessToast, showErrorToast } = useErrorHandler();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [isQuantityDialogOpen, setIsQuantityDialogOpen] = useState(false);

    const breadcrumbs = [
        { label: 'Inventory', href: '/inventory' },
        { label: 'Book Details' },
    ];
    const bookData = apiBookData?.data ? {
        bookId: apiBookData.data.bookId,
        title: apiBookData.data.title || "",
        description: apiBookData.data.description || apiBookData.data.overview || "",
        isbn: apiBookData.data.isbn || "",
        author: apiBookData.data.author || "",
        subject: apiBookData.data.subject || "",
        language: apiBookData.data.language || "",
        publisher: apiBookData.data.publisher || "",
        publishedYear: apiBookData.data.year || "",
        bookCategory: apiBookData.data.bookCategoryName || "",
        bookType: apiBookData.data.bookTypeName || "",
        totalCopies: apiBookData.data.totalCopies || 0,
        issuedCopies: apiBookData.data.issuedCopies || 0,
        availableCopies: apiBookData.data.availableCopies || 0,
        status: apiBookData.data.status ?? "",
        available: typeof apiBookData.data.available === "boolean" ? apiBookData.data.available : null,
        bookCategoryId: apiBookData.data.bookCategoryId,
        bookTypeId: apiBookData.data.bookTypeId,
        bookImageUrl: apiBookData.data.bookImageUrl,
    } : null;


    const displayImageUrl = bookData?.bookImageUrl 
        ? `https://libraryapi.corpfield.com/books-image/${bookData.bookImageUrl}` 
        : bookImage;

    const isStatusActive = deriveBookCatalogActive(bookData);

    const handleEdit = () => {
        setEditingId(slug);
        setIsDialogOpen(true);
    };

    const handleDialogOpenChange = (open) => {
        setIsDialogOpen(open);
        if (!open) {
            setEditingId(null);
        }
    };

    const handleAddQuantity = () => {
        setIsQuantityDialogOpen(true);
    };

    const handleQuantityDialogOpenChange = (open) => {
        setIsQuantityDialogOpen(open);
    };

    const handleStatusToggle = async () => {
        if (!bookData?.bookId) {
            showErrorToast("Book ID is missing");
            return;
        }
        try {
            const response = await changeBookStatus(bookData.bookId);
            showSuccessToast(response?.message ?? "Status updated");
            await router.refresh();
        } catch (error) {
            showErrorToast(error?.data?.message ?? error?.message ?? "Could not update status");
        }
    };

    if (!bookData) {
        return (
            <PageLayout breadcrumbs={breadcrumbs}>
                <div className="flex items-center justify-center py-8">
                    <p className="text-gray-500">Loading book details...</p>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout breadcrumbs={breadcrumbs}>
            <div>
                <div className="flex flex-col gap-3 border-b border-gray-200 -mx-4 px-4 py-3">
                    <div className="flex flex-row items-center justify-between gap-4 border-b border-gray-200 pb-1">
                        <div className="flex items-center gap-3 min-w-0">
                            <ArrowLeft
                                className="h-5 w-5 flex-shrink-0 cursor-pointer text-gray-600 hover:text-gray-900"
                                onClick={() => router.push('/inventory')}
                            />
                            <div className="flex flex-col min-w-0">
                                <h2 className="text-lg font-semibold text-gray-900">{bookData.title}</h2>
                            </div>
                            <div className="flex items-center gap-3 ml-4">
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${bookData.availableCopies === 0 ? "bg-[#F8D4D2] border-[#F44336]" : "bg-green-50 border-green-200"}`}>
                                    <Book className={`w-4 h-4 ${bookData.availableCopies === 0 ? "text-[#F44336]" : "text-[#00796B]"}`} />
                                    <span className="text-sm font-medium text-gray-700">{bookData.availableCopies}/{bookData.totalCopies}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm ${getStatusColor(isStatusActive ? "Active" : "Inactive")}`}>
                                        {isStatusActive ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex-1">
                            <InventoryDetailsNavigation currentPage="book-details" slug={slug} />
                        </div>
                        <ButtonWidget
                            onClick={handleAddQuantity}
                            className="flex-shrink-0 px-4 py-2 bg-[#00796B] hover:bg-[#00796B]/90 text-white rounded-lg cursor-pointer flex items-center gap-2 border-0"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="text-sm font-medium">Copies</span>
                        </ButtonWidget>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6 mt-2">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-5 lg:gap-6">
                        <div className="space-y-4 flex-shrink-0 w-full lg:w-auto">
                            <div className="flex justify-start pl-8">
                                <ImageWidget
                                    src={displayImageUrl}
                                    alt={bookData.title}
                                    className="w-full max-w-[170px] aspect-[2/2] rounded-lg object-cover"
                                />
                            </div>
                            <div className="space-y-3 w-full min-w-[260px] max-w-[280px]">
                                <div className="flex justify-between items-center gap-6">
                                    <p className="text-sm text-gray-600 flex-shrink-0">ISBN</p>
                                    <p className="text-sm font-semibold text-gray-900 text-right truncate min-w-0">{bookData.isbn}</p>
                                </div>
                                <ButtonWidget
                                    onClick={handleEdit}
                                    className="w-full py-1.5 px-3 border border-blue-500 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md font-semibold text-sm flex items-center justify-center gap-2 min-h-[38px]"
                                >
                                    <SquarePen className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium text-[#1A1A1A]">Edit</span>
                                </ButtonWidget>
                                <div className="flex justify-between items-center gap-6 px-3 py-2 border border-gray-200 rounded-md">
                                    <p className="text-sm text-gray-600 flex-shrink-0">Status</p>
                                    <Switch
                                        checked={isStatusActive}
                                        onCheckedChange={handleStatusToggle}
                                        disabled={isStatusChangePending}
                                        className="data-[state=checked]:bg-[#00796B] data-[state=unchecked]:bg-gray-300"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 min-w-0 lg:ml-4 lg:pl-2">
                            <div className="mb-2 max-w-xl">
                                <h1 className="text-xl font-bold text-gray-900 mb-2">{bookData.title}</h1>
                                <p className="text-[14px] text-[#1A1A1A] font-medium mb-3">by {bookData.author}</p>
                                <p className="text-[14px] text-[#807F94] leading-relaxed mb-4">{bookData.description}</p>
                                <div className="border-t border-gray-200 pt-2" />
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-4">
                                    <p className="text-sm text-gray-500 font-semibold w-32 flex-shrink-0">Book Category</p>
                                    <p className="text-sm text-gray-900 font-bold">{bookData.bookCategory}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="text-sm text-gray-500 font-semibold w-32 flex-shrink-0">Publisher</p>
                                    <p className="text-sm text-gray-900 font-bold">{bookData.publisher}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="text-sm text-gray-500 font-semibold w-32 flex-shrink-0">Published Year</p>
                                    <p className="text-sm text-gray-900 font-bold">{bookData.publishedYear}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="text-sm text-gray-500 font-semibold w-32 flex-shrink-0">Subject</p>
                                    <p className="text-sm text-gray-900 font-bold">{bookData.subject}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="text-sm text-gray-500 font-semibold w-32 flex-shrink-0">Language</p>
                                    <p className="text-sm text-gray-900 font-bold">{bookData.language}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="text-sm text-gray-500 font-semibold w-32 flex-shrink-0">Book Type</p>
                                    <p className="text-sm text-gray-900 font-bold">{bookData.bookType}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <InventoryDialog
                isOpen={isDialogOpen}
                onOpenChange={handleDialogOpenChange}
                id={editingId}
                bookData={bookData}
                languages={languages}
                bookCategories={bookCategories}
                bookTypes={bookTypes}
            />
            <QuantityDialog
                isOpen={isQuantityDialogOpen}
                onOpenChange={handleQuantityDialogOpenChange}
                bookId={bookData?.bookId}
            />
        </PageLayout>
    );
};

export default BookDetailsSection;
