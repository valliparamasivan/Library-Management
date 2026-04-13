"use client";

import React, { useEffect, useState } from "react";
import { SquarePen, Plus, FileText, BookMinus, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import useURLParams from "@/components/custom-hooks/useURLParams";
import PageLayout from "@/components/layouts/PageLayout";
import TitleWidget from "@/components/widgets/TitleWidget";
import SearchWidget from "@/components/widgets/SearchWidget";
import ActionFilters from "@/components/widgets/ActionFilters";
import TableWidget from "@/components/widgets/TableWidget";
import InventoryGrid from "@/components/sections/inventory/utils/InventoryGrid";
import ImageWidget from "@/components/widgets/ImageWidget";
import DeleteWidget from "@/components/widgets/DeleteWidget";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { getStatusColor } from "@/helpers/FuntionalHelpers";
import logo from "@/assets/image/book.png";
import InventoryDialog from "@/components/sections/inventory/utils/InventoryDialog";
import BulkImportDialog from "@/components/sections/inventory/utils/BulkImportDialog";
import InventoryFilterWidget from "@/components/widgets/InventoryFilterWidget";
import LinkWidget from "@/components/widgets/LinkWidget";
import usePermissions from "@/components/custom-hooks/usePermissions";


const InventorySection = ({ response, languages, bookCategories, bookTypes, publishers }) => {
  console.log("response", response);
  const router = useRouter();
  const { canView, canAnyView, canAdd, canEdit, isLoading: isPermissionsLoading, permissions } = usePermissions();
  const canViewInventory = canView("Inventory");
  const canAddInventory = canAdd("Inventory");
  const canEditInventory = canEdit("Inventory");
  const canViewBookDetails = canView("Book Details");
  const canViewRfidLocation = canView("RFID and Location");
  const canViewActiveTransactions = canView("Active Transactions");
  const canOpenAnyDetailTab = canAnyView(["Book Details", "RFID and Location", "Active Transactions"]);

  const getDetailTabSegment = () => {
    if (canViewBookDetails) return "book-details";
    if (canViewRfidLocation) return "rfid";
    if (canViewActiveTransactions) return "loan";
    return null;
  };

  useEffect(() => {
    if (isPermissionsLoading) return;
    if (permissions.length > 0 && !canViewInventory) {
      router.replace("/dashboard");
    }
  }, [isPermissionsLoading, permissions.length, canViewInventory, router]);
  const [viewMode, setViewMode] = useState("list");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedBookData, setSelectedBookData] = useState(null);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  const breadcrumbs = [
    { label: "Catalog & Inventory", href: "/inventory" },
  ];

  const {
    page: currentPage,
    size: itemsPerPage,
    search: searchTerm,
    hideColumns,
    handlePageChange,
    handleSearch,
    handleSort,
    getSortIcon,
    toggleColumnVisibility,
    isColumnVisible,
  } = useURLParams({
    defaultColumns: [
      "title",
      "author",
      "subject",
      "bookType",
      "language",
      "category",
      "publisher",
      "year",
      "isbn",
      "image",
      "availability",
      "rfidStatus",
      "status",
    ],
    additionalParams: {
      language: {
        paramName: "languageId",
        defaultValue: "",
      },
      bookCategory: {
        paramName: "bookCategoryId",
        defaultValue: "",
      },
      bookType: {
        paramName: "bookTypeId",
        defaultValue: "",
      },
      publisher: {
        paramName: "publisher",
        defaultValue: "",
      },
      available: {
        paramName: "available",
        defaultValue: "",
      },
      status: {
        paramName: "status",
        defaultValue: "",
      },
    },
  });


  const handleDownloadAction = () => {
    console.log("Download action");
  };
  const handleConfirmDelete = (id) => {
    console.log("Delete item:", id);
  };

  const handleEditClick = (record) => {
    setEditingId(record.bookId || record.id);
    setSelectedBookData(record);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setSelectedBookData(null);
    setIsDialogOpen(true);
  };

  const handleDialogOpenChange = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingId(null);
      setSelectedBookData(null);
    }
  };

  const mappedResponse = response?.data ? {
    data: {
      ...response.data,
      content: response.data.content?.map((item) => ({
        id: item.bookId,
        bookId: item.bookId,
        title: item.title,
        author: item.author,
        isbn: item.isbn,
        language: item.language,
        total: item.totalCopies,
        availableCopies: item.availableCopies,
        totalCopies: item.totalCopies,
        imageUrl: item.bookImageUrl,
        bookImageUrl: item.bookImageUrl,
        catalogAvailable:
          typeof item.available === "boolean"
            ? item.available
            : (item.availableCopies ?? 0) > 0,
        publisher: item.publisher,
        year: item.yearPublished,
        yearPublished: item.yearPublished,
        bookCategoryId: item.bookCategoryId,
        bookTypeId: item.bookTypeId,
        subject: item.subject,
        description: item.description,
        quantity: item.totalCopies,
      })) || [],
    },
  } : response;
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
      key: "title",
      label: "Title",
      sortable: true,
      minWidth: "120px",
      lgMinWidth: "150px",
    },
    {
      key: "author",
      label: "Author",
      sortable: true,
      minWidth: "120px",
      lgMinWidth: "150px",
    },

    {
      key: "isbn",
      label: "ISBN",
      sortable: true,
      minWidth: "150px",
      lgMinWidth: "180px",
    },
    
    {
      key: "language",
      label: "Language",
      sortable: true,
      minWidth: "100px",
      lgMinWidth: "120px",
    },

    {
      key: "availability",
      label: "Availability",
      sortable: false,
      minWidth: "120px",
      lgMinWidth: "150px",
      render: (record) => {
        const available = record.availableCopies ?? record.available ?? 0;
        const total = record.totalCopies ?? record.total ?? 0;
        const isZeroAvailability = available === 0;
        return (
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md border ${isZeroAvailability ? "bg-[#F8D4D2] border-[#F44336] text-[#1A1A1A]" : "bg-[#F0FDF4] border-[#00A63E] text-[#1A1A1A]"}`}>
            <BookMinus className={`w-4 h-4 ${isZeroAvailability ? "text-[#F44336]" : "text-[#00796B]"}`} />
            {available}/{total}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: false,
      minWidth: "120px",
      lgMinWidth: "150px",
      render: (record) => {
        const isActive = record.catalogAvailable === true;
        const statusText = isActive ? "Active" : "Inactive";
        const statusColor = getStatusColor(statusText);
        return (
          <div className="flex justify-center">
            <span className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm ${statusColor}`}>
              {statusText}
            </span>
          </div>
        );
      },
    },
    ...(canEditInventory ? [{
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
            <SquarePen className="w-4 h-4 text-[#807F94]" />
          </button>
        </div>
      ),
    }] : []),
  ];

  if (!isPermissionsLoading && permissions.length > 0 && !canViewInventory) {
    return null;
  }

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 mb-4 py-2 border-b -mx-4 px-4">
        <TitleWidget 
          title="Book List" 
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 flex-wrap">
            <SearchWidget
              placeholder="Search"
              value={searchTerm}
              onSearch={handleSearch}
              className="w-full sm:w-60 rounded-[14px]!"
            />

            <InventoryFilterWidget 
              languages={languages}
              bookCategories={bookCategories}
              bookTypes={bookTypes}
              publishers={publishers}
            />
            {/* <ActionFilters
              onDownload={handleDownloadAction}
              endpoint="inventory"
              fileBaseName="inventory"
              tooltipWidth="w-200"
              hideFilter={true}
            /> */}
            {canAddInventory && (
              <>
                <ButtonWidget
                  onClick={() => setIsBulkImportOpen(true)}
                  className="h-9 px-3 rounded-sm bg-white hover:bg-gray-50 text-[#00796B] border border-[#00796B] shadow-sm flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Bulk Import
                </ButtonWidget>
                <ButtonWidget
                  onClick={handleAddNew}
                  className="h-9 px-3 rounded-sm bg-[#00796B] hover:bg-[#00796B]/90 text-white border-0 shadow-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-white" />
                  Add New
                </ButtonWidget>
              </>
            )}
            <InventoryDialog
              isOpen={isDialogOpen}
              onOpenChange={handleDialogOpenChange}
              id={editingId}
              bookData={selectedBookData}
              languages={languages}
              bookCategories={bookCategories}
              bookTypes={bookTypes}
            />
            <BulkImportDialog
              isOpen={isBulkImportOpen}
              onOpenChange={setIsBulkImportOpen}
              languages={languages}
              bookCategories={bookCategories}
              bookTypes={bookTypes}
            />
          </div>
        </div>
      </div>
      {viewMode === "list" ? (
        <TableWidget
          columns={defaultColumns}
          response={mappedResponse}
          handleSort={handleSort}
          getSortIcon={getSortIcon}
          // handleConfirmDelete={handleConfirmDelete}
          searchTerm={searchTerm}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          handlePageChange={handlePageChange}
          onRowClick={canOpenAnyDetailTab ? (record) => {
            const tabSegment = getDetailTabSegment();
            if (!tabSegment) return;
            router.push(`/inventory/inventory-details/${record.bookId || record.id}/${tabSegment}`);
          } : undefined}
        />
      ) : (
        <InventoryGrid response={mappedResponse} onEditClick={canEditInventory ? handleEditClick : undefined} />
      )}
    </PageLayout>
  );
};

export default InventorySection;
