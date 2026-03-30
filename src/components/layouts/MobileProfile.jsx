"use client";
import userImage from '@/assets/image/user.png';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ImageWidget from '@/components/widgets/ImageWidget';
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileProfile = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isProfileActive = pathname?.includes("/profile");
  
  const user = session?.user || {
    name: "User",
    email: "user@example.com",
  };

  return (
    <Link href="/profile" className="flex items-center gap-2 px-2">
      <Avatar className="h-8 w-8 rounded-full">
        <ImageWidget src={userImage} alt={user?.name || "User"} />
        <AvatarFallback className="rounded-full bg-gray-200 text-gray-600">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default MobileProfile;
