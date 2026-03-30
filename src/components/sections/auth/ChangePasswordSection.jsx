"use client";

import Two from "@/assets/image/login.png";
import logo from "@/assets/image/sub_logo 1.png";
import FormPassword from "@/components/form/FormPassword";
import FormWrapper from "@/components/form/FormWrapper";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import ImageWidget from "@/components/widgets/ImageWidget";
import { changePasswordSchema } from "@/helpers/ValidationHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "nextjs-toploader/app";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useErrorHandler } from "@/components/custom-hooks/useErrorHandler";
import { useKeyValidation, useResetPassword } from "@/store/hooks/AuthHooks";

const ChangePasswordSection = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const key = searchParams.get("key");
    const [isKeyValid, setIsKeyValid] = useState(false);
    const [isValidating, setIsValidating] = useState(true);
    const [progress, setProgress] = useState(0);

    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
        setError,
    } = useForm({
        resolver: zodResolver(changePasswordSchema),
        mode: "onSubmit",
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    const { showSuccessToast, showErrorToast, setFieldError } =
        useErrorHandler(setError);
    const { mutateAsync: setPassword } = useResetPassword();
    const { mutateAsync: validateKey, isPending: isValidatingKey } = useKeyValidation();

    useEffect(() => {
        let progressInterval;
        
        const validateSecretKey = async () => {
            if (!key) {
                setIsKeyValid(true);
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

    const onSubmit = useCallback(
        async (data) => {
            try {
                const payload = key
                    ? {
                          resetKey: key,
                          password: data.newPassword,
                          confirmPassword: data.confirmPassword,
                      }
                    : {
                          password: data.newPassword,
                          confirmPassword: data.confirmPassword,
                      };
                const response = await setPassword(payload);
                if (response?.statusCode === 200) {
                    showSuccessToast(response.message);
                    router.push("/sign-in");
                } else {
                    showErrorToast(response?.error);
                }
            } catch (error) {
                setFieldError(error);
            }
        },
        [key, setPassword, router, showSuccessToast, showErrorToast, setFieldError],
    );

    if (isValidating || isValidatingKey) {
        return (
            <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
                <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-10 min-h-screen">
                    <div className="w-full max-w-sm space-y-4 sm:space-y-6">
                        <div className="flex justify-center mb-6 sm:mb-8">
                            <ImageWidget src={logo} alt="Logo" className="h-8 sm:h-10 md:h-20 w-auto mx-auto" />
                        </div>
                        <div className="flex flex-col items-center gap-4 w-full">
                            <p className="text-[#2D3748] text-sm sm:text-base font-medium">Loading...</p>
                            <div className="w-full bg-[#E2E8F0] rounded-full h-4">
                                <div
                                    className="h-4 rounded-full transition-all duration-300 bg-[#00796B]"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="text-sm text-[#718096]">{progress}%</span>
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
    }

    if (!isKeyValid && key) {
        const handleBackToSignIn = () => {
            router.push("/sign-in");
        };

        return (
            <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
                <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-10 min-h-screen">
                    <div className="w-full max-w-sm space-y-4 sm:space-y-6">
                        <div className="flex justify-center mb-6 sm:mb-8">
                            <ImageWidget src={logo} alt="Logo" className="h-8 sm:h-10 md:h-20 w-auto mx-auto" />
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-[#2D3748] font-medium text-lg sm:text-xl text-center">Invalid or expired link</p>
                            <ButtonWidget
                                onClick={handleBackToSignIn}
                                type="button"
                                className="w-full h-11 sm:h-12 bg-[#00796B] hover:bg-[#00796B]/80 text-white rounded-lg font-medium text-sm sm:text-base"
                            >
                                Back to Sign In
                            </ButtonWidget>
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
    }

    return (
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
            <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
                <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-10 min-h-screen">
                    <div className="w-full max-w-sm space-y-4 sm:space-y-6">
                        <div className="flex justify-center mb-6 sm:mb-8">
                            <ImageWidget src={logo} alt="Logo" className="h-8 sm:h-10 md:h-20 w-auto mx-auto" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-semibold text-[#2D3748] text-center pb-4 sm:pb-6">Change Password</h1>
                        <div className="space-y-4 sm:space-y-5">
                            <FormPassword
                                label="New Password"
                                name="newPassword"
                                control={control}
                                type="password"
                                placeholder="Enter your new password"
                                className="h-11 sm:h-12 border-[#E2E8F0] rounded-lg bg-white text-[#4A5568] placeholder:text-[#A0AEC0]"
                            />
                            <FormPassword
                                label="Confirm Password"
                                name="confirmPassword"
                                control={control}
                                type="password"
                                placeholder="Confirm Password"
                                className="h-11 sm:h-12 border-[#E2E8F0] rounded-lg bg-white text-[#4A5568] placeholder:text-[#A0AEC0]"
                            />
                        </div>
                        <ButtonWidget
                            type="submit"
                            disabled={isSubmitting}
                            loader={isSubmitting}
                            className="w-full h-11 sm:h-12 bg-[#00796B] hover:bg-[#00796B]/80 text-white rounded-lg font-medium text-sm sm:text-base mb-4 sm:mb-6 flex items-center justify-center"
                        >
                            {isSubmitting ? "Updating..." : "Save Password"}
                        </ButtonWidget>
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

export default ChangePasswordSection;
