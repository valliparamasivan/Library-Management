"use client";

import { FileText, Tag, Users, MapPin, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import usePermissions from "@/components/custom-hooks/usePermissions";

const allSettingsItems = [
  {
    id: "policy",
    label: "Policy",
    icon: FileText,
    href: "/settings/policy",
    permissions: ["Policy", "Settings"],
  },
  {
    id: "roles",
    label: "Roles",
    icon: Users,
    href: "/settings/roles",
    permissions: ["Roles", "Roles & Permissions", "Settings"],
  },
  {
    id: "employees",
    label: "Employees",
    icon: UserCircle,
    href: "/settings/employees",
    permissions: ["Employees", "Settings"],
  },
  {
    id: "location",
    label: "Location",
    icon: MapPin,
    href: "/settings/location",
    permissions: ["Location", "Settings"],
  },
];

const SettingsViewNavigation = ({ currentPage }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { permissions, canAnyView } = usePermissions();

  const filteredItems = permissions.length > 0
    ? allSettingsItems.filter((item) => canAnyView(item.permissions))
    : allSettingsItems;

  // Redirect if current sub-page is not permitted
  useEffect(() => {
    if (permissions.length === 0 || filteredItems.length === 0) return;

    const currentItem = allSettingsItems.find(
      (item) => currentPage === item.id || pathname === item.href
    );

    if (currentItem && !filteredItems.includes(currentItem)) {
      router.replace(filteredItems[0].href);
    }
  }, [permissions, pathname, currentPage, filteredItems, router]);

  return (
    <div className="mb-1 mt-1">
      <nav >
        <div className="flex overflow-x-auto">
          {filteredItems.map((item) => {
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
