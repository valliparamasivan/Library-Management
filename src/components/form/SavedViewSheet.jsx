"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

const SavedViewSheet = ({ savedResults = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <ButtonWidget variant="outline" size="sm" className="h-9 px-3! rounded-[14px] text-[#92DEC2] border border-[#92DEC2] flex-1 sm:flex-none">
          <span className="hidden sm:inline">Saved Views ({savedResults.length})</span>
          <span className="sm:hidden">Views</span>
        </ButtonWidget>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[500px]">
        <SheetHeader className="flex justify-between">
          <SheetTitle className="text-lg font-bold text-black">Saved Results</SheetTitle>
          <SheetDescription className="sr-only">Saved Results</SheetDescription>
        </SheetHeader>

        {savedResults.map((result, index) => (
          <div key={index} className="w-full cursor-pointer text-left flex flex-col gap-2 mt-6">
            <div className="flex items-center gap-2 justify-between">
              <div className="text-gray-500 text-sm">{result.name}</div>
              <ChevronRight className="h-4 w-4 text-blue-400" />
            </div>
          </div>
        ))}
      </SheetContent>
    </Sheet>
  );
};

export default SavedViewSheet;
