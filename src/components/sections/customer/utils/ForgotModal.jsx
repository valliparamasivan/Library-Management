"use client";

import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ImageWidget from "@/components/widgets/ImageWidget";
import FormInput from "@/components/form/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { SendLinkModal } from "../utils/SendLinkModal";
import userImage from "@/assets/image/Mask.png";
import { useCustomerForgotPassword } from "@/store/customerHooks/AuthHooks";
import { useErrorHandler } from "@/components/custom-hooks/useErrorHandler";
import { customerForgotPasswordSchema } from "@/helpers/CustomerValidationHelpers";

export const ForgotModal = ({ isOpen, onClose, onBackToLogin }) => {
  const [isSendLinkModalOpen, setIsSendLinkModalOpen] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const { mutateAsync } = useCustomerForgotPassword();
  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(customerForgotPasswordSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
    },
  });
  const { showSuccessToast, showErrorToast, setFieldError } = useErrorHandler(setError);

  const email = watch("email");
  const isFormFilled = email && email.trim() !== "";

  const onSubmit = async (data) => {
    try {
      const response = await mutateAsync({
        email: data.email,
        userType: "CUST"
      });
      showSuccessToast(response?.message || "Reset link sent successfully!");
      setSubmittedEmail(data.email);
      onClose();
      setIsSendLinkModalOpen(true);
    } catch (error) {
      showErrorToast(error?.message || "Failed to send email. Please try again.");
      setFieldError(error);
    }
  };

  const handleResend = async () => {
    if (!submittedEmail) return;

    try {
      setIsResending(true);
      const response = await mutateAsync({
        email: submittedEmail,
        userType: "CUST"
      });
      showSuccessToast(response?.message || "Reset link sent successfully!");
    } catch (error) {
      showErrorToast(error?.message || "Failed to resend email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="w-full p-0 gap-0 overflow-hidden max-w-[90vw] sm:max-w-md md:max-w-3xl mx-auto"
          hideClose={true}
        >
          <div className="flex flex-col md:flex-row h-full max-h-[90vh] sm:max-h-[95vh] relative">
            {/* Close button positioned at top-right of entire modal */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 p-1"
              aria-label="Close"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>

            {/* Left Section - Image */}
            <div className="hidden md:flex md:w-2/5 flex-col relative bg-white p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-[#0B63CE] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="font-bold text-lg text-gray-900">Library</span>
              </div>

              <div className="flex-1 relative min-h-[380px] rounded-lg overflow-hidden">
                <ImageWidget
                  src={userImage}
                  alt="User"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>

      
            <div className="w-full md:w-3/5 bg-white p-4 sm:p-6 md:p-6 flex flex-col relative overflow-y-auto">
              <div className="mb-8 sm:mb-6 mt-12 p-2 sm:p-4 pr-8 sm:pr-12 text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-4 sm:mb-2">
                  Forgot Password?
                </h2>
                <p className="text-gray-600 text-sm sm:text-base mt-6">
                  No worries! Enter your email address and we'll send you instructions to reset your password.
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

                <Button
                  type="submit"
                  disabled={isSubmitting || !isFormFilled}
                  className={`w-full h-11 sm:h-12 text-white font-semibold rounded-lg text-sm sm:text-base transition-colors ${
                    isFormFilled && !isSubmitting
                      ? "bg-[#0B63CE] hover:bg-[#1565C0]"
                      : "bg-gray-600 hover:bg-gray-700 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? "Sending..." : "Sent Reset Link"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onBackToLogin) {
                        onBackToLogin();
                      }
                    }}
                    className="text-sm sm:text-base text-[#0B63CE] hover:text-[#1565C0] transition-colors font-medium cursor-pointer"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <SendLinkModal
        isOpen={isSendLinkModalOpen}
        onClose={() => setIsSendLinkModalOpen(false)}
        email={submittedEmail}
        onResend={handleResend}
        isResending={isResending}
        onDone={() => {
          setIsSendLinkModalOpen(false);
        }}
      />
    </>
  );
};

export default ForgotModal;
