"use client";

import Two from "@/assets/image/login.png";
import logo from "@/assets/image/sub_logo 1.png";
import FormInput from "@/components/form/FormInput";
import FormWrapper from "@/components/form/FormWrapper";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import ImageWidget from "@/components/widgets/ImageWidget";
import LinkWidget from "@/components/widgets/LinkWidget";
import { forgotPasswordSchema } from "@/helpers/ValidationHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "nextjs-toploader/app";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useErrorHandler } from "@/components/custom-hooks/useErrorHandler";
import { useForgotPassword } from "@/store/hooks/AuthHooks";

const ForgotPasswordSection = () => {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
        setError,
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        mode: "onSubmit",
        defaultValues: {
            email: "",
        },
    });

    const { showSuccessToast, showErrorToast, setFieldError } =
        useErrorHandler(setError);
    const { mutateAsync: forgotPasswordMutation } = useForgotPassword();

    const onSubmit = useCallback(
        async (data) => {
            try {
                const response = await forgotPasswordMutation({
                    ...data,
                    userType: "Emp",
                });
                if (response?.statusCode === 200) {
                    showSuccessToast(response.message);
                    router.push(`/check-email?email=${encodeURIComponent(data.email)}`);
                } else {
                    showErrorToast(response?.error);
                }
            } catch (error) {
                setFieldError(error);
            }
        },
        [
            forgotPasswordMutation,
            router,
            showSuccessToast,
            showErrorToast,
            setFieldError,
        ],
    );

    return (
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
            <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
                <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-10 min-h-screen">
                    <div className="w-full max-w-sm space-y-4 sm:space-y-6">
                        <div className="flex justify-center mb-6 sm:mb-8">
                            <ImageWidget src={logo} alt="Logo" className="h-8 sm:h-10 md:h-20 w-auto mx-auto" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-semibold text-[#2D3748] text-center">Forgot Password?</h1>
                        <p className="text-xs sm:text-sm text-[#718096] text-center pb-4 sm:pb-6">
                            No worries! Enter your email address and we'll send you instructions to reset your password.
                        </p>
                        <div className="space-y-4 sm:space-y-5">
                            <FormInput
                                label="Email"
                                name="email"
                                control={control}
                                type="email"
                                placeholder="Enter your email address"
                                className="h-11 sm:h-12 border-[#E2E8F0] rounded-lg bg-white text-[#4A5568] placeholder:text-[#A0AEC0]"
                            />
                        </div>
                        <ButtonWidget
                            type="submit"
                            disabled={isSubmitting}
                            loader={isSubmitting}
                            className="w-full h-11 sm:h-12 bg-[#00796B] hover:bg-[#00796B]/80 text-white rounded-lg font-medium text-sm sm:text-base mb-4 sm:mb-6 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? "Sending..." : "Sent Reset Link"}
                        </ButtonWidget>
                        <div className="flex justify-center">
                            <LinkWidget href="/sign-in" className="text-[#00796B] hover:text-[#00796B]/80 text-xs sm:text-sm font-medium">
                                Back to Login
                            </LinkWidget>
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
        </FormWrapper>
    );
};

export default ForgotPasswordSection;
