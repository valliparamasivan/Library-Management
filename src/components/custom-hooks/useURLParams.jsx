"use client";

import { ArrowDown, ArrowUp, ArrowUpDown ,ChevronUp ,ChevronDown, ChevronsUpDown} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useURLParams = (config = {}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    pageParam = "pageNumber",
    sizeParam = "pageSize",
    searchParam = "searchKey",
    sortFieldParam = "sortField",
    sortOrderParam = "sortOrder",
    hideColumnsParam = "hiddenColumns",
    defaultPageSize = 10,
    defaultSortOrder = "desc",
    defaultColumns = [],
    additionalParams = {},
  } = config;

  const getCurrentParams = useCallback(() => {
    const params = {};

    params.page = parseInt(searchParams.get(pageParam) || "0", 10);
    params.size = parseInt(searchParams.get(sizeParam) || defaultPageSize.toString(), 10);
    params.search = searchParams.get(searchParam) || "";
    params.sortField = searchParams.get(sortFieldParam) || "";
    params.sortOrder = searchParams.get(sortOrderParam) || defaultSortOrder;

    const hideColumnsValue = searchParams.get(hideColumnsParam);
    if (hideColumnsValue) {
      params.hideColumns = hideColumnsValue.split("_").filter((col) => col.trim() !== "");
    } else {
      params.hideColumns = [];
    }

    Object.keys(additionalParams).forEach((key) => {
      const paramConfig = additionalParams[key];
      const paramName = paramConfig.paramName || key;
      const defaultValue = paramConfig.defaultValue || "";
      params[key] = searchParams.get(paramName) || defaultValue;
    });

    return params;
  }, [searchParams, pageParam, sizeParam, searchParam, sortFieldParam, sortOrderParam, hideColumnsParam, defaultPageSize, defaultSortOrder, additionalParams]);

  const updateURL = useCallback(
    (updates = {}) => {
      const params = new URLSearchParams(searchParams);
      const currentParams = getCurrentParams();

      const newParams = { ...currentParams, ...updates };

      if (newParams.page > 0) {
        params.set(pageParam, newParams.page.toString());
      } else {
        params.delete(pageParam);
      }

      if (newParams.size !== defaultPageSize) {
        params.set(sizeParam, newParams.size.toString());
      } else {
        params.delete(sizeParam);
      }

      if (newParams.search && newParams.search.trim() !== "") {
        params.set(searchParam, newParams.search.trim());
      } else {
        params.delete(searchParam);
      }

      if (newParams.sortField && newParams.sortField.trim() !== "") {
        params.set(sortFieldParam, newParams.sortField.trim());
      } else {
        params.delete(sortFieldParam);
      }

      if (newParams.sortOrder && newParams.sortOrder !== defaultSortOrder) {
        params.set(sortOrderParam, newParams.sortOrder);
      } else {
        params.delete(sortOrderParam);
      }

      if (newParams.hideColumns && Array.isArray(newParams.hideColumns) && newParams.hideColumns.length > 0) {
        const hideColumnsString = newParams.hideColumns.join("_");
        params.set(hideColumnsParam, hideColumnsString);
      } else {
        params.delete(hideColumnsParam);
      }

      Object.keys(additionalParams).forEach((key) => {
        const paramConfig = additionalParams[key];
        const paramName = paramConfig.paramName || key;
        const defaultValue = paramConfig.defaultValue || "";

        if (newParams[key] && String(newParams[key]).trim() !== "" && newParams[key] !== defaultValue) {
          params.set(paramName, String(newParams[key]).trim());
        } else {
          params.delete(paramName);
        }
      });

      const queryString = params.toString();
      const newURL = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(newURL, { scroll: false });
    },
    [
      searchParams,
      pathname,
      router,
      pageParam,
      sizeParam,
      searchParam,
      sortFieldParam,
      sortOrderParam,
      hideColumnsParam,
      defaultPageSize,
      defaultSortOrder,
      additionalParams,
      getCurrentParams,
    ],
  );

  const handlePageChange = useCallback(
    (page, newItemsPerPage) => {
      const currentParams = getCurrentParams();

      if (newItemsPerPage) {
        updateURL({ page: 0, size: newItemsPerPage });
      } else {
        updateURL({ page, size: currentParams.size });
      }
    },
    [updateURL, getCurrentParams],
  );

  const handleSearch = useCallback(
    (searchTerm) => {
      updateURL({ page: 0, search: searchTerm });
    },
    [updateURL],
  );

  const getSortIcon = useCallback(
    (field) => {
      const currentParams = getCurrentParams();

      if (currentParams.sortField !== field) {
        return <ChevronsUpDown className="w-3 h-3 lg:w-4 lg:h-4 text-[#67667A]" />;
      }

      return currentParams.sortOrder === "asc" ? <ChevronUp className="w-3 h-3 lg:w-4 lg:h-4 text-[#92DEC2]" /> : <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 text-[#92DEC2]" />;
    },
    [getCurrentParams],
  );

  const handleSort = useCallback(
    (field) => {
      const currentParams = getCurrentParams();
      let newDirection = defaultSortOrder;

      if (currentParams.sortField === field && currentParams.sortOrder === defaultSortOrder) {
        newDirection = "asc";
      } else if (currentParams.sortField === field && currentParams.sortOrder === "asc") {
        newDirection = "";
      }

      if (newDirection === "") {
        updateURL({ page: 0, sortField: "", sortOrder: defaultSortOrder });
      } else {
        updateURL({ page: 0, sortField: field, sortOrder: newDirection });
      }
    },
    [updateURL, getCurrentParams, defaultSortOrder],
  );

  const handleFilter = useCallback(
    (filterKey, filterValue) => {
      updateURL({ page: 0, [filterKey]: filterValue });
    },
    [updateURL],
  );

  const resetFilters = useCallback(() => {
    const resetParams = {
      page: 0,
      size: defaultPageSize,
      search: "",
      sortField: "",
      sortOrder: defaultSortOrder,
      hideColumns: [],
    };

    Object.keys(additionalParams).forEach((key) => {
      const paramConfig = additionalParams[key];
      resetParams[key] = paramConfig.defaultValue || "";
    });

    updateURL(resetParams);
  }, [updateURL, defaultPageSize, defaultSortOrder, additionalParams]);

  const toggleColumnVisibility = useCallback(
    (columnKey) => {
      const currentParams = getCurrentParams();
      const currentHideColumns = currentParams.hideColumns || [];

      let newHideColumns;
      if (currentHideColumns.includes(columnKey)) {
        newHideColumns = currentHideColumns.filter((col) => col !== columnKey);
      } else {
        newHideColumns = [...currentHideColumns, columnKey];
      }

      updateURL({ hideColumns: newHideColumns });
    },
    [updateURL, getCurrentParams],
  );

  const setColumnVisibility = useCallback(
    (columns) => {
      const allColumns = defaultColumns;
      const visibleColumns = Array.isArray(columns) ? columns : [];
      const hideColumns = allColumns.filter((col) => !visibleColumns.includes(col));
      updateURL({ hideColumns });
    },
    [updateURL, defaultColumns],
  );

  const isColumnVisible = useCallback(
    (columnKey) => {
      const currentParams = getCurrentParams();
      return !(currentParams.hideColumns || []).includes(columnKey);
    },
    [getCurrentParams],
  );

  const handleDateRangeChange = useCallback(
    (dateRange, fromDateParam = "fromDate", toDateParam = "toDate") => {
      if (dateRange?.from && dateRange.to) {
        const formatDate = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };

        const fromDateStr = formatDate(dateRange.from);
        const toDateStr = formatDate(dateRange.to);

        updateURL({
          page: 0,
          [fromDateParam]: fromDateStr,
          [toDateParam]: toDateStr,
        });
      } else if (dateRange === null) {
        updateURL({
          page: 0,
          [fromDateParam]: "",
          [toDateParam]: "",
        });
      }
    },
    [updateURL],
  );

  const getDateRange = useCallback(
    (fromDateParam = "fromDate", toDateParam = "toDate") => {
      const currentParams = getCurrentParams();
      const fromDate = currentParams[fromDateParam];
      const toDate = currentParams[toDateParam];

      if (fromDate && toDate) {
        return {
          from: new Date(fromDate),
          to: new Date(toDate),
        };
      }
      return null;
    },
    [getCurrentParams],
  );

  return {
    ...getCurrentParams(),
    handlePageChange,
    handleSearch,
    handleSort,
    handleFilter,
    resetFilters,
    updateURL,
    getSortIcon,
    getCurrentParams,
    toggleColumnVisibility,
    setColumnVisibility,
    isColumnVisible,
    handleDateRangeChange,
    getDateRange,
  };
};

export default useURLParams;
