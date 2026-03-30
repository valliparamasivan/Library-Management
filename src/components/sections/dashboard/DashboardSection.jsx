"use client";

import FormSelect from "@/components/form/FormSelect";
import PageLayout from "@/components/layouts/PageLayout";
import LinkWidget from "@/components/widgets/LinkWidget";
import {
  ArrowRight,
  ArrowUpDown,
  Book,
  User,
  Upload,
  LogOut,
  RotateCw
} from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { useForm } from "react-hook-form";
import InventoryDialog from "../inventory/utils/InventoryDialog";
import UserDialog from "../users/utils/userFormDialog";

const InventoryOverviewSection = () => {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <Book className="w-4 h-4 sm:w-5 sm:h-5 text-[#00796B]" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900">Inventory Overview</h3>
        </div>
        <LinkWidget href="/inventory" className="text-xs sm:text-sm text-[#00796B] underline hover:text-[#00796B]/80 font-medium inline-flex items-center gap-1">
          View all
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </LinkWidget>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-gray-100 rounded-lg p-3 sm:p-4">
          <p className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">1,569</p>
          <p className="text-xs sm:text-sm text-gray-700">Total Books</p>
        </div>
        <div className="bg-[#D0FAE5] rounded-lg p-3 sm:p-4">
          <p className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">1,420</p>
          <p className="text-xs sm:text-sm text-gray-700">RFID Tagged</p>
        </div>
        <div className="bg-[#FBE6D9] rounded-lg p-3 sm:p-4">
          <p className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">149</p>
          <p className="text-xs sm:text-sm text-gray-700">Untagged</p>
        </div>
      </div>
    </div>
  );
};

const UsersOverviewSection = () => {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#00796B]" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900">Users Overview</h3>
        </div>
        <LinkWidget href="/users" className="text-xs sm:text-sm text-[#00796B] underline hover:text-[#00796B]/80 font-medium inline-flex items-center gap-1">
          View all
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </LinkWidget>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-gray-100 rounded-lg p-3 sm:p-4">
          <p className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">847</p>
          <p className="text-xs sm:text-sm text-gray-700">Total Users</p>
        </div>
        <div className="bg-[#D0FAE5] rounded-lg p-3 sm:p-4">
          <p className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">153</p>
          <p className="text-xs sm:text-sm text-gray-700">Active Users</p>
        </div>
        <div className="bg-[#FBE6D9] rounded-lg p-3 sm:p-4">
          <p className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">24</p>
          <p className="text-xs sm:text-sm text-gray-700">Inactive Users</p>
        </div>
      </div>
    </div>
  );
};

const LoansOverviewSection = ({ control, timeRangeOptions }) => {
  const checkedOut = 1000;
  const checkedIn = 569;
  const totalLoans = checkedOut + checkedIn;
  
  const radius = 50;
  const innerRadius = 35;
  const centerX = 50;
  const centerY = 50;
  
  const greenAngle = 240;
  const orangeAngle = 120;
  
  const checkedInStartAngle = -90;
  const checkedInEndAngle = checkedInStartAngle + greenAngle;
  const checkedOutStartAngle = checkedInEndAngle;
  const checkedOutEndAngle = checkedOutStartAngle + orangeAngle;

  const createArcPath = (startAngle, endAngle, outerRadius, innerRadius) => {
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = centerX + outerRadius * Math.cos(startAngleRad);
    const y1 = centerY + outerRadius * Math.sin(startAngleRad);
    const x2 = centerX + outerRadius * Math.cos(endAngleRad);
    const y2 = centerY + outerRadius * Math.sin(endAngleRad);
    
    const x3 = centerX + innerRadius * Math.cos(endAngleRad);
    const y3 = centerY + innerRadius * Math.sin(endAngleRad);
    const x4 = centerX + innerRadius * Math.cos(startAngleRad);
    const y4 = centerY + innerRadius * Math.sin(startAngleRad);
    
    const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;
    
    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 border">
      <div className="flex flex-row items-center justify-between mb-4 sm:mb-6 gap-1 sm:gap-2 md:gap-4 overflow-hidden">
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 min-w-0 flex-1">
          <ArrowUpDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#00796B] flex-shrink-0" />
          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-gray-900 truncate">Loans Overview</h3>
          <FormSelect
            name="timeRange"
            control={control}
            options={timeRangeOptions}
            placeholder="Today"
            enableSearch={false}
            height="34px"
            className="bg-transparent border border-[#D9D9D9] rounded-sm cursor-pointer py-1 w-[65px] sm:w-[80px] md:w-[100px] flex-shrink-0"
          />
        </div>
        <div className="flex items-center flex-shrink-0">
          <LinkWidget href="/loans" className="text-xs sm:text-sm text-[#00796B] underline hover:text-[#00796B]/80 font-medium inline-flex items-center gap-1 whitespace-nowrap">
            View all
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </LinkWidget>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="w-full flex justify-center">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <path
                d={createArcPath(checkedInStartAngle, checkedInEndAngle, radius, innerRadius)}
                fill="#4CAF50"
                stroke="white"
                strokeWidth="0.5"
              />
              <path
                d={createArcPath(checkedOutStartAngle, checkedOutEndAngle, radius, innerRadius)}
                fill="#FF9800"
                stroke="white"
                strokeWidth="0.5"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-xs sm:text-sm text-gray-600">Total Loans</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalLoans.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-[#FBE6D9] rounded-lg p-4 sm:p-5 border border-gray-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#E77B331A] flex items-center justify-center flex-shrink-0">
                <RotateCw className="w-5 h-5 sm:w-6 sm:h-6 text-[#E77B33]" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-semibold pb-1 text-gray-900">{checkedOut.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-gray-700">Checked Out</p>
              </div>
            </div>
            <div className="border-t border-gray-300 pt-3 sm:pt-4 mt-3 sm:mt-4 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Active Loans</span>
                <span className="font-semibold text-gray-900">810</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Overdue Loans</span>
                <span className="font-semibold text-gray-900">190</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Outstanding Fine</span>
                <span className="font-semibold text-gray-900">₹12,450</span>
              </div>
            </div>
          </div>
          
          <div className="bg-[#D0FAE5] rounded-lg p-4 sm:p-5 border border-gray-200">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 pb-1 rounded-lg bg-[#00A63E1A] flex items-center justify-center flex-shrink-0">
                <ArrowUpDown className="w-5 h-5 sm:w-6 sm:h-6 text-[#00A63E]" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900">{checkedIn.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-gray-700">Checked In</p>
              </div>
            </div>
            <div className="border-t border-gray-300 pt-3 sm:pt-4 mt-3 sm:mt-4 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">On Time Return</span>
                <span className="font-semibold text-gray-900">500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Late Return</span>
                <span className="font-semibold text-gray-900">69</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Fine Collected</span>
                <span className="font-semibold text-gray-900">₹8,920</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  };

const QuickActionsSection = ({ handleAddNew, handleAddUser, handleIssueBook, handleExportReport }) => {
  const quickActions = [
    { label: "Add New Book", icon: Book, bgColor: "bg-[#00796B1A]", iconColor: "text-[#00796B]", action: handleAddNew },
    { label: "Add New User", icon: User, bgColor: "bg-[#DBEAFE]", iconColor: "text-[#155DFC]", action: handleAddUser },
    { label: "Check Out Book", icon: LogOut, bgColor: "bg-[#E77B331A]", iconColor: "text-[#E77B33]", action: handleIssueBook },
    { label: "Export Report", icon: Upload, bgColor: "bg-[#00796B1A]", iconColor: "text-[#00796B]", action: handleExportReport },
  ];

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 border mb-4 sm:mb-6">
      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.action}
              className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 hover:opacity-80 transition-opacity flex items-center gap-3 sm:gap-4 cursor-pointer w-full shadow-sm min-h-[70px] sm:min-h-[80px]"
            >
              <div className={`${action.bgColor} rounded-lg p-2.5 sm:p-3 flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${action.iconColor}`} />
              </div>
              <span className="text-sm sm:text-base font-medium text-gray-900">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const DashboardSection = () => {
  const router = useRouter();
  const breadcrumbs = [{ label: "Dashboard" }];
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const { control } = useForm({
    defaultValues: {
      timeRange: "today",
    },
  });

  const handleAddNew = () => {
    setIsDialogOpen(true);
  };

  const handleAddUser = () => {
    setIsUserDialogOpen(true);
  };

  const handleIssueBook = () => {
    router.push("/circulation");
  };

  const handleExportReport = () => {
    router.push("/reports/user");
  };

  const handleDialogOpenChange = (open) => {
    setIsDialogOpen(open);
  };

  const handleUserDialogOpenChange = (open) => {
    setIsUserDialogOpen(open);
  };

  const timeRangeOptions = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
    { label: "This Year", value: "year" },
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs} noPadding={true}>
      <div className="overflow-auto relative h-[calc(100vh-57px)] p-3 sm:p-4 md:p-6 bg-gray-100">
        <div className="space-y-4 sm:space-y-6">
          <QuickActionsSection
            handleAddNew={handleAddNew}
            handleAddUser={handleAddUser}
            handleIssueBook={handleIssueBook}
            handleExportReport={handleExportReport}
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="lg:col-span-2">
              <LoansOverviewSection
                control={control}
                timeRangeOptions={timeRangeOptions}
              />
            </div>
            
            <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6">
              <InventoryOverviewSection />
              <UsersOverviewSection />
            </div>
          </div>

          <UserDialog isOpen={isUserDialogOpen} onOpenChange={handleUserDialogOpenChange} />
          <InventoryDialog
            isOpen={isDialogOpen}
            onOpenChange={handleDialogOpenChange}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default DashboardSection;
