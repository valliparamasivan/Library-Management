import { useMutation, useQuery } from "@tanstack/react-query";
import { payFine, getFineSummary } from "@/store/services/FineServices";

export const usePayFine = () => {
  return useMutation({
    mutationFn: (params) => payFine(params),
  });
};

export const useFineSummary = () => {
  return useQuery({
    queryKey: ["fineSummary"],
    queryFn: () => getFineSummary(),
  });
};
