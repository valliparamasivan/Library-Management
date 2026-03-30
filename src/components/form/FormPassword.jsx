"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Controller } from "react-hook-form";

const FormPassword = ({ name, control, label, type = "text", placeholder = "", disabled = false, className = "", rules = {}, error = null }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="grid w-full items-center gap-1.5 relative">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <>
            <div className="relative">
              <Input
                {...field}
                id={name}
                type={isPassword && !showPassword ? "password" : "text"}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(className, (error || fieldState.invalid) && "border-red-600")}
              />
              {isPassword && (
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
            {(error || fieldState.error) && <p className="font-medium text-red-600 relative mt-1 text-xs ms-4">{error || fieldState.error?.message}</p>}
          </>
        )}
      />
    </div>
  );
};

export default FormPassword;
