import { serverAxios } from "@/config/ApiConfig";
import { redirect } from "next/navigation";

const handleApiError = (error) => {
  if (error?.response && error?.response?.status === 401) {
    redirect("/?unauthorised=true");
  }
  return { error: "Api Data Error" };
};

const getList = async (endpoint, defaultSortField, searchParams) => {
  try {
    const response = await serverAxios.get(endpoint, {
      params: {
        ...searchParams,
        pageNumber: searchParams.pageNumber || 0,
        pageSize: searchParams.pageSize || 10,
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



export async function getReportUserList(searchParams) {
  return getList("/usersReportList", "internalUserId", searchParams);
}

export async function getActivityList(searchParams) {
  return getList("/activityLogReportList", "activityLogId", searchParams);
}

export async function getReportLoanList(searchParams) {
  return getList("/loansReportList", "", searchParams);
}

export async function getReportInventoryList(searchParams) {
  return getList("/inventoryReportList", "", searchParams);
}

export async function getSettingsPolicyList(searchParams) {
  return getList("/policy/list", "", searchParams);
}

export async function getSettingsLocationList(searchParams) {
  return getList("/getAllLocations", "", searchParams);
}

export async function getLoanList(searchParams) {
  try {
    const response = await serverAxios.get("/loan/list", {
      params: {
        searchKey: searchParams.searchKey || "",
        type: searchParams.type || "",
        fromDate: searchParams.fromDate || "",
        toDate: searchParams.toDate || "",
        pageNumber: searchParams.pageNumber || 0,
        pageSize: searchParams.pageSize || 10,
        sortField: searchParams.sortField || "circulationLogId",
        sortMethod: searchParams.sortMethod || "desc",
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getBookList(searchParams) {
  return getList("/books/book-list", "title", searchParams);
}

export async function getBookDetailsById(id) {
  try {
    const response = await serverAxios.get(`/public/books/${id}`);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getBookLoansById(bookId, searchParams) {
  return getList(`/books/${bookId}/loans`, "", searchParams);
}

export async function getBookCopies(bookId, searchParams) {
  return getList(`/books/${bookId}/copies_rfid_location`, "", searchParams);
}

export async function getUserList(searchParams) {
  const { startDate, endDate, sortOrder, ...rest } = searchParams;
  return getList("/user/list", "internalUserId", {
    ...rest,
    ...(startDate ? { fromDate: startDate } : {}),
    ...(endDate ? { toDate: endDate } : {}),
    sortMethod: sortOrder || "desc",
  });
}

export async function getUserDetailsById(id) {
  try {
    const response = await serverAxios.get(`/user_details/${id}`);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getUserTransactions(id, searchParams) {
  const { startDate, endDate, sortOrder, statusType, dateType, ...rest } = searchParams;
  return getList("/user/transactions", "cl.circulation_log_id", {
    ...rest,
    internalUserId: id,
    ...(startDate ? { fromDate: startDate } : {}),
    ...(endDate ? { toDate: endDate } : {}),
    ...(statusType ? { type: statusType } : {}),
    sortMethod: sortOrder || "desc",
  });
}

export async function getAssetDetailsById(assetUuid) {
  try {
    const response = await serverAxios.get(`/asset/getAsset-details/${assetUuid}`);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}


export async function getAssetTagPrefixAndPostfix() {
  try {
    const response = await serverAxios.get(`/asset/getSettings`);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getCompanyById(id) {
  try {
    const response = await serverAxios.get(`/companies/getByUniqueId/${id}`);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}


export async function getCategoryById(id) {
  try {
    const response = await serverAxios.get(`/categories/getByUniqueId/${id}`);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getManufacturerById(id) {
  try {
    const response = await serverAxios.get(`/manufacturers/getByUniqueId/${id}`);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getStatusLabelById(id) {
  try {
    const response = await serverAxios.get(`/getByUniqueId/${id}`);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}


export async function getSupplierById(id) {
  try {
    const response = await serverAxios.get(`/suppliers/getByUniqueId/${id}`);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}


export async function getEmployeeList(searchParams) {
  return getList("/employee/employee-list", "employeeId", searchParams);
}

export async function getRoleList(searchParams) {
  return getList("/role/list", "roleId", searchParams);
}

export async function getAllRolesDropdown() {
  try {
    const response = await serverAxios.get('/get_all_roles');
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getAdminReservedList(searchParams) {
  try {
    const response = await serverAxios.get("/admin/reserved/list", {
      params: {
        searchKey: searchParams.searchKey || "",
        status: searchParams.status || "",
        pageNumber: searchParams.pageNumber || 0,
        pageSize: searchParams.pageSize || 10,
        sortField: searchParams.sortField || "reservedDate",
        sortOrder: searchParams.sortOrder || "desc",
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getAdminReviewList(searchParams) {
  try {
    const response = await serverAxios.get("/admin/reviews/list", {
      params: {
        searchKey: searchParams.searchKey || "",
        rating: searchParams.rating || "",
        pageNumber: searchParams.pageNumber || 0,
        pageSize: searchParams.pageSize || 10,
        sortField: searchParams.sortField || "createdAt",
        sortOrder: searchParams.sortOrder || "desc",
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getFineList(searchParams) {
  try {
    const response = await serverAxios.get("/fines/list", {
      params: {
        searchKey: searchParams.searchKey || "",
        status: searchParams.status || "",
        pageNumber: searchParams.pageNumber || 0,
        pageSize: searchParams.pageSize || 10,
        sortField: searchParams.sortField || "fineCreatedAt",
        sortOrder: searchParams.sortOrder || "desc",
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}