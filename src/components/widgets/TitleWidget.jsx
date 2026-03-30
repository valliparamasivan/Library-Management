import { List, LayoutGrid } from "lucide-react";

const TitleWidget = ({
  title,
  icon: Icon,
  className = "",
  iconClassName = "w-5 h-5 text-gray-900",
  titleClassName = "text-base sm:text-lg lg:text-xl font-medium text-black-400",
  containerClassName = "flex items-center gap-1 sm:gap-4",
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className={`${containerClassName} ${className}`}>
      <div className="flex items-center gap-2">
        <h1 className={titleClassName}>{title}</h1>
        {onViewModeChange && (
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={() => onViewModeChange("list")}
            className={`p-2 rounded-lg border ${
              viewMode === "list"
                ? "border-[#00796B] bg-transparent"
                : "border-gray-300 bg-transparent hover:border-gray-400"
            }`}
            title="List View"
          >
            <List className={`w-4 h-4 ${viewMode === "list" ? "text-[#00796B]" : "text-gray-400"}`} />
          </button>
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-2 rounded-lg border  ${
              viewMode === "grid"
                ? "border-[#00796B] bg-transparent"
                : "border-gray-300 bg-transparent hover:border-gray-400"
            }`}
            title="Grid View"
          >
            <LayoutGrid className={`w-4 h-4 ${viewMode === "grid" ? "text-[#00796B]" : "text-gray-400"}`} />
          </button>
        </div>
      )}
      </div>
    
    </div>
  );
};

export default TitleWidget;
