import { clientAxios } from "@/config/ApiConfig";

export const exportReportToExcel = async (params = {}) => {
  const { data } = await clientAxios.get("/reports/download", {
    params: {
      sortField: params.sortField || "",
      sortOrder: params.sortOrder || "asc",
      ...params,
    },
    paramsSerializer: (p) => {
      const parts = [];
      Object.entries(p).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`));
        } else if (value !== undefined && value !== null) {
          parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        }
      });
      return parts.join("&");
    },
    responseType: "blob",
  });
  return data;
};



