"use client";

import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import FormInput from "@/components/form/FormInput";
import FormPassword from "@/components/form/FormPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter } from "nextjs-toploader/app";
import { useState, useCallback } from "react";
import { ForgotModal } from "../utils/ForgotModal";
import { customerLoginSchema } from "@/helpers/CustomerValidationHelpers";
import { useCustomerLogin } from "@/store/customerHooks/AuthHooks";
import { useErrorHandler } from "@/components/custom-hooks/useErrorHandler";

export const LoginModal = ({ isOpen, onClose, onReopen }) => {
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(customerLoginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { showSuccessToast, showErrorToast, setFieldError } =
    useErrorHandler(setError);
  const { mutateAsync } = useCustomerLogin();

  const email = watch("email");
  const password = watch("password");
  const isFormFilled = email && password && email.trim() !== "" && password.trim() !== "";

  const onSubmit = useCallback(
    async (data) => {
      try {
        const response = await mutateAsync({
          email: data.email,
          password: data.password,
        });

        const token = response?.data?.token ?? response?.token;
        const userName = response?.data?.userName ?? response?.userName;
        const role = response?.data?.role ?? response?.role;

        const result = await signIn("credentials", {
          userData: token,
          redirect: false,
          email: data.email,
          username: userName,
          role: role,
        });

        if (result?.ok) {
          showSuccessToast("Logged in successfully!!!");
          onClose();
          router.push("/customer-dashboard");
        } else {
          showErrorToast(result?.error ?? "Login failed");
        }
      } catch (error) {
        setFieldError(error);
      }
    },
    [mutateAsync, router, showSuccessToast, showErrorToast, setFieldError, onClose],
  );

  const handleForgotPassword = () => {
    onClose();
    setIsForgotModalOpen(true);
  };

  const handleBackToLogin = () => {
    setIsForgotModalOpen(false);
    // Small delay to ensure smooth transition
    setTimeout(() => {
      if (onReopen) {
        onReopen();
      }
    }, 100);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="w-full p-0 gap-0 overflow-hidden max-w-[90vw] sm:max-w-md md:max-w-4xl mx-auto"
          hideClose={true}
        >
          <div className="flex flex-col md:flex-row h-full max-h-[90vh] sm:max-h-[95vh]">
            <div className="hidden md:flex md:w-2/5 flex-col relative bg-white p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-[#0B63CE] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="font-bold text-lg text-gray-900">Library</span>
              </div>

              <div className="flex-1 relative min-h-[380px] rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=1200&fit=crop"
                  alt="Library"
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            </div>

            <div className="w-full md:w-3/5 bg-white p-4 sm:p-6 md:p-6 flex flex-col relative overflow-y-auto">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 p-1"
                aria-label="Close"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>

              <div className="mb-4 sm:mb-6 mt-2 sm:mt-6 p-2 sm:p-4 pr-8 sm:pr-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Sign in to access your library account
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-4 sm:space-y-6 px-2 sm:px-4 pb-4 sm:pb-6">
                <FormInput
                  name="email"
                  control={control}
                  label="Email"
                  type="email"
                  placeholder="Enter your email address"
                  className="h-11 sm:h-12 border-gray-300 focus:border-[#0B63CE] focus:ring-[#0B63CE] text-sm sm:text-base"
                />

                <FormPassword
                  name="password"
                  control={control}
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  className="h-11 sm:h-12 border-gray-300 focus:border-[#0B63CE] focus:ring-[#0B63CE] text-sm sm:text-base"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs sm:text-sm text-[#0B63CE] hover:text-[#1565C0] transition-colors font-medium cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !isFormFilled}
                  className={`w-full h-11 sm:h-12 text-white font-semibold rounded-lg text-sm sm:text-base transition-colors ${
                    isFormFilled && !isSubmitting
                      ? "bg-[#0B63CE] hover:bg-[#1565C0]"
                      : "bg-gray-600 hover:bg-gray-700 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <ForgotModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        onBackToLogin={handleBackToLogin}
      />
    </>
  );
};
