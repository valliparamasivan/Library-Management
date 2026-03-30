import ImageWidget from "@/components/widgets/ImageWidget";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { User, CalendarDays, RefreshCw, CircleArrowRight, Shield } from "lucide-react";
import user from '@/assets/image/user.png'

const UserCard = ({ 
  rfid,
  loggedStaff,
  policyName,
  issuedDate,
  dueDate,
  userDetails,
  status,
  onRenew,
  onReturn
}) => {
  const defaultUserDetails = {
    name: userDetails?.name || "Mark Smith",
    email: userDetails?.email || "marksmith@gmail.com",
    phone: userDetails?.phone || "856 856 8569",
  };

  return (
    <div className="bg-white rounded-xl p-3 md:p-5 shadow-sm border border-gray-200 relative">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 mb-4 md:mb-6 pb-3 md:pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-xs md:text-sm text-gray-600">RFID {rfid || "AHW2542B00124"}</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-3 h-3 md:w-4 md:h-4 text-[#00796B]" />
          <span className="text-xs md:text-sm text-gray-600">Logged Staff {loggedStaff || "Mark Smith"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-3 h-3 md:w-4 md:h-4 text-[#00796B]" />
          <span className="text-xs md:text-sm text-gray-600 break-words">Policy Details Policy Name: {policyName || "Student Policy"}</span>
        </div>
      </div>    
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-3 h-3 md:w-4 md:h-4 text-[#00796B]" />
            <div className="text-xs md:text-sm">
              <span className="text-gray-600">Issued - </span>
              <span className="text-gray-900 font-semibold">{issuedDate || "05/11/2025"}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-3 h-3 md:w-4 md:h-4 text-[#00796B]" />
            <div className="text-xs md:text-sm">
              <span className="text-gray-600">Due Date - </span>
              <span className="text-gray-900 font-semibold">{dueDate || "05/11/2025"}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2 md:mb-3">
            <User className="w-3 h-3 md:w-4 md:h-4 text-[#00796B]" />
            <span className="text-xs md:text-sm text-gray-600">User Details</span>
          </div>
          <div className="flex items-start gap-3 md:gap-4">
            <ImageWidget
              src={user}
              alt={defaultUserDetails.name}
              className="h-12 w-12 md:h-16 md:w-16 rounded-lg flex-shrink-0"
            />
            <div className="flex flex-col gap-1">
              <h3 className="text-sm md:text-base font-semibold text-gray-900">{defaultUserDetails.name}</h3>
              <p className="text-xs md:text-sm text-gray-600 break-words">Email ID: {defaultUserDetails.email}</p>
              <p className="text-xs md:text-sm text-gray-600">Phone No: {defaultUserDetails.phone}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-3 md:gap-4">
          <div className={`px-3 md:px-4 py-2 rounded-lg w-fit ${status?.className || "bg-[#9CCC6533] text-[#00796B]"}`}>
            <span className="text-xs md:text-sm font-medium">{status?.text || "Status - 12 Days left"}</span>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <ButtonWidget 
              onClick={onRenew}
              className="px-3 md:px-4 py-2 bg-[#FFFFFF] border border-[#00796B] text-[#00796B] hover:bg-green-200 rounded-sm text-xs md:text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <RefreshCw className="w-3 h-3 md:w-4 md:h-4" />
              Renew
            </ButtonWidget>
            <ButtonWidget
              onClick={onReturn}
              className="px-3 md:px-4 py-2 bg-[#00796B] hover:bg-[#00796B]/90 text-white rounded-sm text-xs md:text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <CircleArrowRight className="w-3 h-3 md:w-4 md:h-4" />
              Return
            </ButtonWidget>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
