import { clientAxios } from "@/config/ApiConfig";

export const exportReportToExcel = async (params = {}) => {
  const { data } = await clientAxios.get("/reports/download", {
    params: {
      sortField: params.sortField || "",
      sortOrder: params.sortOrder || "asc",
      ...params,
    },
    responseType: "blob",
  });
  return data;
};



