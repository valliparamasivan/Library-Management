"use client";

import { FileText, Tag, Users, MapPin, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SettingsViewNavigation = ({ currentPage }) => {
  const pathname = usePathname();
  const basePath = `/settings`;

  const navigationItems = [
    {
      id: "policy",
      label: "Policy",
      icon: FileText,
      href: `${basePath}/policy`,
    },
    // {
    //   id: "rfid",
    //   label: "RFID",
    //   icon: Tag,
    //   href: `${basePath}/rfid`,
    // },
    {
      id: "roles",
      label: "Roles",
      icon: Users,
      href: `${basePath}/roles`,
    },
    {
      id: "employees",
      label: "Employees",
      icon: UserCircle,
      href: `${basePath}/employees`,
    },
    {
      id: "location",
      label: "Location",
      icon: MapPin,
      href: `${basePath}/location`,
    },
  ];

  return (
    <div className="mb-1 mt-1">
      <nav >
        <div className="flex overflow-x-auto">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPage === item.id || pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 relative whitespace-nowrap ${
                  isActive 
                    ? "text-teal-600" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <IconComponent 
                  className={`w-4 h-4 transition-colors duration-200 ${
                    isActive ? "text-teal-600" : "text-gray-400"
                  }`} 
                />
                <span>{item.label}</span>
                {isActive && (
                  <div className="absolute bottom-[1px] left-0 right-0 h-0.5 bg-teal-600 z-10"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default SettingsViewNavigation;
