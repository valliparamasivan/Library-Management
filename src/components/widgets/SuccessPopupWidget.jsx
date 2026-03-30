"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import ButtonWidget from "@/components/widgets/ButtonWidget";

const SuccessPopupWidget = ({
  isOpen,
  onOpenChange,
  icon,
  title,
  subtitle,
  buttonText = "Done",
  onDone,
}) => {
  const handleDone = () => {
    onDone?.();
    onOpenChange?.(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        hideClose={false}
        className="w-[calc(100%-2rem)] sm:max-w-[400px] rounded-full p-0 gap-0 border border-gray-200 bg-white shadow-lg overflow-hidden"
      >
        <div className="flex flex-col items-center text-center pt-8 pb-6 px-6">
          {icon && (
            <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center flex-shrink-0 mb-4 [&>svg]:w-8 [&>svg]:h-8 [&>svg]:text-[#00796B] [&>svg]:stroke-[1.5]">
              {icon}
            </div>
          )}
          {(title || subtitle) && (
            <div className="space-y-0.5 mb-3">
              {title && <p className="text-base font-medium text-[#0F172B] leading-tight mb-2">{title}</p>}
              {subtitle && <p className="text-base font-medium text-[#0F172B] leading-tight">{subtitle}</p>}
            </div>
          )}
        </div>
        <div className=" px-6 pb-6 pt-4 bg-[#F8FAFC]">
          <ButtonWidget
            type="button"
            onClick={handleDone}
            className="w-full h-11 rounded-lg bg-[#00796B] hover:bg-[#00695C] text-white font-medium"
          >
            {buttonText}
          </ButtonWidget>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessPopupWidget;
