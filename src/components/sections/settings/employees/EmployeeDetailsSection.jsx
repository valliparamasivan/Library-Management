"use client";

import userImage from "@/assets/image/user.png";
import PageLayout from "@/components/layouts/PageLayout";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import ImageWidget from "@/components/widgets/ImageWidget";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect";
import { ArrowLeft, Send, SquarePen, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { getUserStatusColor } from "@/helpers/FuntionalHelpers";
import usePermissions from "@/components/custom-hooks/usePermissions";

const EMPLOYEE_MOCK = {
  1: {
    id: 1,
    employeeId: "LIB12345",
    employeeName: "John dravid",
    email: "johndravid@gmail.com",
    mobile: "+91 98576 98561",
    role: "Librarian",
    status: true,
    statusType: "Active",
    profileImage: null,
  },
  2: {
    id: 2,
    employeeId: "ADMIN12345",
    employeeName: "William josh",
    email: "williamjosh@gmail.com",
    mobile: "+91 98576 98562",
    role: "Admin",
    status: false,
    statusType: "Inactive",
    profileImage: null,
  },
};

const getEmployeeById = (id) => {
  const numId = typeof id === "string" ? parseInt(id, 10) : id;
  return EMPLOYEE_MOCK[numId] || EMPLOYEE_MOCK[1];
};

const roleOptions = [
  { value: "Librarian", label: "Librarian" },
  { value: "Admin", label: "Admin" },
  { value: "Staff", label: "Staff" },
];

const EmployeeDetailsSection = ({ id }) => {
  const router = useRouter();
  const { canAnyEdit } = usePermissions();
  const settingsPerms = ["Settings", "Employees"];
  const employee = getEmployeeById(id);
  const [isStatusActive, setIsStatusActive] = useState(employee.status);
  const [isDetailsEditing, setIsDetailsEditing] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(employee.profileImage || null);
  const profileImageInputRef = useRef(null);

  const breadcrumbs = [
    { label: "Settings", href: "/settings" },
    { label: "Employees", href: "/settings/employees" },
    { label: "Employee Details" },
  ];

  const { control, reset } = useForm({
    defaultValues: {
      employeeName: employee.employeeName,
      email: employee.email,
      mobile: employee.mobile,
      role: employee.role,
    },
  });

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (profileImageUrl) URL.revokeObjectURL(profileImageUrl);
    setProfileImageUrl(URL.createObjectURL(file));
    e.target.value = "";
  };

  const triggerProfileImageSelect = () => profileImageInputRef.current?.click();

  const handleCancelDetails = () => {
    reset({
      employeeName: employee.employeeName,
      email: employee.email,
      mobile: employee.mobile,
      role: employee.role,
    });
    setIsDetailsEditing(false);
  };

  const handleSaveDetails = () => {
    setIsDetailsEditing(false);
  };

  const handleSendPasswordReset = () => {
    // TODO: API call to send password reset link
  };

  const statusLabel = isStatusActive ? "Active" : "Inactive";
  const statusType = isStatusActive ? "Active" : "Inactive";

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div>
        {/* Header: back, avatar, name, ID, badge, Send Password Reset Link */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-200 -mx-4 px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <ArrowLeft
              className="h-5 w-5 flex-shrink-0 cursor-pointer text-gray-600 hover:text-gray-900"
              onClick={() => router.push("/settings/employees")}
            />
            <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
              {profileImageUrl ? (
                <ImageWidget src={profileImageUrl} alt={employee.employeeName} className="w-full h-full object-cover rounded-md" />
              ) : (
                <ImageWidget src={userImage} alt={employee.employeeName} className="w-full h-full object-cover rounded-md" />
              )}
            </div>
            <div className="flex flex-col min-w-0 gap-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-semibold text-gray-900 truncate">{employee.employeeName}</h2>
                <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-md shrink-0 ${getUserStatusColor(statusType)}`}>
                  {statusLabel}
                </span>
              </div>
              <p className="text-sm text-gray-500">{employee.employeeId}</p>
            </div>
          </div>
          <ButtonWidget
            type="button"
            onClick={handleSendPasswordReset}
            className="shrink-0 bg-[#E8F5E9] border border-[#4CAF50] hover:bg-[#C8E6C9] text-[#2E7D32] rounded-md flex items-center gap-2 px-4 py-2"
          >
            <Send className="w-4 h-4" />
            Send Password Reset Link
          </ButtonWidget>
        </div>

      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-1/2">    
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Profile Picture</h3>
              <div className="flex flex-col items-start">
                <input
                  ref={profileImageInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.svg,image/jpeg,image/png,image/svg+xml"
                  className="hidden"
                  onChange={handleProfileImageChange}
                />
                <div className="w-28 h-28 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {profileImageUrl ? (
                    <ImageWidget src={profileImageUrl} alt={employee.employeeName} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <ImageWidget src={userImage} alt={employee.employeeName} className="w-full h-full object-cover rounded-lg" />
                  )}
                </div>
                {canAnyEdit(settingsPerms) && (
                  <button
                    type="button"
                    onClick={triggerProfileImageSelect}
                    className="mt-3 p-2 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-600"
                    title={profileImageUrl ? "Change" : "Upload"}
                  >
                    {profileImageUrl ? <SquarePen className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                  </button>
                )}
                <p className="text-xs text-gray-500 mt-1">Only support .jpg, .png and .svg</p>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">Status</span>
                <Switch
                  checked={isStatusActive}
                  onCheckedChange={setIsStatusActive}
                  disabled={!canAnyEdit(settingsPerms)}
                  className="data-[state=checked]:bg-[#00796B] data-[state=unchecked]:bg-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Right: Employee Details */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Employee Details</h3>
              {canAnyEdit(settingsPerms) && (
                <button
                  type="button"
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 border border-gray-200"
                  title="Edit"
                  onClick={() => setIsDetailsEditing(true)}
                >
                  <SquarePen className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="space-y-2">
              <FormInput
                name="employeeName"
                control={control}
                label="Employee Name"
                required
                disabled={!isDetailsEditing}
                className="bg-white border border-[#D9D9D9] min-h-[44px] rounded-sm px-4 focus-visible:border-[#00796B] focus-visible:ring-[#00796B]"
              />
              <FormInput
                name="email"
                control={control}
                label="Email"
                type="email"
                required
                disabled={!isDetailsEditing}
                className="bg-white border border-[#D9D9D9] min-h-[44px] rounded-sm px-4 focus-visible:border-[#00796B] focus-visible:ring-[#00796B]"
              />
              <FormInput
                name="mobile"
                control={control}
                label="Mobile No"
                required
                disabled={!isDetailsEditing}
                className="bg-white border border-[#D9D9D9] min-h-[44px] rounded-sm px-4 focus-visible:border-[#00796B] focus-visible:ring-[#00796B]"
              />
              <FormSelect
                name="role"
                control={control}
                label="Role"
                options={roleOptions}
                required
                disabled={!isDetailsEditing}
                className="bg-white border border-[#D9D9D9] min-h-[44px] rounded-sm"
              />
            </div>
            {isDetailsEditing && (
              <div className="flex items-center gap-3 w-full pt-4 mt-4 border-t border-gray-200">
                <ButtonWidget
                  type="button"
                  className="flex-1 h-10 px-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={handleCancelDetails}
                >
                  Cancel
                </ButtonWidget>
                <ButtonWidget
                  type="button"
                  className="flex-1 h-10 px-2 rounded-md bg-[#00796B] text-white hover:bg-[#00695C]"
                  onClick={handleSaveDetails}
                >
                  Save
                </ButtonWidget>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default EmployeeDetailsSection;
