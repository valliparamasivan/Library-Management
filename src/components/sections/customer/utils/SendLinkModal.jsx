"use client";

import { X, CircleCheckBig } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ImageWidget from "@/components/widgets/ImageWidget";
import { useRouter } from "nextjs-toploader/app";
import userImage from "@/assets/image/Mask.png";

export const SendLinkModal = ({ isOpen, onClose, email = "admincorpfield@gmail.com", onResend, onDone, isResending = false }) => {
  const router = useRouter();

  const handleDone = () => {
    if (onDone) {
      onDone();
    }
    onClose();
    router.push("/home");
  };

  const handleResend = () => {
    if (onResend) {
      onResend();
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
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 p-1"
              aria-label="Close"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>

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
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-10 h-10 sm:w-24 sm:h-24 rounded-full bg-[#00A8841A] flex items-center justify-center">
                  <CircleCheckBig className="w-6 h-6 sm:w-12 sm:h-12 text-[#00A884]" />
                </div>

                <h2 className="text-xl sm:text-2xl md:text-2xl font-semibold text-gray-900">
                  Check your Email
                </h2>

                <div className="space-y-2">
                  <p className="text-gray-600 text-sm sm:text-base">
                    We've sent password reset instructions to
                  </p>
                  <p className="text-gray-900 text-base sm:text-md font-semibold">
                    {email}
                  </p>
                </div>

                <div className="w-full max-w-md space-y-4 pt-4">
                  <Button
                    onClick={handleDone}
                    className="w-full h-11 sm:h-12 text-white font-semibold rounded-lg text-sm sm:text-base bg-[#0B63CE] hover:bg-[#1565C0] transition-colors"
                  >
                    Done
                  </Button>

                  <div className="text-center">
                    <span className="text-sm sm:text-base text-gray-600">
                      Didn't receive the email?{" "}
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending}
                        className={`transition-colors font-medium ${
                          isResending
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-[#0B63CE] hover:text-[#1565C0] cursor-pointer"
                        }`}
                      >
                        {isResending ? "Resending..." : "Resend"}
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SendLinkModal;
