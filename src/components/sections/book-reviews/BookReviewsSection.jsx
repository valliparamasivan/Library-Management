"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import useURLParams from "@/components/custom-hooks/useURLParams";
import PageLayout from "@/components/layouts/PageLayout";
import TitleWidget from "@/components/widgets/TitleWidget";
import SearchWidget from "@/components/widgets/SearchWidget";
import TableWidget from "@/components/widgets/TableWidget";
import usePermissions from "@/components/custom-hooks/usePermissions";

const RATING_OPTIONS = [
  { value: "", label: "All Ratings" },
  { value: "5", label: "5 Stars" },
  { value: "4", label: "4 Stars" },
  { value: "3", label: "3 Stars" },
  { value: "2", label: "2 Stars" },
  { value: "1", label: "1 Star" },
];

const renderStars = (rating) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${star <= rating ? "fill-[#F59E0B] text-[#F59E0B]" : "fill-gray-200 text-gray-200"}`}
        />
      ))}
    </div>
  );
};

const BookReviewsSection = ({ response }) => {
  const router = useRouter();
  const { canView, isLoading: isPermissionsLoading, permissions } = usePermissions();
  const canViewReviews = canView("Book Reviews");

  const breadcrumbs = [{ label: "Book Reviews", href: "/book-reviews" }];

  const {
    page: currentPage,
    size: itemsPerPage,
    search: searchTerm,
    rating: ratingFilter,
    handlePageChange,
    handleSearch,
    handleSort,
    getSortIcon,
    handleFilter,
  } = useURLParams({
    defaultColumns: [
      "bookTitle", "reviewerName", "rating", "review", "createdAt",
    ],
    additionalParams: {
      rating: {
        paramName: "rating",
        defaultValue: "",
      },
    },
  });

  useEffect(() => {
    if (isPermissionsLoading) return;
    if (permissions.length > 0 && !canViewReviews) {
      router.replace("/dashboard");
    }
  }, [isPermissionsLoading, permissions.length, canViewReviews, router]);

  const columns = [
    {
      key: "sno",
      label: "S.No",
      sortable: false,
      minWidth: "60px",
      render: (_, index) => {
        const sn = currentPage * itemsPerPage + index + 1;
        return <span>{String(sn).padStart(2, "0")}</span>;
      },
    },
    {
      key: "bookTitle",
      label: "Book",
      sortable: true,
      minWidth: "180px",
      render: (record) => (
        <div>
          <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{record.bookTitle}</p>
          <p className="text-xs text-gray-500">{record.isbn}</p>
        </div>
      ),
    },
    {
      key: "reviewerName",
      label: "Reviewed By",
      sortable: true,
      minWidth: "140px",
      render: (record) => (
        <div>
          <p className="text-sm text-gray-900">{record.reviewerName || "-"}</p>
          <p className="text-xs text-gray-500">{record.reviewerEmail || ""}</p>
        </div>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      sortable: true,
      minWidth: "120px",
      render: (record) => (
        <div className="flex items-center gap-2">
          {renderStars(record.rating)}
          <span className="text-sm font-medium text-gray-700">{record.rating}</span>
        </div>
      ),
    },
    {
      key: "review",
      label: "Review",
      sortable: false,
      minWidth: "250px",
      render: (record) => (
        <p className="text-sm text-gray-600 line-clamp-2 max-w-[300px]" title={record.review}>
          {record.review || "-"}
        </p>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      minWidth: "100px",
      render: (record) => (
        <span className="text-sm text-gray-600">{record.createdAt || "-"}</span>
      ),
    },
  ];

  if (!isPermissionsLoading && permissions.length > 0 && !canViewReviews) {
    return null;
  }

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div className="pt-2" />
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4 py-2 border-b -mx-4 px-4">
        <TitleWidget title="Book Reviews" />
        <div className="flex items-center gap-2 flex-wrap">
          <SearchWidget
            placeholder="Search by book, reviewer, review..."
            value={searchTerm}
            onSearch={handleSearch}
            className="w-full sm:w-60 rounded-[14px]!"
          />
          <select
            value={ratingFilter || ""}
            onChange={(e) => handleFilter("rating", e.target.value)}
            className="h-9 px-3 text-sm border border-gray-300 rounded-sm bg-white focus:outline-none focus:border-[#00796B]"
          >
            {RATING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <TableWidget
        columns={columns}
        response={response}
        handleSort={handleSort}
        getSortIcon={getSortIcon}
        searchTerm={searchTerm}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        handlePageChange={handlePageChange}
        height="h-[calc(100vh-230px)]"
      />
    </PageLayout>
  );
};

export default BookReviewsSection;
