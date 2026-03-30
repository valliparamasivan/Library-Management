"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Bell, X } from "lucide-react";
import { useState } from "react";

const NotificationDrawer = ({ isOpen, onOpenChange }) => {
  const [notifications] = useState([
    {
      id: 1,
      title: "Multiple Overdue Books Alert",
      priority: "HIGH",
      action: "Action Required...",
      hasAction: true,
    },
    {
      id: 2,
      title: "Fine Payment Received",
      priority: "MEDIUM",
      timestamp: "2 hours ago...",
      hasAction: false,
    },
    {
      id: 3,
      title: "New Member Registration",
      priority: "LOW",
      timestamp: "3 hours ago...",
      hasAction: false,
    },
    {
      id: 4,
      title: "RFID System Sync Complete",
      priority: "MEDIUM",
      timestamp: "4 hours ago...",
      hasAction: false,
    },
    {
      id: 5,
      title: "Book Reservation Ready",
      priority: "MEDIUM",
      action: "Action Required...",
      hasAction: true,
    },
    {
      id: 6,
      title: "Damaged Book Reported",
      priority: "HIGH",
      action: "Action Required...",
      hasAction: true,
    },
    {
      id: 7,
      title: "Critical Overdue Notice",
      priority: "HIGH",
      action: "Action Required...",
      hasAction: true,
    },
    {
      id: 8,
      title: "System Backup Completed",
      priority: "MEDIUM",
      timestamp: "10 hours ago...",
      hasAction: false,
    },
    {
      id: 9,
      title: "Membership Renewal",
      priority: "LOW",
      timestamp: "12 hours ago...",
      hasAction: false,
    },
  ]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:w-[400px] p-0 overflow-hidden flex flex-col [&>button]:hidden"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold text-gray-900">
              Notifications
            </SheetTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
              type="button"
            >
              <X className="w-5 h-5 cursor-pointer" />
            </button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex items-start gap-3 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="bg-[#9DEEE5] rounded-lg p-2 flex-shrink-0">
                  <Bell className="w-4 h-4 text-[#00796B]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 flex-1">
                      {notification.title}
                    </h3>
                    <p
                      className="pt-2 rounded text-xs text-gray-500 font-normal flex-shrink-0"
                    >
                      {notification.priority}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600">
                    {notification.hasAction
                      ? notification.action
                      : notification.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationDrawer;
