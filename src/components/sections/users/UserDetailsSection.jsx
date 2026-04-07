"use client";

import userImage from '@/assets/image/user.png';
import PageLayout from '@/components/layouts/PageLayout';
import ButtonWidget from '@/components/widgets/ButtonWidget';
import ImageWidget from '@/components/widgets/ImageWidget';
import { ArrowLeft, CircleCheck, Mail, Pencil, Phone, Printer, Send, SquarePen, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import FormInput from '@/components/form/FormInput';
import FormSelect from '@/components/form/FormSelect';
import { getUserStatusColor } from '@/helpers/FuntionalHelpers';
import useErrorHandler from '@/components/custom-hooks/useErrorHandler';
import { useUserChangeStatus, useEditUser, useSendPasswordResetMail } from '@/store/hooks/UserHooks';
import UserDetailsNavigation from './utils/userDetailsNavigation';
import TableWidget from '@/components/widgets/TableWidget';
import SuccessPopupWidget from '@/components/widgets/SuccessPopupWidget';
import useURLParams from '@/components/custom-hooks/useURLParams';
import DateRangePicker from '@/components/widgets/DateRangePicker';
import { endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek } from 'date-fns';
import usePermissions from '@/components/custom-hooks/usePermissions';

const BARCODE_BARS = [2, 1, 2, 3, 1, 2, 1, 2, 3, 2, 1, 3, 2, 1, 2, 3, 1, 2];

const getTransactionStatusClass = (status) => {
  switch (status) {
    case 'Check-In': return 'bg-[#4CAF5033] text-[#4CAF50]';
    case 'Renewed': return 'bg-[#900AEF33] text-[#900AEF]';
    case 'Checked-Out': return 'bg-[#E77B3333] text-[#E77B33]';
    case 'Overdue': return 'bg-[#F4433633] text-[#F44336]';
    default: return 'bg-gray-100 text-gray-700';
  }
};

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

const UserDetailsSection = ({ id, userResponse, policyResponse, transactionsResponse }) => {
  const router = useRouter();
  const { canEdit, canView } = usePermissions();
  const canViewTransactions = canView('User Transactions');
  const userData = userResponse?.data || {};

  const user = {
    internalUserId: userData.internalUserId ? String(userData.internalUserId) : id,
    userId: userData.userId || "-",
    libraryCardId: userData.userId || "-",
    userName: userData.userName || "",
    email: userData.email || "",
    phone: userData.mobile || "",
    policy: userData.policyId ? String(userData.policyId) : "",
    policyName: userData.policyName || "",
    status: userData.status ? "Active" : "Inactive",
    statusType: userData.status ? "Active" : "Inactive",
    joinedDate: userData.joinedDate || "-",
    profileImage: userData.profileImageUrl || null,
  };

  const [activeTab, setActiveTab] = useState('user-details');
  const [isStatusActive, setIsStatusActive] = useState(user.status === 'Active');
  const { mutateAsync: changeUserStatus, isPending: isStatusChangePending } = useUserChangeStatus();
  const { mutateAsync: editUser, isPending: isEditingActive } = useEditUser();
  const { mutateAsync: sendResetMail, isPending: isSendingReset } = useSendPasswordResetMail();
  const { showSuccessToast, showErrorToast } = useErrorHandler();
  const [isUserDetailsEditing, setIsUserDetailsEditing] = useState(false);
  const [isPasswordResetSuccessOpen, setIsPasswordResetSuccessOpen] = useState(false);
  const [isPrintCardSuccessOpen, setIsPrintCardSuccessOpen] = useState(false);
  const printCardRef = useRef(null);

  const handleSendPasswordReset = async () => {
    if (!user.email) {
      showErrorToast("User email is missing");
      return;
    }
    try {
      await sendResetMail({ email: user.email, userType: "CUST" });
      setIsPasswordResetSuccessOpen(true);
    } catch (error) {
      showErrorToast(error?.data?.message || error?.message || "Failed to send password reset link");
    }
  };

  const handlePrintCard = () => {
    if (printCardRef.current) {
      const printWindow = window.open("", "_blank", "width=600,height=500");
      if (printWindow) {
        printWindow.document.write(`
          <html>
          <head><title>Library Card - ${user.userName}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            html, body { height: 100%; width: 100%; }
            body { display: flex; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .container { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; }
            .barcode svg { width: 100%; height: 80px; }
            .user-id { font-size: 28px; font-weight: 600; text-align: center; color: #111; letter-spacing: 2px; }
            @media print {
              @page { size: auto; margin: 0; }
              body { height: 100vh; width: 100vw; }
            }
          </style>
          </head>
          <body>
            <div class="container">
              <div class="barcode">
                ${printCardRef.current.querySelector('.bg-white.rounded-lg svg')?.outerHTML || ''}
              </div>
              <p class="user-id">${user.userId}</p>
            </div>
          </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
    setIsPrintCardSuccessOpen(true);
  };

  const {
    page: transactionsPage,
    size: transactionsPageSize,
    search: transactionsSearch,
    fromDate,
    toDate,
    dateFilterType,
    handlePageChange: handleTransactionsPageChange,
    handleSearch: handleTransactionsSearch,
    handleSort: handleTransactionsSort,
    getSortIcon: getTransactionsSortIcon,
    updateURL
  } = useURLParams({
    defaultColumns: [
      "sNo", "bookDetails", "checkOutDate", "dueDate", "checkInDate", "renewedDate", "renewalCount", "overdueDays", "fine", "status"
    ],
    additionalParams: {
      dateFilterType: { paramName: "dateType", defaultValue: "" },
      fromDate: { paramName: "startDate", defaultValue: "" },
      toDate: { paramName: "endDate", defaultValue: "" },
      statusType: { paramName: "statusType", defaultValue: "" },
    },
  });

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  const displayImageUrl = profileImageUrl || (user.profileImage
    ? (user.profileImage.startsWith('http') ? user.profileImage : `https://libraryapi.corpfield.com/profile-image/${user.profileImage}`)
    : userImage);

  const profileImageInputRef = useRef(null);

  const handleStatusToggle = async (newCheckedStatus) => {
    if (!id) {
      showErrorToast("User ID is missing");
      return;
    }
    try {
      const response = await changeUserStatus(id);
      showSuccessToast(response?.message);
      setIsStatusActive(newCheckedStatus);
      router.refresh();
    } catch (error) {
      showErrorToast(error?.data?.message ?? error?.message);
    }
  };

  const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return;
    if (profileImageUrl) URL.revokeObjectURL(profileImageUrl);
    setProfileImageUrl(URL.createObjectURL(file));
    setProfileImageFile(file);
    setIsUserDetailsEditing(true);
    e.target.value = '';
  };

  const triggerProfileImageSelect = () => profileImageInputRef.current?.click();

  const breadcrumbs = [
    { label: 'Users', href: '/users' },
    { label: 'User Details' },
  ];

  const { control, reset, handleSubmit } = useForm({
    defaultValues: {
      name: user.userName,
      email: user.email,
      mobile: user.phone,
      policy: user.policy,
    },
  });

  const handleCancelUserDetails = () => {
    reset({
      name: user.userName,
      email: user.email,
      mobile: user.phone,
      policy: user.policy,
    });
    setIsUserDetailsEditing(false);
    setProfileImageFile(null);
  };

  const onSubmitEditUser = async (data) => {
    try {
      const formData = new FormData();
      formData.append("internalUserId", String(user.internalUserId));
      formData.append("status", isStatusActive ? "true" : "false");
      formData.append("userName", data.name);
      formData.append("email", data.email);
      formData.append("phoneNumber", data.mobile);
      formData.append("policyId", data.policy);

      if (profileImageFile) {
        formData.append("profileImg", profileImageFile);
      }

      const response = await editUser(formData);
      showSuccessToast(response?.message || "User updated successfully");
      setIsUserDetailsEditing(false);
      setProfileImageFile(null);
      router.refresh();
    } catch (error) {
      showErrorToast(error?.data?.message ?? error?.message);
    }
  };

  const policyOptions = policyResponse?.data?.content?.map((item) => ({
    value: String(item.policyId),
    label: item.policyName,
  })) || (user.policy && user.policyName
    ? [{ label: user.policyName, value: user.policy }]
    : []);

  const parseDateFilterType = (v) => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) && n >= 1 && n <= 4 ? n : null;
  };

  const dateRangeFromFilterType = (typeNum) => {
    const today = new Date();
    if (typeNum === 1) return { from: startOfDay(today), to: endOfDay(today) };
    if (typeNum === 2) return { from: startOfWeek(today), to: endOfWeek(today) };
    if (typeNum === 3) return { from: startOfMonth(today), to: endOfMonth(today) };
    return null;
  };

  const initialDateType = parseDateFilterType(dateFilterType);

  const transactionPickerInitialRange = useMemo(() => {
    if (fromDate && toDate) {
      return { from: new Date(fromDate), to: new Date(toDate) };
    }
    if (initialDateType) {
      return dateRangeFromFilterType(initialDateType);
    }
    return null;
  }, [fromDate, toDate, initialDateType]);

  const handleTransactionDateFilterChange = (dateRange, meta = {}) => {
  if (!dateRange) {
    updateURL({
      page: 0,
      fromDate: "",
      toDate: "",
      dateFilterType: "",
    });
    return;
  }

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };
  if (meta?.dateType === 1 || meta?.dateType === 2 || meta?.dateType === 3) {
    updateURL({
      page: 0,
      fromDate: formatDate(dateRange.from),
      toDate: formatDate(dateRange.to),
      dateFilterType: String(meta.dateType),
    });
    return;
  }
  updateURL({
    page: 0,
    fromDate: formatDate(dateRange.from),
    toDate: formatDate(dateRange.to),
    dateFilterType: "",
  });
};

  const formatJoined = (d) => (!d ? '' : d.replace(/\//g, '-'));

  const transactionsPageData = transactionsResponse?.data;
  const mappedTransactionsResponse = transactionsPageData?.content != null ? {
    data: {
      ...transactionsPageData,
      pageSize: transactionsPageData.size ?? transactionsPageData.pageSize,
      content: transactionsPageData.content.map((tx, index) => {
        const parts = (tx.renewalCount || "0/0").split("/");
        const renewCurrent = Number(parts[0]) || 0;
        const renewMax = Number(parts[1]) || 0;
        const fineAmount = Number(tx.fine || tx.fineAmount || 0);
        return {
          id: tx.circulationLogId || index,
          sNo: String(transactionsPage * transactionsPageSize + index + 1).padStart(2, '0'),
          bookTitle: tx.bookTitle || "-",
          rfid: tx.rfid || "-",
          checkOutDate: tx.checkOutDate || "-",
          dueDate: tx.dueDate || "-",
          checkInDate: tx.checkInDate || "-",
          renewedDate: tx.renewedDate || "-",
          renewalCount: renewCurrent,
          maxRenewals: renewMax,
          overdueDays: Number(tx.overdueDays || 0),
          fine: fineAmount > 0 ? `₹ ${fineAmount}` : "₹ 0",
          status: tx.status || "-",
        };
      }),
    }
  } : transactionsResponse;

  const transactionColumns = [
    { key: 'sNo', label: 'S.No', sortable: false, render: (record, index) => String(index + 1 + transactionsPage * transactionsPageSize).padStart(2, '0') },
    {
      key: 'bookDetails',
      label: 'Book Details',
      sortable: false,
      render: (record) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{record.bookTitle}</span>
          <span className="text-xs text-gray-500">{record.rfid}</span>
        </div>
      ),
    },
    { key: 'checkOutDate', label: 'Check-Out Date', sortable: false },
    { key: 'dueDate', label: 'Due Date', sortable: false },
    { key: 'checkInDate', label: 'Check-In Date', sortable: false },
    { key: 'renewedDate', label: 'Renewed Date', sortable: false },
    {
      key: 'renewalCount',
      label: 'Renewal Count',
      sortable: false,
      render: (record) => (
        <span className={`font-medium ${record.renewalCount >= record.maxRenewals ? 'text-red-600' : 'text-gray-900'}`}>
          {record.renewalCount}/{record.maxRenewals}
        </span>
      ),
    },
    {
      key: 'overdueDays',
      label: 'Overdue Days',
      sortable: false,
      render: (record) => (
        <span className={`font-medium ${record.overdueDays > 0 ? 'text-red-600' : 'text-gray-900'}`}>
          {String(record.overdueDays).padStart(2, '0')}
        </span>
      ),
    },
    {
      key: 'fine',
      label: 'Fine',
      sortable: false,
      render: (record) => (
        <span className={`font-medium ${record.fine !== '$0' ? 'text-red-600' : 'text-gray-900'}`}>
          {record.fine}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: false,
      render: (record) => (
        <span className={`inline-flex px-2.5 py-1 w-24 justify-center text-xs font-medium rounded-sm ${getTransactionStatusClass(record.status)}`}>
          {record.status}
        </span>
      ),
    },
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div>
        <div className="flex items-center gap-2 sm:gap-3 border-b border-gray-200 -mx-4 px-2 sm:px-4 py-2">
          <ArrowLeft
            className="h-5 w-5 flex-shrink-0 cursor-pointer text-gray-600 hover:text-gray-900"
            onClick={() => router.push('/users')}
          />
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
            <ImageWidget src={displayImageUrl} alt={user.userName} className="w-full h-full object-cover rounded-md" />
          </div>
          <div className="flex flex-col min-w-0 gap-0.5 flex-1">
            <div className="flex items-center gap-2 sm:gap-4 md:gap-40 flex-wrap">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{user.userName}</h2>
              <span className={`inline-flex px-3 sm:px-4 py-1 text-xs font-medium rounded-sm flex-shrink-0 ${getUserStatusColor(user.statusType)}`}>
                {user.status}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs sm:text-sm text-[#62748E]">
              <span className="truncate">{user.libraryCardId}</span>
              <span className="select-none hidden sm:inline">|</span>
              <span className="hidden sm:inline">Joined : {user.joinedDate}</span>
              <span className="sm:hidden">{user.joinedDate}</span>
            </div>
          </div>
        </div>

        <UserDetailsNavigation
          currentPage={activeTab}
          onTabChange={setActiveTab}
          onSendPasswordReset={handleSendPasswordReset}
          transactionsSearch={transactionsSearch}
          onTransactionsSearch={handleTransactionsSearch}
          transactionDateRange={transactionPickerInitialRange}
          transactionDateType={initialDateType}
          onTransactionDateChange={handleTransactionDateFilterChange}
        />
        <SuccessPopupWidget
          isOpen={isPasswordResetSuccessOpen}
          onOpenChange={setIsPasswordResetSuccessOpen}
          icon={<Send className="w-4 h-4" strokeWidth={1.5} />}
          title="Password Reset link"
          subtitle="Shared Successfully"
        />
        <SuccessPopupWidget
          isOpen={isPrintCardSuccessOpen}
          onOpenChange={setIsPrintCardSuccessOpen}
          icon={<CircleCheck className="w-8 h-8" strokeWidth={1.5} />}
          title="User ID Card Printed"
          subtitle="Successfully"
        />


        {activeTab === 'user-details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.25fr_2fr_1fr_1.2fr] gap-6 mt-3">
            <div className="space-y-4 xl:col-span-1">
              <div className="bg-white border border-gray-200 rounded-md p-3 pb-16 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Profile Picture</h3>
                <div className="flex flex-col items-start">
                  <input
                    ref={profileImageInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.svg,image/jpeg,image/png,image/svg+xml"
                    className="hidden"
                    onChange={handleProfileImageChange}
                  />
                  <div className="w-28 h-28 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    <ImageWidget src={displayImageUrl} alt={user.userName} className="w-full h-full object-cover rounded-md" />
                  </div>
                  {canEdit("Users") && (
                    <button
                      type="button"
                      onClick={triggerProfileImageSelect}
                      className="mt-3 p-2 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-600"
                      title={user.profileImage || profileImageUrl ? 'Edit' : 'Upload'}
                    >
                      {user.profileImage || profileImageUrl ? <SquarePen className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                    </button>
                  )}
                  <p className="text-xs text-gray-500 mt-2 whitespace-nowrap">Only support .jpg, .png and .svg</p>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-md p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">Status</span>
                  <Switch
                    checked={isStatusActive}
                    onCheckedChange={handleStatusToggle}
                    disabled={isStatusChangePending || !canEdit("Users")}
                    className="data-[state=checked]:bg-[#00796B] data-[state=unchecked]:bg-gray-300"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 xl:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                <div className="flex items-center mb-4 gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">User Details</h3>
                  {canEdit("Users") && (
                    <button
                      type="button"
                      className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 border border-gray-200"
                      title="Edit"
                      onClick={() => setIsUserDetailsEditing(true)}
                    >
                      <SquarePen className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <FormInput
                    name="name"
                    control={control}
                    label="Name"
                    required
                    disabled={!isUserDetailsEditing}
                    className="bg-white border border-[#D9D9D9] min-h-[44px] rounded-sm px-4 focus-visible:border-[#00796B] focus-visible:ring-[#00796B]"
                  />
                  <FormInput
                    name="email"
                    control={control}
                    label="Email"
                    type="email"
                    required
                    disabled={!isUserDetailsEditing}
                    className="bg-white border border-[#D9D9D9] min-h-[44px] rounded-sm px-4 focus-visible:border-[#00796B] focus-visible:ring-[#00796B]"
                  />
                  <FormInput
                    name="mobile"
                    control={control}
                    label="Mobile No"
                    required
                    disabled={!isUserDetailsEditing}
                    className="bg-white border border-[#D9D9D9] min-h-[44px] rounded-sm px-4 focus-visible:border-[#00796B] focus-visible:ring-[#00796B]"
                  />
                  <FormSelect
                    name="policy"
                    control={control}
                    label="Policy"
                    options={policyOptions}
                    required
                    disabled={!isUserDetailsEditing}
                    className="bg-white border border-[#D9D9D9] min-h-[44px] rounded-sm"
                  />
                </div>
                {isUserDetailsEditing && (
                  <div className="flex items-center gap-3 w-full pt-4 border-t border-gray-200">
                    <ButtonWidget
                      type="button"
                      loader={false}
                      className="flex-1 h-10 px-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={handleCancelUserDetails}
                    >
                      Cancel
                    </ButtonWidget>
                    <ButtonWidget
                      type="submit"
                      disabled={isEditingActive}
                      loader={isEditingActive}
                      className="flex-1 h-10 px-2 rounded-md bg-[#00796B] text-white hover:bg-[#00695C]"
                      onClick={handleSubmit(onSubmitEditUser)}
                    >
                      {isEditingActive ? "Saving..." : "Save"}
                    </ButtonWidget>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 md:col-span-2 xl:col-span-1 xl:col-start-4">
              <div ref={printCardRef} className="bg-gradient-to-br from-[#2196F3] to-[#4CAF50] rounded-xl p-6 text-white shadow-lg min-h-[280px] flex flex-col">
                <div className="mb-2">
                  <p className="text-xs font-medium tracking-widest opacity-90">LIBRARY CARD</p>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{user.userName}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 flex-shrink-0 opacity-90" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 flex-shrink-0 opacity-90" />
                    <span>{user.phone}</span>
                  </div>
                </div>
                <div className="mt-auto pt-4">
                  <div className="bg-white rounded-lg px-3 py-4 text-gray-900">
                    <p className="text-xs font-medium text-center text-gray-600 mb-2">User ID</p>
                    <LibraryCardBarcode />
                    <p className="text-sm font-semibold text-center mt-2">{user.userId}</p>
                  </div>
                </div>
              </div>
              <ButtonWidget
                className="w-full h-10 rounded-md bg-white border border-[#00796B] hover:bg-gray-50 text-gray-700 flex items-center justify-center gap-2"
                onClick={handlePrintCard}
                loader={false}
              >
                <Printer className="w-4 h-4 text-[#00796B]" />
                Print Card
              </ButtonWidget>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && canViewTransactions && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-gray-600">
              {mappedTransactionsResponse?.data?.totalElements || 0} Records found
            </p>
            <TableWidget
              columns={transactionColumns}
              response={mappedTransactionsResponse}
              handleSort={handleTransactionsSort}
              getSortIcon={getTransactionsSortIcon}
              searchTerm={transactionsSearch}
              currentPage={transactionsPage}
              itemsPerPage={transactionsPageSize}
              handlePageChange={handleTransactionsPageChange}
              height="h-[calc(80vh-230px)]"
            />
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default UserDetailsSection;
