"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import RenewBookDialog from "./renewBookDialog";

const RenewDialog = ({ isOpen, onOpenChange, renewData }) => {
  const [isRenewBookDialogOpen, setIsRenewBookDialogOpen] = useState(false);
  const [selectedRenewData, setSelectedRenewData] = useState(null);

  const handleOpenChangeInternal = (open) => {
    onOpenChange(open);
    if (!open) {
      setIsRenewBookDialogOpen(false);
      setSelectedRenewData(null);
    }
  };

  const handleStatusClick = (item) => {
    setSelectedRenewData(item);
    setIsRenewBookDialogOpen(true);
  };

  const defaultRenewData = [
    {
      id: 1,
      serialNo: "01",
      bookTitle: "The Great Gatsby",
      bookId: "AHW2542800124",
      userName: "John Smith",
      userId: "U00014859",
      issueDate: "2025-11-01",
      dueDate: "2025-11-01",
      status: "Overdue",
      fine: "$03"
    },
    {
      id: 2,
      serialNo: "02",
      bookTitle: "The Great Gatsby",
      bookId: "AHW2542800124",
      userName: "Sarah Davis",
      userId: "U00014862",
      issueDate: "2025-10-15",
      dueDate: "2025-10-15",
      status: "Renewed",
      fine: "$0"
    },
    {
      id: 3,
      serialNo: "03",
      bookTitle: "The Great Gatsby",
      bookId: "AHW2542800124",
      userName: "David Wilson",
      userId: "U00014863",
      issueDate: "2025-09-30",
      dueDate: "2025-09-30",
      status: "On time",
      fine: "$0"
    },
    {
      id: 4,
      serialNo: "04",
      bookTitle: "The Great Gatsby",
      bookId: "AHW2542800124",
      userName: "Emily Johnson",
      userId: "U00014860",
      issueDate: "2025-09-25",
      dueDate: "2025-09-25",
      status: "On time",
      fine: "$0"
    },
    {
      id: 5,
      serialNo: "05",
      bookTitle: "The Great Gatsby",
      bookId: "AHW2542800124",
      userName: "Michael Brown",
      userId: "U00014881",
      issueDate: "2025-09-21",
      dueDate: "2025-09-21",
      status: "On time",
      fine: "$0"
    },
    {
      id: 6,
      serialNo: "06",
      bookTitle: "The Great Gatsby",
      bookId: "AHW2542800124",
      userName: "Laura Garcia",
      userId: "U00014864",
      issueDate: "2025-09-22",
      dueDate: "2025-09-22",
      status: "On time",
      fine: "$0"
    }
  ];

  const displayData = renewData && Array.isArray(renewData) && renewData.length > 0 ? renewData : defaultRenewData;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Overdue":
        return "bg-[#F4433633] text-[#F44336]";
      case "Renewed":
        return "bg-[#9C27B033] text-[#9C27B0]";
      case "On time":
        return "bg-[#9CCC6533] text-[#00796B]";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getFineTextColor = (fine) => {
    return fine !== "$0" ? "text-[#F44336]" : "";
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChangeInternal}>
        <DialogContent className="max-w-[95vw] md:max-w-6xl max-h-[95vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b pb-2 md:pb-2">
            <h2 className="text-lg font-semibold text-gray-900">Renew Book</h2>
          </div>
          <div className="overflow-auto border border-gray-200 rounded-lg">
            <Table className="rounded-lg w-full">
              <TableHeader className="sticky top-0 z-20">
                <TableRow className="bg-[#F1F4FF] border-[#E6E6E6]">
                  <TableHead className="font-[500] text-[#6C6C6C] text-[12px] lg:text-[14px] pl-5">S.No</TableHead>
                  <TableHead className="font-[500] text-[#6C6C6C] text-[12px] lg:text-[14px]">Book Details</TableHead>
                  <TableHead className="font-[500] text-[#6C6C6C] text-[12px] lg:text-[14px]">User</TableHead>
                  <TableHead className="font-[500] text-[#6C6C6C] text-[12px] lg:text-[14px]">Issue Date</TableHead>
                  <TableHead className="font-[500] text-[#6C6C6C] text-[12px] lg:text-[14px]">Due Date</TableHead>
                  <TableHead className="font-[500] text-[#6C6C6C] text-[12px] lg:text-[14px]">Status</TableHead>
                  <TableHead className="font-[500] text-[#6C6C6C] text-[12px] lg:text-[14px]">Fine</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayData.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={`hover:bg-gray-50 border-[#E6E6E6] ${index % 2 !== 0 ? 'bg-[#F9F9F9]' : ''}`}
                  >
                    <TableCell className="text-[12px] lg:text-[14px] gap-1 items-center p-4 pl-5">{item.serialNo}</TableCell>
                    <TableCell className="text-[12px] lg:text-[14px] gap-1 items-center p-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.bookTitle}</p>
                        <p className="text-gray-600 text-xs">{item.bookId}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-[12px] lg:text-[14px] gap-1 items-center p-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.userName}</p>
                        <p className="text-gray-600 text-xs">User ID: {item.userId}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-[12px] lg:text-[14px] gap-1 items-center p-4">{item.issueDate}</TableCell>
                    <TableCell className="text-[12px] lg:text-[14px] gap-1 items-center p-4">{item.dueDate}</TableCell>
                    <TableCell
                      className="text-[12px] lg:text-[14px] gap-1 items-center p-4 cursor-pointer"
                      onClick={() => handleStatusClick(item)}
                    >
                      <span className={`inline-block px-3 py-1 rounded-sm text-xs font-medium ${getStatusBadgeClass(item.status)}`}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className={`text-[12px] lg:text-[14px] gap-1 items-center p-4 ${getFineTextColor(item.fine)}`}>
                      {item.fine}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-start border-t border-[#E2E8F0] pt-4">
            <ButtonWidget
              onClick={() => handleOpenChangeInternal(false)}
              className="px-6 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg"
            >
              Cancel
            </ButtonWidget>
          </div>
        </DialogContent>
      </Dialog>

      <RenewBookDialog
        isOpen={isRenewBookDialogOpen}
        onOpenChange={setIsRenewBookDialogOpen}
        renewData={selectedRenewData}
      />
    </>
  );
};

export default RenewDialog;