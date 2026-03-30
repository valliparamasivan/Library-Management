"use client";
import { RefreshCw } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { toast } from "sonner";
import ButtonWidget from "./ButtonWidget";
import TooltipWidget from "./TooltipWidget";

const RefreshWidget = ({ className = "bg-gray-100 hover:bg-gray-200 text-black p-2 rounded-lg shadow-sm border-0 flex-1 sm:flex-none", tooltipContent = "Refresh" }) => {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await router.refresh();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
      toast.success("Latest data is now available !!!");
    }
  };

  return (
    <TooltipWidget content={tooltipContent}>
      <ButtonWidget className={className} onClick={handleRefresh}>
        <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
      </ButtonWidget>
    </TooltipWidget>
  );
};

export default RefreshWidget;
