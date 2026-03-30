"use client";
import MainLinks from "@/components/layouts/MainLinks";
import MainLogo from "@/components/layouts/MainLogo";
import MainProfile from "@/components/layouts/MainProfile";
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail, SidebarFooter } from "@/components/ui/sidebar";
import {  GalleryVerticalEnd, Settings ,LayoutDashboard,RefreshCw,ArrowUpDown ,User,BookMinus,ChartColumnBig,History } from "lucide-react";



const data = {
  teams: [
    {
      name: "CORPFIELD",
      logo: GalleryVerticalEnd,
      plan: "Library Management",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isStandalone: true,
    },
    {
      title: "Inventory",
      url: "/inventory",
      icon: BookMinus,
      isStandalone: true,
    },
    {
      title: "Circulation",
      url: "/circulation",
      icon:RefreshCw,
      isStandalone: true,
    },
    {
      title: "Loans",
      url: "/loans",
      icon:ArrowUpDown,
      isStandalone: true,
    },
    {
      title: "Users",
      url: "/users",
      icon:User,
      isStandalone: true,
    },
    {
      title: "Settings",
      url: "/settings",
      icon:Settings,
      isStandalone: true,
    },
    {
      title: "Reports",
      url: "/reports",
      icon:ChartColumnBig,
      isStandalone: true,
    },
    {
      title: "Activity Log",
      url: "/activitylog",
      icon:History,
      isStandalone: true,
    },
  ],
};

const MainSidebar = ({ user, ...props }) => {
  // Default user data if not provided
  const defaultUser = {
    name: "User",
    email: "user@example.com",
    avatar: null,
  };

  const userData = user || defaultUser;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <MainLogo />
      </SidebarHeader>
      <SidebarContent>
        <MainLinks items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <MainProfile user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
};
export default MainSidebar;
