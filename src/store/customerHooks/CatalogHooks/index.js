import { addFavorite, addReservedBook, getReservedBook, removeFavorite, addReview } from "@/store/customerServices/CatalogServices";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAddFavorite = () => {
  return useMutation({
    mutationFn: (params) => addFavorite(params),
  });
};

export const useRemoveFavorite = () => {
  return useMutation({
    mutationFn: (params) => removeFavorite(params),
  });
};

export const useGetReservedBook = (bookId, options = {}) => {
  return useQuery({
    queryKey: ["getReservedBook", bookId],
    queryFn: () => getReservedBook(bookId),
    enabled: !!bookId,
    ...options,
  });
}

export const useAddReservedBook = () => {
  return useMutation({
    mutationFn: (params) => addReservedBook(params),
  });
}

export const useAddReview = () => {
  return useMutation({
    mutationFn: (params) => addReview(params),
  });
}