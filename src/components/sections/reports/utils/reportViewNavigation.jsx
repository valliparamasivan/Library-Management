"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import usePermissions from "@/components/custom-hooks/usePermissions";

const ReportViewNavigation = ({ currentPage }) => {
  const pathname = usePathname();
  const { canView } = usePermissions();
  const basePath = `/reports`;

  const navigationItems = [
    {
      id: "user",
      label: "User",
      href: `${basePath}/user`,
      canShow: canView("Report Users"),
    },
    {
      id: "loan",
      label: "Loans",
      href: `${basePath}/loan`,
      canShow: canView("Report Loans"),
    },
    {
      id: "inventory",
      label: "Inventory",
      href: `${basePath}/inventory`,
      canShow: canView("Report Inventory"),
    },
  ].filter((item) => item.canShow);

  return (
    <div className="mb-1 mt-1">
      <nav >
        <div className="flex overflow-x-auto">
          {navigationItems.map((item) => {
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

export default ReportViewNavigation;
