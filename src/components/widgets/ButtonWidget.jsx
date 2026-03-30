"use client";
import { Loader2Icon } from "lucide-react";
import { RippleButton } from "../ui/ripple-button";

const ButtonWidget = ({ children, loader = true, disabled = false, ...props }) => {
  return (
    <RippleButton {...props} disabled={disabled}>
      {disabled && loader && <Loader2Icon className="animate-spin  cursor-pointer" />}
      {children}
    </RippleButton>
  );
};
export default ButtonWidget;
