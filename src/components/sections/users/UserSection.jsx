"use client";

import userImage from '@/assets/image/user.png';
import useURLParams from "@/components/custom-hooks/useURLParams";
import PageLayout from '@/components/layouts/PageLayout';
import ButtonWidget from '@/components/widgets/ButtonWidget';
import ImageWidget from '@/components/widgets/ImageWidget';
import SearchWidget from '@/components/widgets/SearchWidget';
import TitleWidget from '@/components/widgets/TitleWidget';
import SelectableExpandableTableWidget from '@/components/widgets/SelectableExpandableTableWidget';
import { getUserStatusColor } from '@/helpers/FuntionalHelpers';
import { Plus, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek } from 'date-fns';
import UserDialog from './utils/userFormDialog';
import DateRangePicker from '@/components/widgets/DateRangePicker';
import UserStatusFilter from './utils/UserStatusFilter';

const formatJoiningDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (!Number.isNaN(d.getTime())) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
  return String(dateStr).replace(/\//g, '-');
};

const mapApiStatusToDisplay = (status) => {
  const s = (status || '').toString().toUpperCase();
  if (s === 'ACTIVE') return { label: 'Active', statusType: 'Active' };
  if (s === 'INACTIVE') return { label: 'Inactive', statusType: 'Inactive' };
  return { label: status || '—', statusType: status || '' };
};

/** Same pattern as book details: `books-image/${bookImageUrl}` → `users-image/${profileImgUrl}`. */
const userDisplayImageUrl = (profileImgUrl) =>
  profileImgUrl
    ? `https://libraryapi.corpfield.com/profile-image/${profileImgUrl}`
    : userImage;

/** URL `type`: 1 = Today, 2 = This Week, 3 = This Month, 4 = Custom Range */
const parseDateFilterType = (v) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n >= 1 && n <= 4 ? n : null;
};

const dateRangeFromFilterType = (typeNum) => {
  const today = new Date();
  if (typeNum === 1) return { from: startOfDay(today), to: endOfDay(today) };
  if (typeNum === 2) return { from: startOfWeek(today, { weekStartsOn: 0 }), to: endOfWeek(today, { weekStartsOn: 0 }) };
  if (typeNum === 3) return { from: startOfMonth(today), to: endOfMonth(today) };
  return null;
};

const UserSection = ({ response: apiResponse, policyDropdown }) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const breadcrumbs = [
    { label: 'Users', href: '/users' },
  ];
  const {
    page: currentPage,
    size: itemsPerPage,
    search: searchTerm,
    fromDate,
    toDate,
    dateFilterType,
    handlePageChange,
    handleSearch,
    handleSort,
    getSortIcon,
    updateURL,
  } = useURLParams({
    defaultColumns: [
      "sno",
      "userId",
      "joinedDate",
      "userName",
      "email",
      "policy",
      "bookIssuedCount",
      "status",
    ],
    additionalParams: {
      dateFilterType: {
        paramName: "type",
        defaultValue: "",
      },
      fromDate: {
        paramName: "startDate",
        defaultValue: "",
      },
      toDate: {
        paramName: "endDate",
        defaultValue: "",
      },
      status: {
        paramName: "status",
        defaultValue: "",
      },
    },
  });

  const initialDateType = parseDateFilterType(dateFilterType);

  const userPickerInitialRange = useMemo(() => {
    if (fromDate && toDate) {
      return { from: new Date(fromDate), to: new Date(toDate) };
    }
    if (initialDateType === 1 || initialDateType === 2 || initialDateType === 3) {
      return dateRangeFromFilterType(initialDateType);
    }
    return null;
  }, [fromDate, toDate, initialDateType]);

  const handleUserDateFilterChange = (dateRange, meta = {}) => {
    if (dateRange === null) {
      updateURL({
        page: 0,
        fromDate: "",
        toDate: "",
        dateFilterType: "",
      });
      return;
    }
    if (dateRange?.from && dateRange.to) {
      const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
      };
      updateURL({
        page: 0,
        fromDate: formatDate(dateRange.from),
        toDate: formatDate(dateRange.to),
        dateFilterType: meta.dateType != null ? String(meta.dateType) : "4",
      });
    }
  };

  const pageData = apiResponse?.data;
  const mappedResponse = pageData?.content != null ? {
    data: {
      ...pageData,
      pageSize: pageData.size ?? pageData.pageSize,
      content: pageData.content.map((item, index) => {
        const { label: statusLabel, statusType } = mapApiStatusToDisplay(item.status);
        return {
          id: item.internalUserId,
          internalUserId: item.internalUserId,
          userId: item.userId,
          userName: item.userName,
          email: item.email,
          phone: item.phoneNumber,
          policy: item.policyType,
          joinedDate: item.joinedDate,
          joinedDateDisplay: formatJoiningDate(item.joinedDate),
          bookIssuedCount: item.bookIssuedCount ?? 0,
          status: statusLabel,
          statusType,
          displayImageUrl: userDisplayImageUrl(item.profileImgUrl),
        };
      }),
    },
  } : apiResponse;

  const handleEditClick = (id) => {
    setEditingId(id);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const handleDialogOpenChange = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingId(null);
    }
  };

  const defaultColumns = [
    {
      key: "sno",
      label: "S.No",
      sortable: false,
      render: (record, index) => (
        <div className="flex items-center gap-2 pl-2">
          <span>{String(currentPage * itemsPerPage + index + 1).padStart(2, '0')}</span>
        </div>
      ),
      headerRender: () => (
        <div className="flex items-center gap-2 pl-2">
          <span>S.No</span>
        </div>
      ),
    },
    {
      key: "userId",
      label: "User ID",
      sortable: true,
    },
    {
      key: "joinedDate",
      label: "Joining Date",
      sortable: true,
      render: (record) => record.joinedDateDisplay,
    },
    {
      key: "userName",
      label: "User Name",
      sortable: true,
      render: (record) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
            <ImageWidget
              src={record.displayImageUrl}
              alt={record.userName}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          <span className="text-sm text-gray-900">{record.userName}</span>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email ID",
      sortable: true,
      render: (record) => <span className="text-sm text-gray-700">{record.email}</span>,
    },
    {
      key: "policyType",
      label: "Policy",
      sortable: true,
      render: (record) => <span className="text-sm text-gray-700">{record.policy}</span>,
    },
    {
      key: "bookIssuedCount",
      label: "Books issued",
      sortable: true,
      render: (record) => (
        <span className="text-sm text-gray-900">{record.bookIssuedCount}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (record) => (
        <span className={`inline-flex px-2.5 py-1 w-20 justify-center text-xs font-medium rounded-sm ${getUserStatusColor(record.statusType)}`}>
          {record.status}
        </span>
      ),
    },
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 mb-4 py-2 border-b -mx-4 px-4">
        <TitleWidget
          title="Users"
        />
        <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 flex-wrap">
            <SearchWidget
              placeholder="Search by User ID"
              value={searchTerm}
              onSearch={handleSearch}
              className="w-full sm:w-60 rounded-[14px]!"
            />
            <DateRangePicker
              onDateRangeChange={handleUserDateFilterChange}
              initialDateRange={userPickerInitialRange}
              initialDateType={initialDateType}
              includeDateTypeOnApply
              trigger={
                <ButtonWidget
                  type="button"
                  className="h-9 px-3 rounded-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-[#00796B]" />
                  Date
                </ButtonWidget>
              }
            />
            <UserStatusFilter />
            <ButtonWidget
              onClick={handleAddNew}
              className="h-9 px-3 rounded-sm bg-[#00796B] hover:bg-[#00796B]/90 text-white border-0 shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-white" />
              Add User
            </ButtonWidget>
            <UserDialog
              isOpen={isDialogOpen}
              onOpenChange={handleDialogOpenChange}
              id={editingId}
              policyDropdown={policyDropdown}
            />
          </div>
        </div>
      </div>

      <SelectableExpandableTableWidget
        columns={defaultColumns}
        response={mappedResponse}
        handleSort={handleSort}
        getSortIcon={getSortIcon}
        searchTerm={searchTerm}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        handlePageChange={handlePageChange}
        getRowId={(record) => record.id}
        noDataTitle="No users found"
        noDataDescription="No users have been added yet."
        noDataIcon="user"
        showNoDataAction={true}
        noDataActionText="Add User"
        onNoDataAction={handleAddNew}
        checkboxColumnKey="sno"
        onSelectionChange={setSelectedRows}
        onRowClick={(record) => router.push(`/users/${record.id}`)}
      />
    </PageLayout>
  );
};

export default UserSection;
