"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, Bell, Clock, BookOpen, CheckCircle2, Trash2, CircleAlert, Sparkles, CircleCheckBig, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useCustomerNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
  useDeleteAllNotifications
} from "@/store/customerHooks/AuthHooks";

const NotificationSection = () => {
  const [activeTab, setActiveTab] = useState("all");
  const { data: notificationsResponse, isLoading, isError } = useCustomerNotifications();

  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead } = useMarkAllNotificationsRead();
  const { mutate: delNotification } = useDeleteNotification();
  const { mutate: delAllNotifications } = useDeleteAllNotifications();

  const notifications = useMemo(() => {
    if (!notificationsResponse?.data) return [];
    return notificationsResponse.data.map(n => {
      let icon = Bell, iconBg = "bg-gray-100", iconColor = "text-gray-600", title = "Notification";
      if (n.type === 'DUE') {
        icon = Clock; iconBg = "bg-orange-100"; iconColor = "text-orange-600"; title = "Book Due Soon";
      } else if (n.type === 'OVERDUE') {
        icon = CircleAlert; iconBg = "bg-red-100"; iconColor = "text-red-600"; title = "Overdue Book - Action Required";
      }
      return {
        id: n.notificationId,
        type: n.type.toLowerCase(),
        icon, iconBg, iconColor, title,
        isUnread: !n.read,
        description: n.message,
        timestamp: new Date(n.createdAt).toLocaleDateString(),
        actions: n.read ? ["delete"] : ["mark-read", "delete"]
      };
    });
  }, [notificationsResponse]);

  const allCount = notifications.length;
  const unreadCount = notifications.filter(n => n.isUnread).length;

  const handleMarkAsRead = (id) => {
    markRead(id, {
      onSuccess: (data) => toast.success(data?.message || "Notification marked as read"),
      onError: (err) => toast.error(err?.response?.data?.message || "Failed to mark notification as read"),
    });
  };

  const handleDelete = (id) => {
    delNotification(id, {
      onSuccess: (data) => toast.success(data?.message || "Notification deleted"),
      onError: (err) => toast.error(err?.response?.data?.message || "Failed to delete notification"),
    });
  };

  const handleMarkAllAsRead = () => {
    markAllRead(undefined, {
      onSuccess: (data) => toast.success(data?.message || "All notifications marked as read"),
      onError: (err) => toast.error(err?.response?.data?.message || "Failed to mark all as read"),
    });
  };

  const handleClearRead = () => {
    delAllNotifications(undefined, {
      onSuccess: (data) => toast.success(data?.message || "Read notifications cleared"),
      onError: (err) => toast.error(err?.response?.data?.message || "Failed to clear notifications"),
    });
  };

  const filteredNotifications = activeTab === "all"
    ? notifications
    : notifications.filter(n => n.isUnread);

  return (
    <div className="min-h-screen">
      <div className=" mx-auto px-4 md:px-6 lg:px-8 py-6">
        {/* Back to Dashboard Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#566270] hover:text-gray-900 text-sm font-medium mb-6"
        >
          <ChevronLeft className="w-4 h-4 text-[#566270]" />
          Back to Dashboard
        </Link>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Bell className="w-6 h-6 text-[#0B63CE]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          </div>
          <p className="text-sm text-gray-600 ml-9">
            Stay updated with your library activities and important reminders
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border border-gray-200 rounded-lg p-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({allCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("unread")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === "unread"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 text-sm text-[#0B1723] font-medium hover:text-gray-900 transition-colors"
            >
              <CircleCheckBig className="w-4 h-4 text-[#0B1723]" />
              Mark all as read
            </button>
            <button
              onClick={handleClearRead}
              className="flex items-center gap-2 text-sm text-[#0B1723] font-medium hover:text-gray-900 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-[#0B1723]" />
              Clear read
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Loading notifications...</p>
          </div>
        )}

        {isError && (
          <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
            <p className="text-red-500">Failed to load notifications. Please try again later.</p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="space-y-3">
              {filteredNotifications.map((notification) => {
                const IconComponent = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg ${notification.iconBg} flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className={`w-5 h-5 ${notification.iconColor}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-gray-900">
                              {notification.title}
                            </h3>
                            {notification.isUnread && (
                              <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></div>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {notification.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-3">
                          {notification.description}
                        </p>

                        {notification.actions.length > 0 && (
                          <div className="flex items-center gap-4">
                            {notification.actions.includes("mark-read") && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="flex items-center gap-1.5 text-sm text-[#0B1723] font-medium hover:text-gray-900 transition-colors border border-gray-200 rounded-lg p-2"
                              >
                                <CircleCheckBig className="w-4 h-4 text-[#0B1723]" />
                                Mark as read
                              </button>
                            )}
                            {notification.actions.includes("delete") && (
                              <button
                                onClick={() => handleDelete(notification.id)}
                                className="flex items-center gap-1.5 text-sm text-[#0B1723] font-medium hover:text-gray-900 transition-colors border border-gray-200 rounded-lg p-2"
                              >
                                <Trash2 className="w-4 h-4 text-[#0B1723]" />
                                Delete
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredNotifications.length === 0 && (
              <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
                <p className="text-gray-500">No notifications found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationSection;
