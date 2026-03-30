"use client";

import { useMutation } from "@tanstack/react-query";
import {
  exportReportToExcel
} from "@/store/services/ExportServices";

export const useExportReportToExcel = () => {
  return useMutation({
    mutationFn: (params) => exportReportToExcel(params),
  });
};

