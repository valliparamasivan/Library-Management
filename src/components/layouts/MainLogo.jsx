"use client";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Menu, ChevronLeft } from "lucide-react";
import logo from "@/assets/image/sub_logo 1.png";
import ImageWidget from "@/components/widgets/ImageWidget";
import One from '@/assets/icons/20.svg';

const MainLogo = () => {
  const { toggleSidebar, state } = useSidebar();

  return (
    <div className="-mx-2 relative">
      <SidebarMenu className="-mx-1">
        <SidebarMenuItem> 
          <div className={`flex items-center justify-between w-full ${state === "collapsed" ? "px-0" : "px-2"}`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton 
                  size="lg" 
                  className="py-2 pl-2 pr-2 justify-start flex-1 [&]:!bg-transparent [&]:hover:!bg-transparent [&]:active:!bg-transparent [&]:focus:!bg-transparent [&]:focus-visible:!bg-transparent"
                >
                  <ImageWidget 
                    src={logo} 
                    alt="Logo" 
                    className={`h-10 w-auto transition-opacity duration-500 ease-in-out ${
                      state === "collapsed" ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`} 
                  />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
            </DropdownMenu>
            <button
              onClick={toggleSidebar}
              className="flex items-center gap-1 p-1.5 rounded-md hover:bg-gray-100 transition-colors text-[#00796B]"
              aria-label="Toggle Sidebar"
            >
               <ImageWidget 
                 src={One} 
                 alt="Assets" 
                 className={`w-6 h-6 sm:w-6 sm:h-6 transition-transform duration-500 ease-in-out ${
                   state === "collapsed" ? "rotate-180" : "rotate-0"
                 }`} 
               />
            </button>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
};
export default MainLogo;
