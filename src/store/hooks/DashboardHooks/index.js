import { useQuery } from "@tanstack/react-query";
import { getDashboardOverview } from "@/store/services/DashboardServices";

export const useDashboardOverview = (filter) => {
  return useQuery({
    queryKey: ["dashboardOverview", filter],
    queryFn: () => getDashboardOverview(filter),
  });
};
