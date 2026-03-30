"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SearchWidget = ({ placeholder = "Search...", value = "", onSearch, className = "", debounceMs = 500 }) => {
  const timeoutRef = useRef(null);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (onSearch) {
        onSearch(newValue);
      }
    }, debounceMs);
  };

  const handleClear = () => {
    setInputValue("");

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (onSearch) {
      onSearch("");
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 sm:top-[18px] transform -translate-y-1/2 text-[black] w-4 h-4" />
      <Input type="text" placeholder={placeholder} value={inputValue} onChange={handleChange} className="pl-8.5 pr-5 rounded-sm h-9 text-sm border border-[#BEC2C4]" />
      {inputValue && (
        <button onClick={handleClear} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#BEC2C4] hover:text-gray-600 transition-colors" type="button">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchWidget;
