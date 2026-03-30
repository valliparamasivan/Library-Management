"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { X } from "lucide-react";

const RenewalHistoryDialog = ({ isOpen, onOpenChange, renewalHistory = [] }) => {
  const handleClose = () => onOpenChange(false);

  // If no renewal history provided, show empty state or default data
  const displayData = renewalHistory.length > 0 
    ? renewalHistory 
    : [
        { sNo: "01", dueDate: "05-10-2025", renewedDate: "05-10-2025", renewalCount: "1/3" },
        { sNo: "02", dueDate: "10-10-2025", renewedDate: "10-10-2025", renewalCount: "2/3" },
      ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent hideClose className="w-[calc(100%-2rem)] sm:max-w-2xl rounded-2xl p-0 border-0 max-h-[90vh] overflow-hidden flex flex-col shadow-lg">
        <div className="flex items-center justify-between px-4 sm:px-5 md:px-6 pt-4 sm:pt-5">
          <h2 className="text-lg font-semibold text-[#1A1A1A]">Renewal history</h2>
          <button
            type="button"
            onClick={handleClose}
            className="shrink-0 rounded-md text-[#1A1A1A] hover:text-[#42434B] focus:outline-none"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 md:px-6 py-4 sm:py-5">
          <div className="overflow-auto">
            <Table className="rounded-lg w-full">
              <TableHeader className="sticky top-0 z-20">
                <TableRow className="bg-[#F1F4FF] border-0">
                  <TableHead className="font-[500] text-[#6C6C6C] text-[12px] lg:text-[14px] pl-5">S.No</TableHead>
                  <TableHead className="font-[500] text-[#6C6C6C] text-[12px] lg:text-[14px]">Due Date</TableHead>
                  <TableHead className="font-[500] text-[#6C6C6C] text-[12px] lg:text-[14px]">Renewed Date</TableHead>
                  <TableHead className="font-[500] text-[#6C6C6C] text-[12px] lg:text-[14px]">Renewal Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayData.map((item, index) => (
                  <TableRow
                    key={index}
                    className={`hover:bg-gray-50 border-0 ${index % 2 !== 0 ? 'bg-[#F9F9F9]' : ''}`}
                  >
                    <TableCell className="text-[12px] lg:text-[14px] text-[#1A1A1A] p-4 pl-5">
                      {item.sNo || String(index + 1).padStart(2, '0')}
                    </TableCell>
                    <TableCell className="text-[12px] lg:text-[14px] text-[#1A1A1A] p-4">
                      {item.dueDate || "-"}
                    </TableCell>
                    <TableCell className="text-[12px] lg:text-[14px] text-[#1A1A1A] p-4">
                      {item.renewedDate || "-"}
                    </TableCell>
                    <TableCell className="text-[12px] lg:text-[14px] text-[#1A1A1A] p-4">
                      {item.renewalCount || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RenewalHistoryDialog;
