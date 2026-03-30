
import { serverAxios } from "@/config/ApiConfig";
import { redirect } from "next/navigation";

const handleApiError = (error) => {
  if (error?.response && error?.response?.status === 401) {
    redirect("/?unauthorised=true")
  }
  return { error: "Api Data Error" };
};

export async function getLanguageDropdown() {
  try {
    const response = await serverAxios.get("/settings/languages/dropdown");
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getBookCategoryDropdown() {
  try {
    const response = await serverAxios.get("/bookCategory/dropdown");
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getBookTypeDropdown() {
  try {
    const response = await serverAxios.get("/bookType/dropdown");
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getSectionDropdown() {
  try {
    const response = await serverAxios.get("/section/dropdown");
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getShelfDropdown(locationId) {
  try {
    const params = locationId ? { locationId } : {};
    const response = await serverAxios.get("/shelf/dropdown", { params });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getRowDropdown(shelfId) {
  try {
    const params = shelfId ? { shelfId } : {};
    const response = await serverAxios.get("/row/dropdown", { params });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getManagerOrUserDropdown() {
  try {
    const response = await serverAxios.get("/user/dropdown");
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getCountryDropdown() {
  try {
    const response = await serverAxios.get("/common/country/dropdown");
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getDepartmentDropdown() {
  try {
    const response = await serverAxios.get("/settings/department/dropdown");
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getAssetModelDropdown() {
  try {
    const response = await serverAxios.get("/asset-models/assetModel/dropdown");
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getCategoryDropdown() {
  try {
    const response = await serverAxios.get("/categories/category/dropdown");
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getManufacturerDropdown() {
  try {
    const response = await serverAxios.get("/manufacturers/manufacturer/dropdown");
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getSupplierDropdown() {
  try {
    const response = await serverAxios.get("/suppliers/dropdown");
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getStatusLabelDropdown() {
  try {
    const response = await serverAxios.get("/status-label/dropdown");
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getCategoryTypeDropdown() {
  try {
    const response = await serverAxios.get("/common/category-type/dropdown");
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getPublisherDropdown() {
  try {
    const response = await serverAxios.get("/publisherDropDown");
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getPolicyDropdown() {
  try {
    const response = await serverAxios.get("/policy/getPolicyDropdown");
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}