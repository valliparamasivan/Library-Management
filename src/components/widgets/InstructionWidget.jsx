"use client";
import { Info } from "lucide-react";
import ButtonWidget from "./ButtonWidget";

const InstructionWidget = ({ title = "Instructions", content, className = "", tooltipWidth = "w-200" }) => {
  return (
    <div className={`relative group ${className}`}>
      <ButtonWidget variant="outline" className="bg-gray-100 hover:bg-gray-200 text-black p-2 rounded-lg shadow-sm border-0 flex-1 sm:flex-none">
        <Info className="w-4 h-4" />
      </ButtonWidget>
      <div
        className={`absolute right-0 top-full mt-2 ${tooltipWidth} bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50`}
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          </div>
          <div className="space-y-3 text-gray-700">{content}</div>
        </div>
        <div className="absolute bottom-full right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-gray-200"></div>
      </div>
    </div>
  );
};

export default InstructionWidget;
