"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addMonths, format, subMonths, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarDesign } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import ButtonWidget from "@/components/widgets/ButtonWidget";

const DateRangePicker = ({
  onDateRangeChange,
  initialDateRange = null,
  /** 1 = Today, 2 = This Week, 3 = This Month, 4 = Custom — syncs preset highlight from URL */
  initialDateType = null,
  /** When true, Filter calls `onDateRangeChange(range, { dateType })` so parents can set e.g. `type` in the query string */
  includeDateTypeOnApply = false,
  trigger,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Initialize with today's date range
  const getTodayRange = () => {
    const today = new Date();
    return {
      from: startOfDay(today),
      to: endOfDay(today),
    };
  };

  const [dateRange, setDateRange] = useState(
    initialDateRange || getTodayRange()
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingField, setSelectingField] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(initialDateRange ? null : "today");

  useEffect(() => {
    if (initialDateRange) {
      setDateRange(initialDateRange);
    }
  }, [initialDateRange]);

  useEffect(() => {
    if (initialDateType == null || initialDateType === "") return;
    if (initialDateType === 1) setSelectedPreset("today");
    else if (initialDateType === 2) setSelectedPreset("thisWeek");
    else if (initialDateType === 3) setSelectedPreset("thisMonth");
    else if (initialDateType === 4) setSelectedPreset(null);
  }, [initialDateType]);

  const handleDateSelect = (range) => {
    if (selectingField) return;
    setDateRange(range);
    if (range?.from && range?.to) {
      setSelectedPreset(null); // Clear preset when manually selecting dates
    }
  };

  const handleDayClick = (day) => {
    if (selectingField === "start") {
      const newRange = { from: day, to: null };
      setDateRange(newRange);
      setSelectingField("end");
      return;
    }
    if (selectingField === "end") {
      if (dateRange?.from && day >= dateRange?.from) {
        const newRange = { from: dateRange?.from, to: day };
        setDateRange(newRange);
        setSelectingField(null);
      } else {
        const newRange = { from: day, to: null };
        setDateRange(newRange);
        setSelectingField("end");
      }
      return;
    }
  };

  const handleClear = () => {
    setDateRange({ from: null, to: null });
    setSelectedPreset(null);
    setSelectingField(null);
    onDateRangeChange?.(null);
    setIsOpen(false);
  };

  const isDateRangeValid = () => {
    return dateRange && dateRange?.from && dateRange?.to && dateRange?.to >= dateRange?.from;
  };

  const handleSubmit = () => {
    if (isDateRangeValid()) {
      onDateRangeChange?.(dateRange);
      setIsOpen(false);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleStartDateClick = () => {
    setSelectingField("start");
  };

  const handleEndDateClick = () => {
    setSelectingField("end");
  };

  const handlePresetClick = (preset) => {
    const today = new Date();
    let from, to;

    switch (preset) {
      case "today":
        from = startOfDay(today);
        to = endOfDay(today);
        break;
      case "thisWeek":
        from = startOfWeek(today, { weekStartsOn: 0 });
        to = endOfWeek(today, { weekStartsOn: 0 });
        break;
      case "thisMonth":
        from = startOfMonth(today);
        to = endOfMonth(today);
        break;
      default:
        return;
    }

    setSelectedPreset(preset);
    const newRange = { from, to };
    setDateRange(newRange);
    setCurrentMonth(from);
    setSelectingField(null);
  };

  const getDateTypeFromPreset = () => {
    if (selectedPreset === "today") return 1;
    if (selectedPreset === "thisWeek") return 2;
    if (selectedPreset === "thisMonth") return 3;
    return 4;
  };

  const handleFilter = () => {
    if (isDateRangeValid()) {
      if (includeDateTypeOnApply) {
        onDateRangeChange?.(dateRange, { dateType: getDateTypeFromPreset() });
      } else {
        onDateRangeChange?.(dateRange);
      }
      setIsOpen(false);
    }
  };

  const defaultTrigger = (
    <ButtonWidget
      type="button"
      className="h-9 px-3 rounded-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 shadow-sm flex items-center gap-2"
    >
      <CalendarIcon className="w-4 h-4 text-[#00796B]" />
      Date
    </ButtonWidget>
  );

  // Reset to today when popover opens (if no initialDateRange)
  useEffect(() => {
    if (isOpen && !initialDateRange) {
      const todayRange = getTodayRange();
      setDateRange(todayRange);
      setSelectedPreset("today");
      setCurrentMonth(new Date());
      setSelectingField(null);
    }
  }, [isOpen, initialDateRange]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {trigger || defaultTrigger}
      </PopoverTrigger>
      <PopoverContent className="!w-fit !p-0 shadow-lg border-0" align="start">
        <div className="bg-white rounded-lg p-3 w-fit">
          {/* Preset Buttons */}
          <div className="flex gap-1 mb-3 w-full">
            <button
              type="button"
              onClick={() => handlePresetClick("today")}
              className={cn(
                "flex-1 px-1.5 py-1.5 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap min-w-0",
                selectedPreset === "today"
                  ? "bg-[#00796B] text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              )}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handlePresetClick("thisWeek")}
              className={cn(
                "flex-1 px-1.5 py-1.5 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap min-w-0",
                selectedPreset === "thisWeek"
                  ? "bg-[#00796B] text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              )}
            >
              This Week
            </button>
            <button
              type="button"
              onClick={() => handlePresetClick("thisMonth")}
              className={cn(
                "flex-1 px-1.5 py-1.5 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap min-w-0",
                selectedPreset === "thisMonth"
                  ? "bg-[#00796B] text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              )}
            >
              This Month
            </button>
          </div>

          {/* From/To Date Inputs */}
          <div className="flex gap-2 mb-3">
            <div className="w-[120px]">
              <label className="text-[10px] text-gray-600 mb-0.5 block">From</label>
              <div className={cn(
                "flex items-center gap-1.5 border rounded-md px-2 py-1.5",
                dateRange?.from || selectingField === "start" ? "border-[#00796B]" : "border-gray-300"
              )}>
                <CalendarIcon className="h-3 w-3 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  readOnly
                  value={dateRange?.from ? format(dateRange.from, "MM/dd/yyyy") : ""}
                  placeholder="From"
                  onClick={handleStartDateClick}
                  className="w-full text-xs text-gray-700 bg-transparent border-0 outline-none cursor-pointer"
                />
              </div>
            </div>
            <div className="w-[120px]">
              <label className="text-[10px] text-gray-600 mb-0.5 block">To</label>
              <div className={cn(
                "flex items-center gap-1.5 border rounded-md px-2 py-1.5",
                dateRange?.to || selectingField === "end" ? "border-[#00796B]" : "border-gray-300"
              )}>
                <CalendarIcon className="h-3 w-3 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  readOnly
                  value={dateRange?.to ? format(dateRange.to, "MM/dd/yyyy") : ""}
                  placeholder="To"
                  onClick={handleEndDateClick}
                  className="w-full text-xs text-gray-700 bg-transparent border-0 outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="pt-0">
            <div className="flex items-center justify-between mb-1 h-5">
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0 hover:bg-gray-100 rounded-md transition-colors flex items-center justify-center"
                onClick={handlePreviousMonth}
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>

              <div className="flex justify-center items-center text-xs font-medium text-gray-900 h-5">{format(currentMonth, "MMMM yyyy").toUpperCase()}</div>

              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0 hover:bg-gray-100 rounded-md transition-colors flex items-center justify-center"
                onClick={handleNextMonth}
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>

            <CalendarDesign
              mode="range"
              selected={dateRange}
              onSelect={handleDateSelect}
              onDayClick={handleDayClick}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              captionLayout="none"
              numberOfMonths={1}
              className="rounded-md"
              formatters={{
                formatWeekdayName: (date) => {
                  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
                  return weekdays[date.getDay()];
                },
              }}
              classNames={{
                root: "w-fit",
                months: "flex flex-col w-fit",
                month: "w-fit",
                table: "w-fit",
                week: "w-fit",
                nav: "hidden",
                nav_button: "hidden",
                nav_button_previous: "hidden",
                nav_button_next: "hidden",
                caption: "hidden",
                caption_label: "hidden",
                month_caption: "hidden",
                day: "h-7 w-full text-xs",
                weekday: "text-[10px] font-medium text-gray-600 px-1",
                weekdays: "gap-0 w-fit",
                range_start: "!bg-[#00796B] !text-white !rounded-full",
                range_end: "!bg-[#00796B] !text-white !rounded-full",
                range_middle: "!bg-[#E0F2F1] !text-gray-900 !rounded-full",
                selected: "!bg-[#00796B] !text-white !rounded-full",
              }}
            />
          </div>

          {/* Filter and Cancel Buttons */}
          <div className="mt-3 pt-3 border-t flex gap-2">
            <ButtonWidget
              type="button"
              onClick={handleClear}
              className="flex-1 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md text-xs"
            >
              Cancel
            </ButtonWidget>
            <ButtonWidget
              type="button"
              onClick={handleFilter}
              disabled={!isDateRangeValid()}
              className="flex-1 px-3 py-1.5 bg-[#00796B] hover:bg-[#00796B]/90 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed text-xs"
            >
              Filter
            </ButtonWidget>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
