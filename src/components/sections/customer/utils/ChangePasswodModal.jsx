"use client";

import { Button } from "@/components/ui/button";
import ImageWidget from "@/components/widgets/ImageWidget";
import FormPassword from "@/components/form/FormPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import userImage from "@/assets/image/Mask.png";
import { useCustomerChangePassword, useCustomerValidateSecurityKey } from "@/store/customerHooks/AuthHooks";
import { useErrorHandler } from "@/components/custom-hooks/useErrorHandler";
import { customerChangePasswordSchema } from "@/helpers/CustomerValidationHelpers";

const ChangePasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const [isKeyValid, setIsKeyValid] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [progress, setProgress] = useState(0);

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(customerChangePasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutateAsync: changePassword, isPending } = useCustomerChangePassword();
  const { mutateAsync: validateKey, isPending: isValidatingKey } = useCustomerValidateSecurityKey();
  const { showSuccessToast, showErrorToast, setFieldError } = useErrorHandler(setError);

  useEffect(() => {
    let progressInterval;
    
    const validateSecretKey = async () => {
      if (!key) {
        setIsKeyValid(false);
        setIsValidating(false);
        return;
      }
      setProgress(0);
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      try {
        await validateKey({ resetKey: key });
        setProgress(100);
        setTimeout(() => {
          setIsKeyValid(true);
          setIsValidating(false);
          if (progressInterval) {
            clearInterval(progressInterval);
          }
        }, 300);
      } catch (error) {
        if (progressInterval) {
          clearInterval(progressInterval);
        }
        setIsKeyValid(false);
        setIsValidating(false);
      }
    };

    validateSecretKey();

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [key, validateKey]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        resetKey: key,
        password: data.newPassword,
        confirmPassword: data.confirmPassword,
      };
      const response = await changePassword(payload);
      showSuccessToast(response?.message || "Password changed successfully!");
      router.push("/home");
    } catch (error) {
      let errorMessage = error?.data?.message;
      
      if (!errorMessage && error?.data?.errorMessages) {
        const errorMessages = error.data.errorMessages;
        const messages = [];
        Object.keys(errorMessages).forEach((field) => {
          const fieldErrors = errorMessages[field];
          if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
            messages.push(...fieldErrors);
          }
        });
        if (messages.length > 0) {
          errorMessage = messages.join(", ");
        }
      }
      
      // Check if error is related to invalid key
      const errorText = (errorMessage || error?.message || "").toLowerCase();
      if (errorText.includes("invalid key") || errorText.includes("key is invalid") || errorText.includes("expired key") || errorText.includes("secret key")) {
        setIsKeyValid(false);
        return;
      }
      
      showErrorToast(errorMessage || error?.message || "Failed to change password. Please try again.");
      setFieldError(error);
    }
  };

  if (isValidating || isValidatingKey) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="flex flex-col items-center gap-3 w-full max-w-md px-4">
          <p className="text-gray-700 text-sm font-medium">Validating security key...</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300 bg-gradient-to-r from-[#87CEEB] to-[#5BA3D0]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-gray-600">{progress}%</span>
        </div>
      </div>
    );
  }

  if (!isKeyValid) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-900 font-medium text-lg">Invalid or expired link</p>
          <Button
            onClick={() => router.push("/home")}
            type="button"
            variant="outline"
            className="bg-[#0B63CE] text-white hover:bg-[#1565C0]"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row bg-white overflow-hidden gap-0" style={{ height: 'calc(100vh - 5rem)', maxHeight: 'calc(100vh - 4.5rem)' }}>
      {/* Image Section - Responsive */}
      <div className="hidden md:flex md:w-1/2 flex-col items-end justify-center relative bg-white overflow-hidden">
        <div className="relative rounded-lg overflow-hidden w-full max-w-xs mr-0">
          <ImageWidget
            src={userImage}
            alt="User"
            className="object-contain rounded-lg w-full h-full"
            width={300}
            height={350}
          />
        </div>
      </div>

      {/* Form Section - Responsive */}
      <div className="w-full md:w-1/2 bg-white flex flex-col items-center md:items-start justify-center min-h-full px-4 sm:px-6 md:pl-6 md:pr-8 overflow-hidden py-4 md:py-0">
        <div className="max-w-md w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center md:text-left">
            Change Password
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <FormPassword
              name="newPassword"
              control={control}
              label="New Password"
              type="password"
              placeholder="Enter your new password"
              className="h-11 sm:h-12 border-gray-300 focus:border-[#0B63CE] focus:ring-[#0B63CE] text-sm sm:text-base"
            />

            <FormPassword
              name="confirmPassword"
              control={control}
              label="Confirm Password"
              type="password"
              placeholder="Confirm your new password"
              className="h-11 sm:h-12 border-gray-300 focus:border-[#0B63CE] focus:ring-[#0B63CE] text-sm sm:text-base"
            />

            <div className="space-y-2 pt-1">
              <Button
                type="submit"
                disabled={isSubmitting || isPending}
                className={`w-full h-11 sm:h-12 text-white font-semibold rounded-lg text-sm sm:text-base transition-colors ${
                  isSubmitting || isPending
                    ? "bg-gray-600 hover:bg-gray-700 cursor-not-allowed"
                    : "bg-[#0B63CE] hover:bg-[#1565C0]"
                }`}
              >
                {isSubmitting || isPending ? "Changing Password..." : "Change Password"}
              </Button>

              <Button
                type="button"
                onClick={() => router.push("/home")}
                variant="outline"
                className="w-full h-11 sm:h-12 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg text-sm sm:text-base transition-colors"
              >
                Back to Home
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
