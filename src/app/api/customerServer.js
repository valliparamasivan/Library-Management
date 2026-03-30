import { serverAxios } from "@/config/ApiConfig";
import { redirect } from "next/navigation";

const handleApiError = (error) => {
  if (error?.response && error?.response?.status === 401) {
    redirect("/?unauthorised=true");
  }
  return {
    error: "Api Data Error",
    details: error?.response?.data || error?.data,
  };
};

const getList = async (endpoint, defaultSortField, searchParams = {}) => {
  try {
    const response = await serverAxios.get(endpoint, {
      params: {
        ...searchParams,
        pageNumber: searchParams.pageNumber || 0,
        pageSize: searchParams.pageSize || 4,
        searchKey: searchParams.searchKey || "",
        sortField: searchParams.sortField || defaultSortField,
        sortOrder: searchParams.sortOrder || "desc",
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

const getById = async (endpoint) => {
  try {
    const response = await serverAxios.get(endpoint);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

const getWithParams = async (endpoint, searchParams = {}) => {
  try {
    const response = await serverAxios.get(endpoint, {
      params: {
        pageNumber: searchParams?.pageNumber || 0,
        pageSize: searchParams?.pageSize || 4,
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export async function getHomeList(searchParams) {
  return getWithParams("/public/home/customer",searchParams);
}

export async function getBooksList(searchParams) {
  return getList("/public/books", "title", searchParams);
}

export async function getBookDetails(id) {
  return getById(`/public/books/${id}`);
}

export async function getLanguagesDropdown() {
  return getById("/public/language/dropdown");
}

export async function getBookCategoriesDropdown() {
  return getById("/public/bookCategory/dropdown");
}

//dashboard

export async function getOverviewCounts() {
    return getById(`/overview/counts`);
}

export async function getOverviewList() {
  return getById("/overview_list");
}

export async function getBorrowedList(searchParams) {
  return getList("/borrowed/list", "circulationLogId", searchParams);
}

export async function getReservedList(searchParams) {
  return getList("/reserved/list", "bookReserveId", searchParams);
}

export async function getHistoryList(searchParams) {
  return getList("/history/list", "issuedDate", searchParams);
}

export async function getFavoritesList(searchParams) {
  return getList("/favourite/list", "bookFavoriteId", searchParams);
}

//customer catalog

export async function getCustomerCatalogList(searchParams) {
  return getList("/books/catalog/list", "title", searchParams);
}

export async function getCustomerBookDetails(id) {
  return getById(`/book/${id}`);
}

export async function getReviewsList(id) {
  return getById(`public/rating/list/${id}`);
}

//profile

export async function getProfileDetails() {
  return getById(`/profile-settings/dashboard`);
}