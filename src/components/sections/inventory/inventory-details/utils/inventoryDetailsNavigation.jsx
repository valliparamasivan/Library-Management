"use client";

import { FileText, Tag, Users, MapPin, History } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const InventoryDetailsNavigation = ({ currentPage, slug }) => {
  const pathname = usePathname();
  const basePath = `/inventory/inventory-details/${slug}`;

  const navigationItems = [
    {
      id: "book-details",
      label: "Book Details",
      href: `${basePath}/book-details`,
    },
    {
      id: "rfid",
      label: "RFID & Location",
      href: `${basePath}/rfid`,
    },
    {
      id: "loan",
      label: "Active Transactions",
      href: `${basePath}/loan`,
    },
    // {
    //   id: "activity-log",
    //   label: "Activity Log",
    //   href: `${basePath}/activity-log`,
    // },
  ];

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
                className={`flex items-center gap-4 px-4 py-2 text-sm font-medium transition-all duration-200 relative whitespace-nowrap ${
                  isActive 
                    ? "text-[#00796B]" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00796B] z-10"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default InventoryDetailsNavigation;
