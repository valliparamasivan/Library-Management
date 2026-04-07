"use client";

import ButtonWidget from '@/components/widgets/ButtonWidget';
import SearchWidget from '@/components/widgets/SearchWidget';
import { Filter, Send } from 'lucide-react';
import DateRangePicker from '@/components/widgets/DateRangePicker';
import { Calendar } from 'lucide-react';
import UserTransactionFilter from './UserTransactionFilter';
import usePermissions from '@/components/custom-hooks/usePermissions';

const UserDetailsNavigation = ({ currentPage,
  onTabChange,
  onSendPasswordReset,
  transactionsSearch,
  onTransactionsSearch,
  transactionDateRange,
  transactionDateType,
  onTransactionDateChange, }) => {
  const { canView } = usePermissions();
  const tabs = [
    { id: 'user-details', label: 'User Details', canShow: canView('Users') },
    { id: 'transactions', label: 'User Transactions', canShow: canView('User Transactions') },
  ].filter((tab) => tab.canShow);

  const isTransactionsTab = currentPage === 'transactions';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 border-b border-gray-200 pb-2">
      <div className="flex gap-6 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = currentPage === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange?.(tab.id)}
              className={`text-sm font-medium pb-2 border-b-2 transition-colors whitespace-nowrap ${isActive
                  ? 'text-[#00796B] border-[#00796B]'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {isTransactionsTab ? (
        <div className="flex items-center gap-2 flex-1 sm:max-w-md flex-shrink-0">
          <SearchWidget
            placeholder="Search by Book title, RFID..."
            value={transactionsSearch ?? ''}
            onSearch={onTransactionsSearch}
            className="w-full"
            debounceMs={300}
          />

          <DateRangePicker
            onDateRangeChange={onTransactionDateChange}
            initialDateRange={transactionDateRange}
            initialDateType={transactionDateType}
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
          <UserTransactionFilter />
        </div>
      ) : (
        <ButtonWidget
          className="h-9 px-4 rounded-md bg-[#F0FDF4] border border-[#00796B] text-[#2F2F2F] hover:bg-green-50 flex items-center gap-2 text-sm flex-shrink-0"
          onClick={onSendPasswordReset}
        >
          <Send className="w-4 h-4 text-[#00796B]" />
          Send Password Reset Link
        </ButtonWidget>
      )}
    </div>
  );
};

export default UserDetailsNavigation;
