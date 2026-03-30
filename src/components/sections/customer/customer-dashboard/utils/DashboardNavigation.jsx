"use client";

import { LayoutGrid, BookOpen, BookmarkPlus, History, Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DashboardNavigation = ({ currentPage, borrowedCount, reservedCount, historyCount, favoritesCount }) => {
  const pathname = usePathname();
  const basePath = "/customer-dashboard";

  const navigationItems = [
    {
      id: "overview",
      label: "Overview",
      href: basePath,
      icon: LayoutGrid,
    },
    {
      id: "borrowed-books",
      label: "Borrowed",
      href: `${basePath}/borrowed-books`,
      icon: BookOpen,
      count: borrowedCount,
    },
    {
      id: "reserved-books",
      label: "Reserved",
      href: `${basePath}/reserved-books`,
      icon: BookmarkPlus,
      count: reservedCount,
    },
    {
      id: "history",
      label: "History",
      href: `${basePath}/history`,
      icon: History,
      count: historyCount,
    },
    {
      id: "favorites",
      label: "Favorites",
      href: `${basePath}/favorites`,
      icon: Heart,
      count: favoritesCount,
    },
  ];

  return (
    <div className="mb-1 mt-1">
      <nav>
        <div className="flex overflow-x-auto border-b border-border">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id || pathname === item.href || (item.id === "overview" && pathname === basePath);

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-3 text-md font-medium transition-all duration-200 relative whitespace-nowrap ${
                  isActive 
                    ? "text-[#0B63CE]" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold min-w-[20px] text-center ${
                    isActive 
                      ? "bg-[#0B63CE] text-white" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {item.count}
                  </span>
                )}
                {isActive && (
                  <div className="absolute bottom-[1px] left-0 right-0 h-0.5 bg-[#0B63CE] z-10"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default DashboardNavigation;
