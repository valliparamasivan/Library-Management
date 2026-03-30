import { useMutation } from "@tanstack/react-query";
import { searchBookOrUser, getUserTransactions, issueBook, scanBook, returnBook, renewBook, scanUser } from "@/store/services/CirculationServices";

export const useSearchBookOrUser = () => {
  return useMutation({
    mutationFn: (params) => searchBookOrUser(params),
  });
};

export const useGetUserTransactions = () => {
  return useMutation({
    mutationFn: (params) => getUserTransactions(params),
  });
};

export const useIssueBook = () => {
  return useMutation({
    mutationFn: (params) => issueBook(params),
  });
};

export const useScanBook = () => {
  return useMutation({
    mutationFn: (params) => scanBook(params),
  });
};

export const useReturnBook = () => {
  return useMutation({
    mutationFn: (params) => returnBook(params),
  });
};

export const useRenewBook = () => {
  return useMutation({
    mutationFn: (params) => renewBook(params),
  });
};

export const useScanUser = () => {
  return useMutation({
    mutationFn: (params) => scanUser(params),
  });
};
