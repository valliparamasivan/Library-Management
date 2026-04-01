import { clientAxios } from "@/config/ApiConfig";

export const getDashboardOverview = async (filter) => {
  const filterMap = { today: "TODAY", week: "WEEK", month: "MONTH", year: "TODAY" };
  const { data } = await clientAxios.get("/admin/dashboard/overview", {
    params: { Filter: filterMap[filter] || "TODAY" },
  });
  return data;
};
