"use client";

import userImage from '@/assets/image/user.png';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import AlertDialogWidget from "@/components/widgets/AlertDialogWidget";
import ImageWidget from '@/components/widgets/ImageWidget';
import { ChevronRight, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { clientAxios } from "@/config/ApiConfig";

const fetchProfile = async () => {
  const { data } = await clientAxios.get("/profileDetails");
  return data;
};

const HeaderProfile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const isAuthenticated = status === "authenticated" && session?.user?.role !== "User";

  const { data: profileResponse } = useQuery({
    queryKey: ["adminProfile"],
    queryFn: fetchProfile,
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const profileData = profileResponse?.data || {};
  const userName = profileData.userName || session?.user?.email || "User";
  const profileImg = profileData.profileImageUrl;
  const avatarSrc = profileImg
    ? (profileImg.startsWith("http") ? profileImg : `https://libraryapi.corpfield.com/profile-image/${profileImg}`)
    : null;

  const handleLogoutClick = () => {
    setIsProfileOpen(false);
    setLogoutDialogOpen(true);
  };

  const handleConfirmLogout = useCallback(async () => {
    setLogoutDialogOpen(false);
    await signOut({
      redirect: true,
      callbackUrl: "/sign-in",
    });
  }, []);

  return (
    <>
      <Popover open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <PopoverTrigger asChild>
          <button
            className="flex items-center gap-2 px-2.5 py-1 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-gray-300"
            aria-label="User menu"
          >
            <Avatar className="h-8 w-8 rounded-full">
              <ImageWidget src={avatarSrc || userImage} alt={userName} className="w-full h-full object-cover rounded-full" />
              <AvatarFallback className="rounded-full bg-gray-200 text-gray-600">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <ChevronRight className="w-4 h-4 text-[#00796B]" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-40 p-0 rounded-lg"
          align="end"
          sideOffset={8}
        >
          <div className="border-gray-200">
            <button
              onClick={handleLogoutClick}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <LogOut className="w-4 h-4 text-red-600" />
                <span>Logout</span>
              </div>
            </button>
          </div>
        </PopoverContent>
      </Popover>
      <AlertDialogWidget
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        title="Confirm Logout"
        description="Are you sure you want to logout?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        onConfirm={handleConfirmLogout}
        variant="destructive"
      />
    </>
  );
};

export default HeaderProfile;
