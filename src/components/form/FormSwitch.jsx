"use client";
import { cn } from "@/lib/utils";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const FormSwitch = ({ name, control, label, disabled = false, className = "", rules = {}, error = null, labelclassName = "", switchPosition = "left" }) => {
  return (
    <div className="grid items-center gap-1.5">
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <>
            {(() => {
              const isVertical = switchPosition === "top" || switchPosition === "bottom";
              const containerClass = isVertical ? "flex flex-col items-start space-y-3" : "flex items-center space-x-2";
              const renderSwitch = (
                <Switch
                  id={name}
                  checked={!!field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked ? 1 : 0);
                  }}
                  disabled={disabled}
                  className={cn(className, (error || fieldState.invalid) && "border-destructive")}
                />
              );
              const renderLabel = (
                <div className="grid gap-1.5 leading-none">
                  {label && (
                    <Label htmlFor={name} className={cn("cursor-pointer", labelclassName)}>
                      {label}
                    </Label>
                  )}
                </div>
              );

              const isSwitchFirst = switchPosition === "left" || switchPosition === "top";

              return (
                <div className={containerClass}>
                  {isSwitchFirst ? (
                    <>
                      {renderSwitch}
                      {renderLabel}
                    </>
                  ) : (
                    <>
                      {renderLabel}
                      {renderSwitch}
                    </>
                  )}
                </div>
              );
            })()}
            {(error || fieldState.error) && <p className="font-medium mt-1 text-xs text-destructive">{error || fieldState.error?.message}</p>}
          </>
        )}
      />
    </div>
  );
};

export default FormSwitch;
