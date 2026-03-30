import { Barcode, Check, FileText, Package, RotateCcw, Settings, User, UserMinus, UserPlus, Wrench, X } from "lucide-react";

export const getDeviceImage = (deviceType) => {
  switch (deviceType?.toLowerCase()) {
    case "person":
      return "👤";
    case "macbook":
      return "💻";
    case "laptop":
      return "💻";
    case "monitor":
      return "🖥️";
    case "mobile":
      return "📱";
    case "tablet":
      return "📱";
    case "phone":
      return "☎️";
    case "desktop":
      return "🖥️";
    case "server":
      return "🖥️";
    case "printer":
      return "🖨️";
    case "scanner":
      return "📄";
    case "keyboard":
      return "⌨️";
    case "mouse":
      return "🖱️";
    case "headphones":
      return "🎧";
    case "camera":
      return "📷";
    case "router":
      return "📡";
    case "switch":
      return "🔌";
    case "accessory":
      return "🔧";
    default:
      return "💻";
  }
};

export const getDeviceColor = (deviceType) => {
  switch (deviceType?.toLowerCase()) {
    case "person":
      return "text-blue-600";
    case "macbook":
    case "laptop":
      return "text-gray-600";
    case "monitor":
    case "desktop":
      return "text-blue-500";
    case "mobile":
    case "tablet":
      return "text-green-600";
    case "phone":
      return "text-purple-600";
    case "server":
      return "text-red-600";
    case "printer":
      return "text-orange-600";
    case "accessory":
      return "text-yellow-600";
    default:
      return "text-gray-600";
  }
};

export const getDeviceTypeName = (deviceType) => {
  switch (deviceType?.toLowerCase()) {
    case "person":
      return "Person";
    case "macbook":
      return "MacBook";
    case "laptop":
      return "Laptop";
    case "monitor":
      return "Monitor";
    case "mobile":
      return "Mobile Phone";
    case "tablet":
      return "Tablet";
    case "phone":
      return "Phone";
    case "desktop":
      return "Desktop";
    case "server":
      return "Server";
    case "printer":
      return "Printer";
    case "scanner":
      return "Scanner";
    case "keyboard":
      return "Keyboard";
    case "mouse":
      return "Mouse";
    case "headphones":
      return "Headphones";
    case "camera":
      return "Camera";
    case "router":
      return "Router";
    case "switch":
      return "Switch";
    case "accessory":
      return "Accessory";
    default:
      return "Device";
  }
};

export const getActionIcon = (action, type) => {
  switch (action) {
    case "checkout":
    case "checkin from":
      return <RotateCcw className="w-4 h-4 text-blue-600" />;
    case "update":
      return <Settings className="w-4 h-4 text-orange-600" />;
    case "delete":
      return <UserMinus className="w-4 h-4 text-red-600" />;
    case "create new":
      return <UserPlus className="w-4 h-4 text-green-600" />;
    default:
      return <User className="w-4 h-4 text-gray-600" />;
  }
};

export const getTypeIcon = (type) => {
  switch (type) {
    case "asset":
      return <Barcode className="w-4 h-4 text-blue-600" />;
    case "user":
      return <User className="w-4 h-4 text-green-600" />;
    case "license":
      return <FileText className="w-4 h-4 text-purple-600" />;
    default:
      return <Package className="w-4 h-4 text-gray-600" />;
  }
};

export const getCheckInOutColors = (toCheckIn) => {
  return toCheckIn ? "bg-[#B0EDAC] text-[#4D5959]" : "bg-[#FDC8B5] text-[#4D5959]";
};

export const getStatusLabelsInstructionContent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="border border-green-200 rounded-lg p-3 bg-green-50">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="font-semibold text-green-800">Deployable</span>
        </div>
        <p className="text-sm text-green-700">
          These assets can be checked out. Once they are assigned, they will assume a meta status of{" "}
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
            <strong>Deployed</strong>
          </span>
          .
        </p>
      </div>

      <div className="border border-orange-200 rounded-lg p-3 bg-orange-50">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className="font-semibold text-orange-800">Pending</span>
        </div>
        <p className="text-sm text-orange-700">
          These assets can not yet be assigned to anyone, often used for items that are out for repair, but are expected to return to circulation.
        </p>
      </div>

      <div className="border border-red-200 rounded-lg p-3 bg-red-50">
        <div className="flex items-center gap-2 mb-2">
          <X className="w-3 h-3 text-red-500" />
          <span className="font-semibold text-red-800">Undeployable</span>
        </div>
        <p className="text-sm text-red-700">These assets cannot be assigned to anyone.</p>
      </div>

      <div className="border border-red-200 rounded-lg p-3 bg-red-50">
        <div className="flex items-center gap-2 mb-2">
          <X className="w-3 h-3 text-red-500" />
          <span className="font-semibold text-red-800">Archived</span>
        </div>
        <p className="text-sm text-red-700">
          These assets cannot be checked out, and will only show up in the Archived view. This is useful for retaining information about assets for budgeting/historic purposes but
          keeping them out of the day-to-day asset list.
        </p>
      </div>
    </div>
  );
};

export const getInstructionContentWithLink = (description, linkText, onLinkClick, additionalText = "") => {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-700">{description}</p>
      <p className="text-sm text-gray-700">
        {additionalText}{" "}
        <button onClick={onLinkClick} className="text-blue-600 hover:text-blue-800 underline cursor-pointer">
          {linkText}
        </button>
        .
      </p>
    </div>
  );
};

export const getImportInstructionContent = (onDownloadClick) => {
  return getInstructionContentWithLink(
    "You can import assets, accessories, licenses, components, consumables, and users via CSV file.",
    "sample CSVs in the documentation",
    onDownloadClick,
    "The CSV should be comma-delimited and formatted with headers that match the ones in the",
  );
};

export const getStatusIcon = (status) => {
  switch (status) {
    case "Completed":
      return <Check className="w-4 h-4 text-green-500" />;
    case "In Progress":
      return <Wrench className="w-4 h-4 text-blue-500" />;
    case "Scheduled":
      return <X className="w-4 h-4 text-yellow-500" />;
    default:
      return <X className="w-4 h-4 text-gray-500" />;
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800";
    case "In Progress":
      return "bg-blue-100 text-blue-800";
    case "Scheduled":
      return "bg-yellow-100 text-yellow-800";
    case "Tagged":
      return "bg-[#4CAF5033] text-[#4CAF50]";
    case "Untagged":
      return "bg-[#F4433633] text-[#F44336]";
    case "Printed Unmapped":
      return "bg-[#E77B3333] text-[#E77B33]";
    case "Available":
      return "bg-[#9CCC65] text-black";
    case "Not Available":
      return "bg-[#E57373] text-white";
    case "Due":
      return "bg-[#9CCC6533] text-[#00796B]";
    case "Reserved":
      return "bg-[#007BFF33] text-[#007BFF]";
    case "Near Due":
      return "bg-[#FF980026] text-[#FF9800]";
    case "Renewed":
      return "bg-[#7986CB33] text-[#7986CB]";
    case "Overdue":
      return "bg-[#F4433633] text-[#F44336]";
    case "Book Issued":
      return "bg-[#9CCC6533] text-[#00796B]";
    case "Active":
      return "bg-[#4CAF5033] text-[#4CAF50]";
    case "Inactive":
      return "bg-[#F4433633] text-[#F44336]";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getActionTypeColor = (actionType) => {
  switch (actionType) {
    case "Returned":
      return "bg-[#A0D07C] text-white";
    case "Renewed":
      return "bg-[#26A69A] text-white";
    case "Book Issued":
      return "bg-[#EEBA1C] text-white";
    case "Reserved":
      return "bg-[#1C8FF0] text-white";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getWarrantyColor = (warranty) => {
  return warranty === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
};

export const getLoanActionTypeColor = (actionType) => {
  switch (actionType) {
    case "Checked-in":
    case "Checked-In":
    case "On-Time":
      return "bg-[#4CAF5033] text-[#4CAF50]";
    case "Checked-out":
    case "Checked-Out":
      return "bg-[#E77B3333] text-[#E77B33]";
    case "Returned":
      return "bg-[#FF980033] text-[#FF9800]";
    case "Renewed":
      return "bg-[#900AEF33] text-[#900AEF]";
    case "Book Issued":
      return "bg-[#E77B3333] text-[#E77B33]";
    case "Reserved":
      return "bg-[#4CAF5033] text-[#4CAF50]";
    case "Overdue":
      return "bg-[#F4433633] text-[#F44336]";
    case "Near Due":
      return "bg-[#FFC10733] text-[#FFC107]";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getActivityActionColor = (actionType) => {
  switch (actionType) {
    case "RFID Tagged":
      return "bg-[#9CCC6533] text-[#00796B]";
    case "Edited":
      return "bg-[#007BFF33] text-[#007BFF]";
    case "RFID Not Tagged":
      return "bg-[#FF980026] text-[#FF9800]";
    case "Deleted":
      return "bg-[#F4433633] text-[#F44336]";
    case "Book Created":
      return "bg-[#9CCC6533] text-[#9CCC65]";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getUserStatusColor = (status) => {
  switch (status) {
    case "Active":
      return "bg-[#4CAF5033] text-[#4CAF50]";
    case "Inactive":
      return "bg-[#F4433633] text-[#F44336]";
    case "Returned":
      return "bg-[#FF980033] text-[#FF9800]";
    case "Renewed":
      return "bg-[#900AEF33] text-[#900AEF]";
    case "Book Issued":
      return "bg-[#E77B3333] text-[#E77B33]";
    case "Reserved":
      return "bg-[#4CAF5033] text-[#4CAF50]";
    case "Overdue":
      return "bg-[#F4433633] text-[#F44336]";
    default:
      return "bg-gray-100 text-gray-800";
  }
};