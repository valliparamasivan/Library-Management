"use client";

import bookImage from "@/assets/image/book.png";
import ImageWidget from "@/components/widgets/ImageWidget";
import { FileText, SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { getStatusColor } from "@/helpers/FuntionalHelpers";

const InventoryGrid = ({ response, onEditClick }) => {
  const router = useRouter();

  return (
    <div className="overflow-auto relative h-[calc(100vh-140px)] rounded-lg p-4 pt-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {response?.data?.content && response.data.content.length > 0 ? (
          response.data.content.map((record) => {
            const bookId = record.bookId || record.id;
            const available = record.availableCopies ?? 0;
            const total = record.totalCopies ?? record.total ?? 0;
            const isZeroAvailability = available === 0;
            const catalogActive = record.catalogAvailable === true;
            const bookImageUrl = record.bookImageUrl 
              ? `https://libraryapi.corpfield.com/books-image/${record.bookImageUrl}` 
              : bookImage;
            
            return (
              <div
                key={bookId}
                className="bg-white rounded-lg shadow-[0_0_8px_rgba(0,0,0,0.1)] hover:shadow-[0_0_12px_rgba(0,0,0,0.15)] transition-shadow overflow-hidden flex flex-col cursor-pointer"
                onClick={() => router.push(`/inventory/inventory-details/${bookId}/book-details`)}
              >
                <div className="w-full flex items-center justify-center overflow-hidden rounded-t-lg pt-4 pl-4 pr-4 h-48 md:h-56">
                  <ImageWidget
                    src={bookImageUrl}
                    alt={record.title || "Book"}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="p-4 space-y-2 flex-1">
                  <h3 className="font-bold text-base text-gray-900 line-clamp-2  whitespace-nowrap">
                    {record.title}
                  </h3>
                  <p className="text-[14px] text-[#67667A]">
                    by {record.author}
                  </p>
                  <div className="flex items-center gap-1.5 text-sm text-[#1A1A1A] font-[500]">
                    <span>{record.isbn}</span>
                  </div>
                 
                  <div className="flex items-center space-x-1 justify-between gap-2">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-md border ${isZeroAvailability ? "bg-[#F8D4D2] border-[#F44336] text-[#1A1A1A]" : "bg-[#F0FDF4] border-[#00A63E] text-[#1A1A1A]"}`}>
                      <FileText className={`w-4 h-4 ${isZeroAvailability ? "text-[#F44336]" : "text-[#00796B]"}`} />
                      {available}/{total}
                    </span>
                    <span className={`inline-flex items-center px-4 py-1.5 text-xs font-medium rounded-sm ${getStatusColor(catalogActive ? "Active" : "Inactive")}`}>
                      {catalogActive ? "Active" : "Inactive"}
                    </span>
                    {onEditClick && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditClick(record);
                        }}
                        className="w-8 h-8 rounded-md border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors cursor-pointer"
                        title="Edit book"
                      >
                        <SquarePen className="h-4 w-4 text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No inventory items found
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryGrid;
