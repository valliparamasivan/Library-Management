"use client";

import { MoreHorizontal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useURLParams from "@/components/custom-hooks/useURLParams";
import { Button } from "../ui/button";

const PaginationWidget = ({ 
  totalPages: totalPagesProp, 
  totalItems: totalItemsProp, 
  itemsPerPage: itemsPerPageProp, 
  responseData,
  currentPage: currentPageProp,
  onPageChange: onPageChangeProp,
  className = "" 
}) => {
  const { page: currentPageFromHook = 0, handlePageChange: onPageChangeFromHook } = useURLParams();

  const totalPages = responseData?.totalPages ?? totalPagesProp ?? 1;
  const totalItems = responseData?.totalElements ?? totalItemsProp ?? 0;
  const itemsPerPage = responseData?.size ?? itemsPerPageProp ?? 10;
  const currentPage = currentPageProp ?? currentPageFromHook;
  const onPageChange = onPageChangeProp ?? onPageChangeFromHook;

  const handlePageChange = (page, newItemsPerPage) => {
    if (newItemsPerPage) {
      onPageChange(0, newItemsPerPage);
    } else {
      onPageChange(page);
    }
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    const start = Math.max(1, currentPage + 1 - delta);
    const end = Math.min(totalPages, currentPage + 1 + delta);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (range[0] > 1) {
      rangeWithDots.push(1);
      if (range[0] > 2) {
        rangeWithDots.push("...");
      }
    }

    rangeWithDots.push(...range);

    if (range[range.length - 1] < totalPages) {
      if (range[range.length - 1] < totalPages - 1) {
        rangeWithDots.push("...");
      }
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const hasItems = totalItems > 0;
  const startItem = hasItems ? currentPage * itemsPerPage + 1 : 0;
  const endItem = hasItems ? Math.min((currentPage + 1) * itemsPerPage, totalItems) : 0;
  
  const progressPercentage = totalPages > 1 ? ((currentPage + 1) / totalPages) * 100 : 0;


  const shouldShowItemsPerPage = totalItems > 10;

  const standardOptions = [10, 25, 50, 100];
  
  const pageSizeOptions = [...standardOptions];
  if (!standardOptions.includes(itemsPerPage) && itemsPerPage > 0) {
    pageSizeOptions.push(itemsPerPage);
    pageSizeOptions.sort((a, b) => a - b);
  }

  return (
    <div className={`border border-gray-200 rounded-lg p-3 ${className}`}>
      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-[#9C9BAB] transition-all duration-300"
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-700">
            Showing {startItem} to {endItem} of {totalItems.toLocaleString()} results
          </div>
          {shouldShowItemsPerPage && (
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => handlePageChange(0, parseInt(value))}
            >
              <SelectTrigger className="h-8 min-w-16 w-auto px-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0 || !hasItems}
            className="h-8 px-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-[#00796B]/10 hover:border-[#00796B] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </Button>

          {getVisiblePages().map((page, index) => {
            if (page === "...") {
              return (
                <div key={`dots-${index}`} className="flex h-8 w-8 items-center justify-center">
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </div>
              );
            }
            const pageIndex = page - 1;
            const isActive = currentPage === pageIndex;
            return (
              <Button
                key={page}
                variant="outline"
                size="sm"
                onClick={() => hasItems && handlePageChange(pageIndex)}
                disabled={!hasItems}
                className={`h-8 w-8 p-0 rounded-lg ${
                  isActive
                    ? "bg-[#00796B] text-white border-[#00796B] hover:bg-[#005a4d] hover:text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-[#00796B]/10 hover:border-[#00796B]"
                } ${!hasItems ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {page}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1 || !hasItems}
            className="h-8 px-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-[#00796B]/10 hover:border-[#00796B] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaginationWidget;
