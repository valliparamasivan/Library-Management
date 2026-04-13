import { useMutation, useQuery } from "@tanstack/react-query";
import { bookCategoryCreate, bookTypeCreate, languageCreate, bookCreate, bookUpdate, bookAddQuantity, bookChangeStatus, getShelfDropdown, getRowDropdown, assignLocation, editLocation, releaseRfid, reprintRfid, updateRfidPrintStatus, printRfidTagsZpl, bulkImportBooks } from "@/store/services/InventoryServices";

export const useBookCategoryCreate = () => {
    return useMutation({
      mutationFn: (params) => bookCategoryCreate(params),
    });
  };

export const useBookTypeCreate = () => {
    return useMutation({
      mutationFn: (params) => bookTypeCreate(params),
    });
  };

export const useLanguageCreate = () => {
    return useMutation({
      mutationFn: (params) => languageCreate(params),
    });
  };

export const useBookCreate = () => {
    return useMutation({
      mutationFn: (formData) => bookCreate(formData),
    });
  };

export const useBookUpdate = () => {
    return useMutation({
      mutationFn: (formData) => bookUpdate(formData),
    });
  };

export const useBookAddQuantity = () => {
    return useMutation({
      mutationFn: (params) => bookAddQuantity(params),
    });
  };

export const useBookChangeStatus = () => {
  return useMutation({
    mutationFn: (bookId) => bookChangeStatus(bookId),
  });
};

export const useShelfDropdown = (locationId) => {
    return useQuery({
      queryKey: ["shelfDropdown", locationId],
      queryFn: () => getShelfDropdown(locationId),
      enabled: !!locationId, // Only fetch when locationId is provided
    });
  };

export const useRowDropdown = (shelfId) => {
    return useQuery({
      queryKey: ["rowDropdown", shelfId],
      queryFn: () => getRowDropdown(shelfId),
      enabled: !!shelfId, // Only fetch when shelfId is provided
    });
  };

export const useAssignLocation = () => {
    return useMutation({
      mutationFn: (params) => assignLocation(params),
    });
  };

export const useEditLocation = () => {
    return useMutation({
      mutationFn: (params) => editLocation(params),
    });
  };

export const useReleaseRfid = () => {
    return useMutation({
      mutationFn: (bookCopyId) => releaseRfid(bookCopyId),
    });
  };

export const useReprintRfid = () => {
    return useMutation({
      mutationFn: (params) => reprintRfid(params),
    });
  };

export const useUpdateRfidPrintStatus = () => {
    return useMutation({
      mutationFn: (rfidIds) => updateRfidPrintStatus(rfidIds),
    });
  };

export const usePrintRfidTagsZpl = () => {
    return useMutation({
      mutationFn: (rfidTagIds) => printRfidTagsZpl(rfidTagIds),
    });
  };

export const useBulkImportBooks = () => {
    return useMutation({
      mutationFn: (formData) => bulkImportBooks(formData),
    });
  };