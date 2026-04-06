"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "nextjs-toploader/app";
import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Two from "@/assets/image/login.png";
import logo from "@/assets/image/sub_logo 1.png";
import { useErrorHandler } from "@/components/custom-hooks/useErrorHandler";
import usePermissions from "@/components/custom-hooks/usePermissions";
import FormInput from "@/components/form/FormInput";
import FormPassword from "@/components/form/FormPassword";
import FormWrapper from "@/components/form/FormWrapper";
import ButtonWidget from "@/components/widgets/ButtonWidget";
import ImageWidget from "@/components/widgets/ImageWidget";
import LinkWidget from "@/components/widgets/LinkWidget";
import { signInSchema } from "@/helpers/ValidationHelpers";
import { useLogin } from "@/store/hooks/AuthHooks";
import { getFirstAccessibleRoute } from "@/helpers/PermissionRoutes";
import { fetchMyPermissions } from "@/store/services/PermissionServices";
import Arrow from "@/assets/icons/22.svg";

const STORAGE_KEY = "savedCredentials";

const saveCredentials = (email, password) => {
  try {
    const credentials = {
      email: btoa(email),
      password: btoa(password),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
  } catch (error) {
    console.error("Failed to save credentials:", error);
  }
};

const loadCredentials = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    const credentials = JSON.parse(saved);
    if (credentials?.email && credentials?.password) {
      return {
        email: atob(credentials.email),
        password: atob(credentials.password),
      };
    }
  } catch (_error) {
    localStorage.removeItem(STORAGE_KEY);
  }
  return null;
};

const clearCredentials = () => {
  localStorage.removeItem(STORAGE_KEY);
};

const LoginSection = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { permissions: sessionPerms, isLoading: permsLoading } = usePermissions();
  const hasRedirected = useRef(false);
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { showSuccessToast, showErrorToast, setFieldError } =
    useErrorHandler(setError);
  const { mutateAsync } = useLogin();
  const rememberMe = watch("rememberMe");
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
          if (data.rememberMe) {
            saveCredentials(data.email, data.password);
          } else {
            clearCredentials();
          }

          showSuccessToast("Logged in successfully!!!");
          hasRedirected.current = true;

          let targetRoute = "/dashboard";
          if (role !== "User") {
            try {
              const permResponse = await fetchMyPermissions();
              const perms = permResponse?.data || [];
              targetRoute = perms.length > 0 ? getFirstAccessibleRoute(perms) : "/dashboard";
            } catch (_) {
              targetRoute = "/dashboard";
            }
          } else {
            targetRoute = "/customer-dashboard";
          }
          router.push(targetRoute);
        } else {
          showErrorToast(result?.error ?? "Login failed");
        }
      } catch (error) {
        setFieldError(error);
      }
    },
    [mutateAsync, router, showSuccessToast, showErrorToast, setFieldError],
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      const saved = loadCredentials();
      if (saved) {
        setValue("email", saved.email);
        setValue("password", saved.password);
        setValue("rememberMe", true);
      }
    }
  }, [setValue, status]);

  useEffect(() => {
    if (!rememberMe && status === "unauthenticated") {
      clearCredentials();
    }
  }, [rememberMe, status]);

  useEffect(() => {
    if (hasRedirected.current) return;
    if (status === "authenticated" && session && !permsLoading) {
      if (session?.user?.role && session?.user?.role !== "User") {
        hasRedirected.current = true;
        const target = sessionPerms.length > 0 ? getFirstAccessibleRoute(sessionPerms) : "/dashboard";
        router.push(target);
      }
    }
  }, [status, session, router, sessionPerms, permsLoading]);

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-10 min-h-screen">
          <div className="w-full max-w-sm space-y-4 sm:space-y-6">
            <div className="flex justify-center mb-6 sm:mb-8">
              <ImageWidget src={logo} alt="Logo" className="h-8 sm:h-10 md:h-20 w-auto mx-auto" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2D3748] text-left mb-6 sm:mb-8">Login</h1>
            <div className="space-y-4 sm:space-y-5">
              <FormInput
                label="Email"
                name="email"
                control={control}
                type="email"
                placeholder="Enter your Email"
                autoComplete="off"
                
              />
              <FormPassword
                label="Password"
                name="password"
                control={control}
                type="password"
                placeholder="Enter your Password"
               className="min-h-[44px]"
               autoComplete="off"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end mb-4 sm:mb-6 gap-3 sm:gap-4">
              <LinkWidget href="/forgot-password" className="text-[#2D3748] hover:text-[#1A202C] text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 underline">
                Forgot Password?
              </LinkWidget>
            </div>
            <ButtonWidget
              type="submit"
              disabled={isSubmitting || !isFormFilled}
              loader={isSubmitting}
              className={`w-full h-11 sm:h-12 text-white rounded-md font-medium text-sm sm:text-base mb-4 sm:mb-6 flex items-center justify-center gap-2 ${!isFormFilled || isSubmitting ? "bg-[#807F94] hover:bg-[#807F94]/100" : "bg-[#00796B] hover:bg-[#00796B]/80"}`}
            >
           <ImageWidget src={Arrow} alt="Arrow" className="w-2 h-2 sm:w-4 sm:h-4" />
              {isSubmitting ? "Logging in..." : "Login"}
            </ButtonWidget>
          </div>
        </div>
        <div className="hidden md:flex w-1/2 relative h-screen">
          <ImageWidget
            src={Two}
            alt="Airplane"
            className="object-cover object-center md:object-right w-full h-full"
          />
        </div>
      </div>
    </FormWrapper>
  );
};

export default LoginSection;
