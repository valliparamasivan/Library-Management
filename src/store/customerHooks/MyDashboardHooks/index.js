import { renewBook } from "@/store/customerServices/MyDashboardServices";
import { useMutation } from "@tanstack/react-query";

export const useRenewBook = () => {
    return useMutation({
        mutationFn: (params) => renewBook(params),
    });
};
