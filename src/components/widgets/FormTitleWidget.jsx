"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const FormTitleWidget = ({
  title,
  onBack,
  showBack = true,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (typeof onBack === "function") {
      onBack();
      return;
    }
    router.back();
  };

  return (
    <div className="flex items-center gap-3 ">
      {showBack && <ArrowLeft className="h-5 w-5 cursor-pointer" onClick={handleBack} />}
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
    </div>
  );
};

export default FormTitleWidget;


