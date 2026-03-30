"use client";

import React from "react";
import { Button } from "@/components/ui/button";

const CustomerPagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = "",
}) => {
  const getVisiblePages = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];

    if (totalPages <= 5) {
      // Show all pages if 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
      return range;
    }

    // Always show first page
    range.push(1);

    // Calculate start and end of middle range
    let start = Math.max(2, currentPage - delta);
    let end = Math.min(totalPages - 1, currentPage + delta);

    // Adjust if we're near the start
    if (currentPage <= 3) {
      end = Math.min(4, totalPages - 1);
      start = 2;
    }

    // Adjust if we're near the end
    if (currentPage >= totalPages - 2) {
      start = Math.max(2, totalPages - 3);
      end = totalPages - 1;
    }

    // Add ellipsis and middle pages
    if (start > 2) {
      rangeWithDots.push("...");
    }

    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        rangeWithDots.push(i);
      }
    }

    if (end < totalPages - 1) {
      rangeWithDots.push("...");
    }

    // Always show last page
    if (totalPages > 1) {
      range.push(...rangeWithDots, totalPages);
    }

    return range;
  };

  const visiblePages = getVisiblePages();
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
        disabled={isFirstPage}
        className="h-9 px-4 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-400"
      >
        Previous
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 sm:gap-2">
        {visiblePages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-gray-700 text-sm"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <Button
              key={page}
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page)}
              className={`h-9 min-w-[36px] sm:min-w-[40px] px-3 sm:px-4 rounded-lg p-0 ${
                isActive
                  ? "bg-[#0b63ce] text-white border-[#0b63ce] hover:bg-[#0a5ab8] hover:border-[#0a5ab8] hover:text-white"
                  : "bg-white border border-gray-300 text-gray-900 hover:bg-gray-50"
              }`}
            >
              {page}
            </Button>
          );
        })}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => !isLastPage && onPageChange(currentPage + 1)}
        disabled={isLastPage}
        className="h-9 px-4 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:text-gray-400"
      >
        Next
      </Button>
    </div>
  );
};

export default CustomerPagination;
