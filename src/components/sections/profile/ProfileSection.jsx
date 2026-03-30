"use client";

import React, { useState } from "react";
import PageLayout from "@/components/layouts/PageLayout";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import ProfileWidget from "@/components/sections/profile/utils/ProfileDialog";
import { useForm } from "react-hook-form";
import { ArrowLeft, SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import user from '@/assets/image/user.png';
import ImageWidget from "@/components/widgets/ImageWidget";

const ProfileSection = () => {
  const router = useRouter();
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const { watch } = useForm({
    defaultValues: {
      name: "Shajin",
      employeeId: "Admin12345",
      phoneNo: "+91 98563 98563",
      position: "Admin",
      department: "Administration",
      emailAddress: "admin@library.com",
    },
  });

  const formValues = watch();

  const handleEdit = () => {
    setIsUserDialogOpen(true);
  };

  const breadcrumbs = [
    { label: "Profile" },
  ];

  return (
    <PageLayout breadcrumbs={breadcrumbs} showBreadcrumbs={false}>
      <div className="min-h-[calc(100vh-56px)] bg-gray-50 -mx-4">
        {/* Header with back arrow and Profile text */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 bg-white">
          <ArrowLeft 
            className="h-5 w-5 cursor-pointer text-gray-700 hover:text-gray-900" 
            onClick={() => router.back()}
          />
          <h1 className="text-lg font-semibold text-gray-900">Profile</h1>
        </div>

        {/* Main Content */}
        <div className="px-4 py-6">
          <div className="w-full">
            {/* Main Profile Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                {/* Left Section - Profile Picture and Edit Button */}
                <div className="flex flex-col items-center md:items-start">
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-lg overflow-hidden mb-4">
                    <ImageWidget 
                      src={user} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-lg" 
                    />
                  </div>
                  <ButtonWidget
                    onClick={handleEdit}
                    className="px-4 py-2 border border-blue-500 bg-white text-blue-500 hover:bg-blue-50 rounded-lg flex items-center justify-center gap-2 text-sm font-medium w-40 md:w-48"
                  >
                    <SquarePen className="w-4 h-4" />
                    Edit
                  </ButtonWidget>
                </div>

                {/* Right Section - User Information */}
                <div className="flex-1">
                  <h2 className="text-xl md:text-3xl font-semibold text-gray-900 mb-2">
                    {formValues.name}
                  </h2>
                  <p className="text-sm text-gray-700 mb-4 pb-4 border-b">
                    {formValues.position}
                  </p>

                  {/* Details List */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600 min-w-[100px]">Employee ID</span>
                      <span className="text-sm text-gray-900">{formValues.employeeId}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600 min-w-[100px]">Phone No</span>
                      <span className="text-sm text-gray-900">{formValues.phoneNo}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600 min-w-[100px]">Email ID</span>
                      <span className="text-sm text-gray-900">{formValues.emailAddress}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProfileWidget
        isOpen={isUserDialogOpen}
        onOpenChange={setIsUserDialogOpen}
        profileData={{
          name: formValues.name,
          emailAddress: formValues.emailAddress,
          phoneNo: formValues.phoneNo,
        }}
      />
    </PageLayout>
  );
};

export default ProfileSection;

