"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Popover, PopoverContent, PopoverAnchor } from "@/components/ui/popover";

export const SearchAutocomplete = ({ placeholder, suggestions = [], onSearch, onSelect, value, onChange }) => {
  const [query, setQuery] = useState(value || "");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (value !== undefined) {
      setQuery(value);
    }
  }, [value]);

  const filteredSuggestions = useMemo(() => {
    if (!query.trim()) return [];
    const queryLower = query.toLowerCase();
    return suggestions.filter(
      (suggestion) =>
        suggestion.title?.toLowerCase().includes(queryLower) ||
        suggestion.author?.toLowerCase().includes(queryLower) ||
        suggestion.isbn?.toLowerCase().includes(queryLower) ||
        suggestion.category?.toLowerCase().includes(queryLower)
    ).slice(0, 10);
  }, [query, suggestions]);

  const hasExactMatch = useMemo(() => {
    return suggestions.some(
      (suggestion) => suggestion.title?.toLowerCase() === query.toLowerCase()
    );
  }, [query, suggestions]);

  useEffect(() => {
    setIsOpen(filteredSuggestions.length > 0 && query.trim() !== "" && !hasExactMatch);
  }, [filteredSuggestions.length, query, hasExactMatch]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const selectedValue = suggestion.title || "";
    setQuery(selectedValue);
    setIsOpen(false);
    if (onChange) {
      onChange(selectedValue);
    }
    if (onSelect) {
      onSelect(suggestion);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim()) {
      if (onSearch) {
        onSearch(query);
      }
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <div className="relative w-full max-w-2xl mx-auto">
        <PopoverAnchor asChild>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="pl-12 pr-4 h-14 text-base rounded-lg border-2 focus-visible:border-primary bg-white"
            />
          </div>
        </PopoverAnchor>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 max-h-64 overflow-y-auto"
          align="start"
          sideOffset={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
        </PopoverContent>
      </div>
    </Popover>
  );
};
