"use client";

import { BarChart3, Calendar, Database, FileText, MapPin, Package, Search, Settings, Tag, Users } from "lucide-react";
import ButtonWidget from "./ButtonWidget";

const NoDataFoundWidget = ({
  title = "No data found",
  description = "There are no items to display at the moment.",
  icon = "default",
  className = "",
  showAction = false,
  actionText = "Create New",
  onAction,
  size = "default",
}) => {
  const getIcon = () => {
    switch (icon) {
      case "search":
        return <Search className="w-12 h-12 text-gray-400" />;
      case "database":
        return <Database className="w-12 h-12 text-gray-400" />;
      case "file":
        return <FileText className="w-12 h-12 text-gray-400" />;
      case "package":
        return <Package className="w-12 h-12 text-gray-400" />;
      case "users":
        return <Users className="w-12 h-12 text-gray-400" />;
      case "settings":
        return <Settings className="w-12 h-12 text-gray-400" />;
      case "chart":
        return <BarChart3 className="w-12 h-12 text-gray-400" />;
      case "calendar":
        return <Calendar className="w-12 h-12 text-gray-400" />;
      case "location":
        return <MapPin className="w-12 h-12 text-gray-400" />;
      case "tag":
        return <Tag className="w-12 h-12 text-gray-400" />;
      default:
        return <Database className="w-12 h-12 text-gray-400" />;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "py-8";
      case "lg":
        return "py-16";
      default:
        return "py-12";
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center text-center h-[62vh] ${getSizeClasses()} ${className}`}>
      <div className="mb-4">{getIcon()}</div>

      <h3 className={`font-medium text-gray-900 mb-2 ${size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl"}`}>{title}</h3>

      <p className={`text-gray-500 mb-6 max-w-md ${size === "sm" ? "text-sm" : "text-base"}`}>{description}</p>

      {showAction && onAction && (
        <ButtonWidget onClick={onAction} className="hover:bg-[#1F263E] h-9 bg-[#92DEC2] rounded-[14px] w-full sm:w-auto">
          + {actionText}
        </ButtonWidget>
      )}
    </div>
  );
};

export default NoDataFoundWidget;
