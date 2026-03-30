"use client";
import { Plus } from "lucide-react";
import ButtonWidget from "./ButtonWidget";
import LinkWidget from "./LinkWidget";
import TooltipWidget from "./TooltipWidget";

const CreateButtonWidget = ({
  createHref,
  className = "bg-gray-100 hover:bg-gray-200 text-black p-2 rounded-lg shadow-sm border-0 flex-1 sm:flex-none",
  tooltipContent = "Create",
  children,
}) => {
  if (!createHref) return null;

  return (
    <LinkWidget href={createHref}>
      <ButtonWidget className="h-9 px-3 rounded-lg bg-[#00796B] hover:bg-[#00796B]/90 text-white border-0 shadow-sm flex items-center gap-2">
        {children || (
          <>
            <Plus className="w-4 h-4 text-white" />
            <span className="text-sm text-white">Add New</span>
          </>
        )}
      </ButtonWidget>
    </LinkWidget>
  );
};

export default CreateButtonWidget;
