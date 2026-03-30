import { z } from "zod";

export const customerLoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export const customerForgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
});

export const customerChangePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(1, "New Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must not exceed 100 characters"),
  confirmPassword: z.string().min(1, "Confirm Password is required"),
}).refine((data) => data.confirmPassword === data.newPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const customerRegistrationSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  mobile: z.string().min(1, "Mobile is required").regex(/^[0-9]{10}$/, "Mobile must be 10 digits"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Confirm Password is required"),
}).refine((data) => data.confirmPassword === data.password, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const customerProfileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Please enter a valid email address").optional(),
  mobile: z.string().regex(/^[0-9]{10}$/, "Mobile must be 10 digits").optional(),
  address: z.string().optional(),
});
