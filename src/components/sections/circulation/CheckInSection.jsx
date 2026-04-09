"use client";

import React, { useEffect, useState } from "react";
import PageLayout from "@/components/layouts/PageLayout";
import usePermissions from "@/components/custom-hooks/usePermissions";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import ImageWidget from "@/components/widgets/ImageWidget";
import { ArrowLeft, CircleCheck, Mail, Phone, RefreshCw, ScanLine, X } from "lucide-react";
import { useRouter } from "next/navigation";
import bookImage from "@/assets/image/book.png";
import actionIcon from "@/assets/icons/19.svg";
import CheckinConfirmDialog from "./utils/checkinConfirmDialog";
import CheckinSuccessDialog from "./utils/checkinSuccessDialog";
import TransferDialog from "./utils/transferDialog";
import TransferSuccessDialog from "./utils/transferSuccessDialog";
import RenewBookDueDateDialog from "./utils/renewBookDueDateDialog";
import RenewSuccessDialog from "./utils/renewSuccessDialog";

const BARCODE_BARS = [2, 1, 2, 3, 1, 2, 1, 2, 3, 2, 1, 3, 2, 1, 2, 3, 1, 2];

const LibraryCardBarcode = () => {
  const totalWidth = BARCODE_BARS.reduce((acc, w) => acc + w * 2 + 1, 0);
  let x = 0;
  return (
    <svg viewBox={`0 0 ${totalWidth} 28`} className="w-full h-8 text-gray-900" preserveAspectRatio="xMidYMid meet">
      {BARCODE_BARS.map((w, i) => {
        const rect = <rect key={i} x={x} y={0} width={w * 2} height={28} fill="currentColor" />;
        x += w * 2 + 1;
        return rect;
      })}
    </svg>
  );
};

const USER_MOCK = {
  userName: "John Smith",
  email: "johnsmith@email.com",
  phone: "+91 98765 43210",
  libraryCardId: "LIB2024PS789",
  policy: "Student Policy",
  maxBooks: "10",
  issued: "03",
  pendingFine: "₹ 30",
};

const CHECKIN_ITEMS_MOCK = [
  { id: "1", title: "The Time Traveler", refId: "A182C3D4E5", author: "Mark Smith", year: "2021", dueDate: "01-11-2025", image: bookImage, renewalCount: 1, maxRenewals: 3, status: "onTime", fine: "$ 00" },
  { id: "2", title: "The Great Gatsby", refId: "B283D4E5F6", author: "F. Scott Fitzgerald", year: "1925", dueDate: "23-11-2025", image: bookImage, renewalCount: 2, maxRenewals: 3, status: "onTime", fine: "$ 00" },
  { id: "3", title: "1984", refId: "C384E5F6G7", author: "George Orwell", year: "1949", dueDate: "10-06-2025", image: bookImage, renewalCount: 3, maxRenewals: 3, status: "overdue", fine: "₹ 30", overdueDays: 5, fineAmount: "$ 05" },
];

const CheckInSection = () => {
  const router = useRouter();
  const { canView, isLoading: isPermissionsLoading, permissions } = usePermissions();
  const canCheckIn = canView("Circulation Check-In");

  useEffect(() => {
    if (isPermissionsLoading) return;
    if (permissions.length > 0 && !canCheckIn) {
      router.replace("/circulation");
    }
  }, [isPermissionsLoading, permissions.length, canCheckIn, router]);

  const user = USER_MOCK;
  const [showCheckinItems, setShowCheckinItems] = useState(false);
  const [checkinItems, setCheckinItems] = useState(CHECKIN_ITEMS_MOCK);
  const [isCheckinConfirmOpen, setIsCheckinConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [lastCheckedInItems, setLastCheckedInItems] = useState([]);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedItemForTransfer, setSelectedItemForTransfer] = useState(null);
  const [isTransferSuccessOpen, setIsTransferSuccessOpen] = useState(false);
  const [isRenewDialogOpen, setIsRenewDialogOpen] = useState(false);
  const [selectedItemForRenew, setSelectedItemForRenew] = useState(null);
  const [isRenewSuccessOpen, setIsRenewSuccessOpen] = useState(false);

  const handleRemoveItem = (id) => setCheckinItems((prev) => prev.filter((item) => item.id !== id));
  const handleTransferClick = (item) => {
    setSelectedItemForTransfer(item);
    setIsTransferDialogOpen(true);
  };
  const handleTransferConfirm = () => {
    // Handle transfer logic here
    console.log("Transfer confirmed for:", selectedItemForTransfer);
    setIsTransferDialogOpen(false);
    setIsTransferSuccessOpen(true);
  };
  const handleRenewClick = (item) => {
    setSelectedItemForRenew(item);
    setIsRenewDialogOpen(true);
  };
  const handleRenewConfirm = () => {
    // Handle renew logic here
    console.log("Renew confirmed for:", selectedItemForRenew);
    setIsRenewDialogOpen(false);
    setIsRenewSuccessOpen(true);
  };
  const handleClearAll = () => {
    setCheckinItems([]);
    setShowCheckinItems(false);
  };
  const handleConfirmCheckin = () => {
    setLastCheckedInItems(
      checkinItems.map(({ title, refId, status, overdueDays, fineAmount, fine }) => ({
        title,
        refId,
        status,
        overdueDays,
        fineAmount,
        fine,
      }))
    );
    setIsCheckinConfirmOpen(false);
    setShowCheckinItems(false);
    setCheckinItems([]);
    setIsSuccessOpen(true);
  };

  const breadcrumbs = [
    { label: "Circulation", href: "/circulation" },
    { label: "Check-In" },
  ];

  if (!isPermissionsLoading && permissions.length > 0 && !canCheckIn) {
    return null;
  }

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div className="flex items-center gap-2 border-b border-gray-200 -mx-4 px-4 py-3 mb-6">
        <ArrowLeft
          className="h-5 w-5 flex-shrink-0 cursor-pointer text-gray-600 hover:text-gray-900"
          onClick={() => router.push("/circulation")}
        />
        <h1 className="text-lg font-semibold text-gray-900">Check-In</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 pb-4">
        <div className="space-y-4 max-w-xs lg:max-w-none">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">User Details</h2>

            <div className="bg-gradient-to-br from-[#0B63CE] to-[#00A884] rounded-xl p-5 text-white shadow-md min-h-[260px] flex flex-col mb-4">
              <p className="text-xs font-medium tracking-widest opacity-90 mb-1">LIBRARY CARD</p>
              <h3 className="text-xl font-bold text-white mb-3">{user.userName}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0 opacity-90" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0 opacity-90" />
                  <span>{user.phone}</span>
                </div>
              </div>
              <div className="mt-auto pt-4">
                <div className="bg-white rounded-lg px-3 py-3 text-gray-900">
                  <p className="text-xs font-medium text-center text-gray-600 mb-1">User ID</p>
                  <LibraryCardBarcode />
                  <p className="text-sm font-semibold text-center mt-2">{user.libraryCardId}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 mb-4">
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <p className="text-xs text-gray-500 mb-0.5">Policy</p>
                <p className="text-sm font-semibold text-gray-900">{user.policy}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <p className="text-xs text-gray-500 mb-0.5">Max Books</p>
                <p className="text-sm font-semibold text-gray-900">{user.maxBooks}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <p className="text-xs text-gray-500 mb-0.5">Issued</p>
                <p className="text-sm font-semibold text-gray-900">{user.issued}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-3">
                <p className="text-xs text-gray-500 mb-0.5">Pending Fine</p>
                <p className="text-sm font-semibold text-gray-900">{user.pendingFine}</p>
              </div>
            </div>

            <ButtonWidget
              type="button"
              onClick={() => router.push("/circulation/checkin/transactions")}
              className="w-full rounded-md border-1 border-[#00796B] bg-transparent text-[#00796B] hover:bg-[#00796B]/5 py-2"
            >
              View Transactions
            </ButtonWidget>
          </div>
        </div>

        <div className="min-w-0 h-full">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full min-h-[320px] flex flex-col relative p-6">
            {!showCheckinItems ? (
              <>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <p className="text-base text-gray-500 mb-6 text-center">Scan Books to Check-In</p>
                  <button
                    type="button"
                    onClick={() => setShowCheckinItems(true)}
                    className="w-20 h-20 rounded-lg bg-[#B3DDB580] flex items-center justify-center cursor-pointer hover:bg-[#B3DDB5]/60 transition-colors"
                  >
                    <ScanLine className="w-10 h-10 text-[#00796B]" strokeWidth={1.5} />
                  </button>
                </div>
                <div className="absolute bottom-6 left-6">
                  <ButtonWidget
                    type="button"
                    onClick={() => router.push("/circulation")}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg px-5 py-2"
                  >
                    Cancel
                  </ButtonWidget>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-900">Check-In Items</h2>
                  <ButtonWidget
                    type="button"
                    onClick={handleClearAll}
                    className="text-sm border border-[#00796B] bg-white hover:bg-[#00796B]/5 text-[#00796B] rounded-lg px-3 py-1.5"
                  >
                    Clear All
                  </ButtonWidget>
                </div>
                <div className="hidden sm:grid grid-cols-[minmax(0,1fr)_80px_70px_80px_60px_100px] gap-2 sm:gap-3 text-xs text-[#1A1A1A] font-medium mb-3 px-1 items-center">
                  <span>Items ({String(checkinItems.length).padStart(2, "0")})</span>
                  <span>Due Date</span>
                  <span>Renewal Count</span>
                  <span>Status</span>
                  <span>Fine</span>
                  <span className="pl-1">Actions</span>
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto min-h-0">
                  {checkinItems.map((item) => {
                    const isOverdue = item.status === "overdue";
                    return (
                      <div
                        key={item.id}
                        className={`flex flex-col sm:grid sm:grid-cols-[minmax(0,1fr)_80px_70px_80px_60px_100px] gap-3 sm:gap-2 sm:gap-3 sm:items-center p-3 rounded-lg border bg-white ${
                          isOverdue ? "border-red-400" : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-[#DCFCE7] border border-green-200 flex items-center justify-center flex-shrink-0">
                            <CircleCheck className="w-3.5 h-3.5 text-[#00A63E]" strokeWidth={2.5} />
                          </div>
                          <ImageWidget src={item.image} alt={item.title} className="w-12 h-12 rounded object-cover flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#1A1A1A] truncate">{item.title}</p>
                            <p className="text-xs text-[#67667A] font-normal truncate">{item.refId}</p>
                            <p className="text-xs text-[#67667A] font-normal">by {item.author} - {item.year}</p>
                            {isOverdue && (
                              <p className="text-xs text-red-600 font-medium mt-1">
                                {item.overdueDays} Days - Overdue
                              </p>
                            )}
                            {isOverdue && item.fineAmount && (
                              <p className="text-xs text-[#1A1A1A] mt-0.5">Fine Amount - {item.fineAmount}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex sm:contents items-center justify-between sm:justify-start gap-2">
                          <span className="text-xs text-[#67667A] font-medium sm:hidden">Due Date:</span>
                          <span className="text-sm text-[#1A1A1A] font-medium">{item.dueDate}</span>
                        </div>
                        <div className="flex sm:contents items-center justify-between sm:justify-start gap-2">
                          <span className="text-xs text-[#67667A] font-medium sm:hidden">Renewal Count:</span>
                          <span
                            className={`text-sm ${isOverdue ? "text-red-600 font-medium" : "text-[#1A1A1A]"}`}
                          >
                            {item.renewalCount}/{item.maxRenewals}
                          </span>
                        </div>
                        <div className="flex sm:contents items-center justify-between sm:justify-start gap-2">
                          <span className="text-xs text-[#67667A] font-medium sm:hidden">Status:</span>
                          <span
                            className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium w-fit ${
                              isOverdue ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                            }`}
                          >
                            {isOverdue ? "Overdue" : "On-Time"}
                          </span>
                        </div>
                        <div className="flex sm:contents items-center justify-between sm:justify-start gap-2">
                          <span className="text-xs text-[#67667A] font-medium sm:hidden">Fine:</span>
                          <span className="text-sm text-[#1A1A1A] font-medium">{item.fine}</span>
                        </div>
                        <div className="flex sm:contents items-center justify-between sm:justify-start gap-2">
                          <span className="text-xs text-[#67667A] font-medium sm:hidden">Actions:</span>
                          <div className="flex items-center gap-1">
                            <ButtonWidget
                              type="button"
                              onClick={() => handleTransferClick(item)}
                              className="h-8 w-8 p-0 rounded bg-white hover:bg-gray-50 text-[#00796B] border border-gray-300 flex items-center justify-center"
                              title="Checked-In"
                            >
                              <ImageWidget src={actionIcon} alt="Checked-In" className="w-5 h-5" />
                            </ButtonWidget>
                            <ButtonWidget
                              type="button"
                              disabled={isOverdue}
                              loader={false}
                              onClick={() => !isOverdue && handleRenewClick(item)}
                              className={`h-8 w-8 p-0 rounded bg-white border border-gray-300 flex items-center justify-center ${
                                isOverdue
                                  ? "opacity-50 cursor-not-allowed text-gray-400"
                                  : "hover:bg-gray-50 text-[#00796B]"
                              }`}
                              title={isOverdue ? "Cannot renew overdue items" : "Renew"}
                            >
                              <RefreshCw className="w-4 h-4" />
                            </ButtonWidget>
                            <ButtonWidget
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="h-8 w-8 pr-2 rounded bg-white hover:bg-gray-50 border border-gray-300 flex items-center justify-center text-[#1A1A1A] hover:bg-gray-100"
                              title="Remove"
                              aria-label="Remove"
                            >
                              <X className="w-4 h-4" />
                            </ButtonWidget>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between gap-3 -mx-6 px-6 pt-4  mt-4">
                  <ButtonWidget
                    type="button"
                    onClick={() => router.push("/circulation")}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg px-5 py-2"
                  >
                    Cancel
                  </ButtonWidget>
                  <ButtonWidget
                    type="button"
                    onClick={() => setIsCheckinConfirmOpen(true)}
                    className="bg-[#00796B] hover:bg-[#00796B]/90 text-white rounded-lg px-5 py-2"
                  >
                    Check-In all
                  </ButtonWidget>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <CheckinConfirmDialog
        isOpen={isCheckinConfirmOpen}
        onOpenChange={setIsCheckinConfirmOpen}
        checkinItems={checkinItems}
        onConfirm={handleConfirmCheckin}
      />
      <CheckinSuccessDialog
        isOpen={isSuccessOpen}
        onOpenChange={setIsSuccessOpen}
        items={lastCheckedInItems}
      />
      <TransferDialog
        isOpen={isTransferDialogOpen}
        onOpenChange={setIsTransferDialogOpen}
        item={selectedItemForTransfer}
        onConfirm={handleTransferConfirm}
      />
      <TransferSuccessDialog
        isOpen={isTransferSuccessOpen}
        onOpenChange={setIsTransferSuccessOpen}
        item={selectedItemForTransfer}
      />
      <RenewBookDueDateDialog
        isOpen={isRenewDialogOpen}
        onOpenChange={setIsRenewDialogOpen}
        item={selectedItemForRenew}
        onConfirm={handleRenewConfirm}
      />
      <RenewSuccessDialog
        isOpen={isRenewSuccessOpen}
        onOpenChange={setIsRenewSuccessOpen}
        item={selectedItemForRenew}
      />
    </PageLayout>
  );
};

export default CheckInSection;
