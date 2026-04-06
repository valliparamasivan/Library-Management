"use client";

import MainSidebar from "@/components/layouts/MainSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PermissionGuard from "@/components/guards/PermissionGuard";

const MainLayout = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <SidebarProvider>
      <MainSidebar />
      <PermissionGuard>{children}</PermissionGuard>
    </SidebarProvider>
  );
};
export default MainLayout;
