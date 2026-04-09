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
import { useCallback } from "react";
import { customerRegistrationSchema } from "@/helpers/CustomerValidationHelpers";
import { useCustomerRegister, useCustomerLogin } from "@/store/customerHooks/AuthHooks";
import { useErrorHandler } from "@/components/custom-hooks/useErrorHandler";

export const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(customerRegistrationSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { showSuccessToast, showErrorToast, setFieldError } =
    useErrorHandler(setError);
  const { mutateAsync: registerCustomer } = useCustomerRegister();
  const { mutateAsync: loginCustomer } = useCustomerLogin();

  const name = watch("name");
  const email = watch("email");
  const mobile = watch("mobile");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const isFormFilled =
    name && email && mobile && password && confirmPassword &&
    name.trim() !== "" && email.trim() !== "" && mobile.trim() !== "" &&
    password.trim() !== "" && confirmPassword.trim() !== "";

  const onSubmit = useCallback(
    async (data) => {
      try {
        await registerCustomer({
          userName: data.name.trim(),
          email: data.email.trim(),
          phoneNumber: data.mobile.trim(),
          password: data.password,
        });
      } catch (error) {
        // Registration itself failed — surface the server message both inline
        // (against the most relevant field) and as a toast so the user can't
        // miss it. Falls back gracefully when the error has no structured body.
        const serverMessage =
          error?.data?.message ||
          error?.data?.errorMessages?.ServiceException?.[0] ||
          error?.message ||
          "Registration failed. Please try again.";
        const lower = serverMessage.toLowerCase();

        if (lower.includes("email") && lower.includes("already")) {
          setError("email", { type: "server", message: serverMessage });
        } else if ((lower.includes("phone") || lower.includes("mobile")) && lower.includes("already")) {
          setError("mobile", { type: "server", message: serverMessage });
        } else if (lower.includes("password")) {
          setError("password", { type: "server", message: serverMessage });
        } else {
          // Let useErrorHandler map any structured field errors as a fallback.
          setFieldError(error);
        }
        showErrorToast(serverMessage);
        return;
      }

      // Auto-login after successful registration so the user lands on the
      // customer dashboard already authenticated. Failures here don't undo the
      // registration — fall back to the login modal with a clear toast.
      try {
        const loginResponse = await loginCustomer({
          email: data.email.trim(),
          password: data.password,
        });

        const token = loginResponse?.data?.token ?? loginResponse?.token;
        const userName = loginResponse?.data?.userName ?? loginResponse?.userName;
        const role = loginResponse?.data?.role ?? loginResponse?.role;

        const result = await signIn("credentials", {
          userData: token,
          redirect: false,
          email: data.email.trim(),
          username: userName,
          role: role,
        });

        if (result?.ok) {
          showSuccessToast("Account created successfully!");
          onClose();
          router.push("/customer-dashboard");
          return;
        }

        // signIn returned not-ok — show why, then fall through to the login fallback.
        showErrorToast(result?.error || "Signed up, but auto sign-in failed. Please log in.");
      } catch (loginErr) {
        const loginMessage =
          loginErr?.data?.message || loginErr?.message ||
          "Account created, but we couldn't sign you in automatically. Please log in.";
        showErrorToast(loginMessage);
      }

      onClose();
      if (onSwitchToLogin) onSwitchToLogin();
    },
    [registerCustomer, loginCustomer, router, showSuccessToast, showErrorToast, setFieldError, setError, onClose, onSwitchToLogin],
  );

  const handleSignInClick = () => {
    onClose();
    if (onSwitchToLogin) onSwitchToLogin();
  };

  return (
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
                Create Account
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Join the library to borrow, reserve, and track your reads
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-4 px-2 sm:px-4 pb-4 sm:pb-6">
              <FormInput
                name="name"
                control={control}
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                className="h-11 sm:h-12 border-gray-300 focus:border-[#0B63CE] focus:ring-[#0B63CE] text-sm sm:text-base"
              />

              <FormInput
                name="email"
                control={control}
                label="Email"
                type="email"
                placeholder="Enter your email address"
                className="h-11 sm:h-12 border-gray-300 focus:border-[#0B63CE] focus:ring-[#0B63CE] text-sm sm:text-base"
              />

              <FormInput
                name="mobile"
                control={control}
                label="Mobile Number"
                type="tel"
                placeholder="10-digit mobile number"
                className="h-11 sm:h-12 border-gray-300 focus:border-[#0B63CE] focus:ring-[#0B63CE] text-sm sm:text-base"
              />

              <FormPassword
                name="password"
                control={control}
                label="Password"
                placeholder="Choose a password"
                className="h-11 sm:h-12 border-gray-300 focus:border-[#0B63CE] focus:ring-[#0B63CE] text-sm sm:text-base"
              />

              <FormPassword
                name="confirmPassword"
                control={control}
                label="Confirm Password"
                placeholder="Re-enter your password"
                className="h-11 sm:h-12 border-gray-300 focus:border-[#0B63CE] focus:ring-[#0B63CE] text-sm sm:text-base"
              />

              <Button
                type="submit"
                disabled={isSubmitting || !isFormFilled}
                className={`w-full h-11 sm:h-12 text-white font-semibold rounded-lg text-sm sm:text-base transition-colors ${
                  isFormFilled && !isSubmitting
                    ? "bg-[#0B63CE] hover:bg-[#1565C0]"
                    : "bg-gray-600 hover:bg-gray-700 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? "Creating account..." : "Create Account"}
              </Button>

              <p className="text-center text-xs sm:text-sm text-gray-600 pt-2">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={handleSignInClick}
                  className="text-[#0B63CE] hover:text-[#1565C0] font-medium cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
