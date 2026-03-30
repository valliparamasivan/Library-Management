"use client";

import React from "react";
import { useRouter } from "nextjs-toploader/app";
import { SquarePen } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import ImageWidget from "@/components/widgets/ImageWidget";
import LinkWidget from "@/components/widgets/LinkWidget";
import DeleteWidget from "@/components/widgets/DeleteWidget";
import NoDataFoundWidget from "@/components/widgets/NoDataFoundWidget";
import PaginationWidget from "@/components/widgets/PaginationWidget";
import { getStatusColor } from "@/helpers/FuntionalHelpers";
import logo from "@/assets/image/book.png";

const InventoryTable = ({
  response,
  handleSort,
  getSortIcon,
  handleConfirmDelete,
  searchTerm,
  currentPage,
  itemsPerPage,
  handlePageChange,
}) => {
  const router = useRouter();

  return (
    <>
      <div className="overflow-auto relative h-[calc(100vh-230px)] border-gray-200 border-b border-l border-r border-t">
        <Table className="rounded-lg w-full">
        <TableHeader className="sticky top-0 z-20">
          <TableRow className="bg-[#F7F8FB] border-[#E5E7EB]">
            <TableHead
              className="font-semibold text-[#4D5959] text-[12px] lg:text-[14px] min-w-[120px] lg:min-w-[150px] cursor-pointer hover:text-[#00796B] transition-colors"
              onClick={() => handleSort("title")}
            >
              <div className="flex items-center gap-1 pl-3">
                Title
                {getSortIcon("title")}
              </div>
            </TableHead>

            <TableHead
              className="font-semibold text-[#4D5959] text-[12px] lg:text-[14px] min-w-[120px] lg:min-w-[150px] cursor-pointer hover:text-[#00796B] transition-colors"
              onClick={() => handleSort("author")}
            >
              <div className="flex items-center gap-1">
                Author
                {getSortIcon("author")}
              </div>
            </TableHead>

            <TableHead
              className="font-semibold text-[#4D5959] text-[12px] lg:text-[14px] min-w-[120px] lg:min-w-[150px] cursor-pointer hover:text-[#00796B] transition-colors"
              onClick={() => handleSort("subject")}
            >
              <div className="flex items-center gap-1">
                Subject
                {getSortIcon("subject")}
              </div>
            </TableHead>

            <TableHead
              className="font-semibold text-[#4D5959] text-[12px] lg:text-[14px] min-w-[120px] lg:min-w-[150px] cursor-pointer hover:text-[#00796B] transition-colors"
              onClick={() => handleSort("bookType")}
            >
              <div className="flex items-center gap-1">
                Book Type
                {getSortIcon("bookType")}
              </div>
            </TableHead>

            <TableHead
              className="font-semibold text-[#4D5959] text-[12px] lg:text-[14px] min-w-[100px] lg:min-w-[120px] cursor-pointer hover:text-[#00796B] transition-colors"
              onClick={() => handleSort("language")}
            >
              <div className="flex items-center gap-1">
                Language
                {getSortIcon("language")}
              </div>
            </TableHead>

            <TableHead
              className="font-semibold text-[#4D5959] text-[12px] lg:text-[14px] min-w-[120px] lg:min-w-[150px] cursor-pointer hover:text-[#00796B] transition-colors"
              onClick={() => handleSort("category")}
            >
              <div className="flex items-center gap-1">
                Category
                {getSortIcon("category")}
              </div>
            </TableHead>

            <TableHead
              className="font-semibold text-[#4D5959] text-[12px] lg:text-[14px] min-w-[150px] lg:min-w-[180px] cursor-pointer hover:text-[#00796B] transition-colors"
              onClick={() => handleSort("publisher")}
            >
              <div className="flex items-center gap-1">
                Publisher
                {getSortIcon("publisher")}
              </div>
            </TableHead>

            <TableHead
              className="font-semibold text-[#4D5959] text-[12px] lg:text-[14px] min-w-[80px] lg:min-w-[100px] cursor-pointer hover:text-[#00796B] transition-colors"
              onClick={() => handleSort("year")}
            >
              <div className="flex items-center gap-1">
                Year
                {getSortIcon("year")}
              </div>
            </TableHead>

            <TableHead
              className="font-semibold text-[#4D5959] text-[12px] lg:text-[14px] min-w-[150px] lg:min-w-[180px] cursor-pointer hover:text-[#00796B] transition-colors"
              onClick={() => handleSort("isbn")}
            >
              <div className="flex items-center gap-1">
                ISBN
                {getSortIcon("isbn")}
              </div>
            </TableHead>

            <TableHead className="font-semibold text-[#4D5959] text-[12px] lg:text-[14px] min-w-[80px]">
              Book Image
            </TableHead>

            <TableHead className="font-semibold text-[#4D5959] text-[12px] lg:text-[14px] min-w-[120px] lg:min-w-[150px]">
              Availability
            </TableHead>

            <TableHead className="font-semibold text-[#4D5959] text-[12px] lg:text-[14px] min-w-[120px] lg:min-w-[150px]">
              RFID Tag Status
            </TableHead>

            <TableHead className="font-semibold text-[#4D5959] text-[12px] lg:text-[14px] min-w-[120px]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {response?.data?.content && response.data.content.length > 0 ? (
            response.data.content.map((record, index) => (
              <TableRow key={index} className="hover:bg-gray-50 border-[#E5E7EB]">
                <TableCell className="text-[12px] lg:text-[14px] pl-5">{record.title}</TableCell>

                <TableCell className="text-[12px] lg:text-[14px]">{record.author}</TableCell>

                <TableCell className="text-[12px] lg:text-[14px]">{record.subject}</TableCell>

                <TableCell className="text-[12px] lg:text-[14px]">{record.bookType}</TableCell>

                <TableCell className="text-[12px] lg:text-[14px]">{record.language}</TableCell>

                <TableCell className="text-[12px] lg:text-[14px]">{record.category}</TableCell>

                <TableCell className="text-[12px] lg:text-[14px]">{record.publisher}</TableCell>

                <TableCell className="text-[12px] lg:text-[14px]">{record.year}</TableCell>

                <TableCell className="text-[12px] lg:text-[14px]">{record.isbn}</TableCell>

                <TableCell className="text-[12px] lg:text-[14px]">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <ImageWidget
                      src={logo}
                      alt={record.title}
                      className="w-full h-full object-contain rounded"
                    />
                  </div>
                </TableCell>

                <TableCell className="text-[12px] lg:text-[14px]">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                      record.available ? "Available" : "Not Available"
                    )}`}
                  >
                    {record.available}/{record.total}
                  </span>
                </TableCell>

                <TableCell className="text-[12px] lg:text-[14px]">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                      record.rfidTagged ? "Tagged" : "Untagged"
                    )}`}
                  >
                    {record.rfidTagged ? "Tagged" : "Untagged"}
                  </span>
                </TableCell>

                <TableCell className="text-[12px] lg:text-[14px]">
                  <div className="flex gap-1">
                    <LinkWidget href={`/inventory/edit/${record.id}`} className="cursor-pointer">
                      <button
                        className="p-1.5 hover:bg-gray-100 rounded border border-gray-300 cursor-pointer"
                        title="Edit"
                      >
                        <SquarePen className="w-4 h-4 text-gray-400" />
                      </button>
                    </LinkWidget>

                    <DeleteWidget
                      onConfirm={handleConfirmDelete}
                      itemId={record.id}
                      title="Delete Inventory Item"
                      itemType="inventory item"
                      itemLabel="Item ID"
                      buttonTitle="Delete"
                      buttonClassName="p-1.5 hover:bg-gray-100 rounded border border-gray-300"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={13} className="p-0">
                <NoDataFoundWidget
                  title="No inventory items found"
                  description={
                    searchTerm
                      ? `No inventory items found matching "${searchTerm}". Try adjusting your search criteria.`
                      : "No inventory items have been added yet."
                  }
                  icon="package"
                  showAction={!searchTerm}
                  actionText="Add Inventory Item"
                  onAction={() => router.push("/inventory/create")}
                  size="sm"
                  className="py-8"
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>

    <div className="flex items-center justify-between mt-4 mb-2">
      <PaginationWidget
        currentPage={currentPage}
        totalPages={response?.data?.totalPages}
        totalItems={response?.data?.totalElements}
        itemsPerPage={response?.data?.pageSize ? response.data.pageSize : itemsPerPage}
        onPageChange={handlePageChange}
        className="w-full"
      />
    </div>
    </>
  );
};

export default InventoryTable;

