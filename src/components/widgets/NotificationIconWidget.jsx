"use client";

import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useState } from "react";
import NotificationDrawer from "./NotificationDrawer";

const NotificationIconWidget = ({ onClick, className = "", unreadCount = 1 }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsDrawerOpen(true);
    }
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleClick}
        className={`p-2 hover:bg-gray-100 rounded-lg transition-colors relative ${className}`} 
        title="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-600 hover:text-gray-800" />
        {unreadCount > 0 && (
          <span className="absolute bottom-5 right-0 w-4 h-4 bg-[#004AAD] text-white text-xs font-medium rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>
      <NotificationDrawer isOpen={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </>
  );
};

export default NotificationIconWidget;
