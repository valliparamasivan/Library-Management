"use client";

import { useState, useEffect } from "react";
import { Bell, Clock, BookOpen, CheckCircle2, CircleAlert, ArrowRight } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  useCustomerNotifications, 
  useMarkNotificationRead, 
  useMarkAllNotificationsRead 
} from "@/store/customerHooks/AuthHooks";

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: notificationsResponse, refetch } = useCustomerNotifications();
  const [notifications, setNotifications] = useState([]);
  
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead } = useMarkAllNotificationsRead();

  useEffect(() => {
    if (notificationsResponse?.data) {
      const mapped = notificationsResponse.data.slice(0, 5).map((n) => {
        let icon = Bell, iconBg = "bg-gray-100", iconColor = "text-gray-600", title = "Notification";
        if (n.type === 'DUE') {
          icon = Clock; iconBg = "bg-orange-100"; iconColor = "text-orange-600"; title = "Book Due Soon";
        } else if (n.type === 'OVERDUE') {
          icon = CircleAlert; iconBg = "bg-red-100"; iconColor = "text-red-600"; title = "Overdue Book";
        }
        return {
          id: n.notificationId,
          title,
          message: n.message,
          time: new Date(n.createdAt).toLocaleDateString(),
          unread: !n.read,
          icon,
          iconBg,
          iconColor
        };
      });
      setNotifications(mapped);
    }
  }, [notificationsResponse]);

  const unreadCount = notificationsResponse?.data?.filter((n) => !n.read)?.length || 0;

  const handleNotificationClick = (notification) => {
    if (notification.unread) {
      markRead(notification.id, { onSuccess: () => refetch() });
    }
    router.push("/notification");
    setIsOpen(false);
  };

  const handleViewAll = () => {
    router.push("/notification");
    setIsOpen(false);
  };

  const handleMarkAllAsRead = () => {
    markAllRead(undefined, {
      onSuccess: () => {
        refetch();
        setIsOpen(false);
      }
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors relative"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[calc(100vw-2rem)] sm:w-96 p-0 flex flex-col max-h-[500px]" 
        align="end"
        sideOffset={8}
      >

        <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h3 className="text-sm sm:text-base font-bold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-red-600 text-white text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-lg">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
            >
              Mark all as read
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-1">
          {notifications.length > 0 ? (
            notifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${notification.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${notification.iconColor}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <p className="text-xs sm:text-sm font-bold text-gray-900">
                            {notification.title}
                          </p>
                          {notification.unread && (
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-600 flex-shrink-0"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-1">
                        {notification.message}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="px-3 sm:px-4 py-6 sm:py-8 text-center text-xs sm:text-sm text-gray-500">
              No notifications
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="border-t border-gray-200 flex-shrink-0">
            <button
              onClick={handleViewAll}
              className="w-full text-center px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-blue-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
            >
              <span className="whitespace-nowrap">View All Notifications</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
