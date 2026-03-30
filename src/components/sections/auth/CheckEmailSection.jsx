"use client";

import Two from "@/assets/image/login.png";
import logo from "@/assets/image/sub_logo 1.png";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import ImageWidget from "@/components/widgets/ImageWidget";
import LinkWidget from "@/components/widgets/LinkWidget";
import { useRouter } from "nextjs-toploader/app";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useErrorHandler } from "@/components/custom-hooks/useErrorHandler";
import { useForgotPassword } from "@/store/hooks/AuthHooks";

const CheckEmailSection = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
    const [isResending, setIsResending] = useState(false);
    const { mutateAsync: forgotPasswordMutation } = useForgotPassword();
    const { showSuccessToast, showErrorToast } = useErrorHandler();

    const handleDone = () => {
        router.push("/sign-in");
    };

    const handleResend = async () => {
        if (!email || isResending) return;
        
        setIsResending(true);
        try {
            const response = await forgotPasswordMutation({
                email,
                userType: "Emp",
            });
            if (response?.statusCode === 200) {
                showSuccessToast(response.message || "Reset link sent successfully!");
            } else {
                showErrorToast(response?.error || "Failed to send reset link");
            }
        } catch (error) {
            showErrorToast("Failed to send reset link. Please try again.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
            <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-10 min-h-screen">
                <div className="w-full max-w-sm space-y-4 sm:space-y-6">
                    <div className="flex justify-center mb-6 sm:mb-8">
                        <ImageWidget src={logo} alt="Logo" className="h-8 sm:h-10 md:h-20 w-auto mx-auto" />
                    </div>
                    <div className="flex justify-center mb-4 sm:mb-6">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#00796B] rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-[#2D3748] text-center">Check your Email</h1>
                    <p className="text-xs sm:text-sm text-[#718096] text-center pb-2">
                        We've sent password reset instructions to
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-[#2D3748] text-center pb-4 sm:pb-6 break-all">
                        {email}
                    </p>
                    <ButtonWidget
                        type="button"
                        onClick={handleDone}
                        className="w-full h-11 sm:h-12 bg-[#00796B] hover:bg-[#00796B]/80 text-white rounded-lg font-medium text-sm sm:text-base mb-4 sm:mb-6 flex items-center justify-center"
                    >
                        Done
                    </ButtonWidget>
                    <div className="flex justify-center">
                        <p className="text-xs sm:text-sm text-[#718096] text-center">
                            Didn't receive the email?{" "}
                            <button
                                onClick={handleResend}
                                disabled={isResending}
                                className={`font-medium underline ${isResending ? "text-[#718096] cursor-not-allowed" : "text-[#00796B] hover:text-[#00796B]/80"}`}
                            >
                                {isResending ? "Sending..." : "Resend"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
            <div className="hidden md:flex w-1/2 relative h-screen">
                <ImageWidget
                    src={Two}
                    alt="Library"
                    className="object-cover object-center md:object-right w-full h-full"
                />
            </div>
        </div>
    );
};

export default CheckEmailSection;
