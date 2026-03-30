"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const TooltipWidget = ({
  children,
  content,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  delayDuration = 0,
  className = "",
  contentClassName = "",
  disabled = false,
  ...props
}) => {
  if (disabled) {
    return children;
  }

  return (
    <Tooltip delayDuration={delayDuration} {...props}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} sideOffset={sideOffset} align={align} alignOffset={alignOffset} className={cn(contentClassName)}>
        {content}
      </TooltipContent>
    </Tooltip>
  );
};

export default TooltipWidget;
