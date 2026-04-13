import { useMutation } from "@tanstack/react-query";
import { checkoutReservedBook } from "@/store/services/ReservedBookServices";

export const useCheckoutReservedBook = () => {
  return useMutation({
    mutationFn: (reserveId) => checkoutReservedBook(reserveId),
  });
};
