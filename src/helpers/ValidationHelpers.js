import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

export const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
});

export const changePasswordSchema = z.object({
  newPassword: z.string().min(1, "New Password is required").min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Confirm Password is required"),
}).refine((data) => data.confirmPassword === data.newPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const BookInventorySchema = z.object({
  image: z.any().optional(),
  isbn: z.string().min(1, "ISBN is required"),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  subject: z.string().min(1, "Subject is required"),
  language: z.string().min(1, "Language is required"),
  description: z.string().optional(),
  bookCategory: z.string().min(1, "Book Category is required"),
  bookType: z.string().min(1, "Book Type is required"),
  publisher: z.string().min(1, "Publisher is required"),
  year: z.string().min(1, "Year is required"),
});

export const RoleFormSchema = z.object({
  roleName: z
    .string()
    .min(1, "Role Name is required")
    .regex(/^[A-Za-z\s]+$/, "Role Name must contain letters only"),
  status: z.union([z.boolean(), z.number()]).optional(),
  viewDashboard: z.boolean().optional(),
  viewBooks: z.boolean().optional(),
  addBook: z.boolean().optional(),
  editBook: z.boolean().optional(),
  deleteBook: z.boolean().optional(),
  manageRFID: z.boolean().optional(),
  issueBook: z.boolean().optional(),
  returnBook: z.boolean().optional(),
  renewBook: z.boolean().optional(),
  useScanner: z.boolean().optional(),
  viewSettings: z.boolean().optional(),
  editSettings: z.boolean().optional(),
  deleteSettings: z.boolean().optional(),
  viewReports: z.boolean().optional(),
  editReports: z.boolean().optional(),
  deleteReports: z.boolean().optional(),
  viewTransactions: z.boolean().optional(),
  actionTransactions: z.boolean().optional(),
  loansReturnBook: z.boolean().optional(),
  loansRenewBook: z.boolean().optional(),
  quickLinks: z.boolean().optional(),
  inventory: z.boolean().optional(),
  loanList: z.boolean().optional(),
  userList: z.boolean().optional(),
  addUser: z.boolean().optional(),
  addLocation: z.boolean().optional(),
  exportReports: z.boolean().optional(),
  activityLog: z.boolean().optional(),
  exportActivityLog: z.boolean().optional(),
});

export const PolicyFormSchema = z.object({
  policyName: z
    .string()
    .min(1, "Policy Name is required")
    .regex(/^[A-Za-z\s]+$/, "Policy Name must contain letters only"),
  maxBooksAllowed: z.union([z.string(), z.number()]).refine((val) => {
    const numVal = typeof val === 'string' ? parseFloat(val) : val;
    return !isNaN(numVal) && numVal > 0;
  }, "Max Books is required"),
  loanPeriodDays: z.union([z.string(), z.number()]).refine((val) => {
    const numVal = typeof val === 'string' ? parseFloat(val) : val;
    return !isNaN(numVal) && numVal > 0;
  }, "Loan Period is required"),
  finePerDay: z.union([z.string(), z.number()]).refine((val) => {
    if (typeof val === 'string') {
      const numVal = parseFloat(val.replace(/[^0-9.]/g, ''));
      return !isNaN(numVal) && numVal >= 0;
    }
    return !isNaN(val) && val >= 0;
  }, "Fine Amount is required"),
  maxRenewalPerBook: z.union([z.string(), z.number()]).refine((val) => {
    const numVal = typeof val === 'string' ? parseFloat(val) : val;
    return !isNaN(numVal) && numVal > 0;
  }, "Maximum Renewals is required"),
  reservationLimit: z.union([z.string(), z.number()]).optional().refine((val) => {
    if (val === "" || val === undefined || val === null) return true;
    const numVal = typeof val === 'string' ? parseFloat(val) : val;
    return !isNaN(numVal) && numVal >= 0;
  }, "Must be a valid number"),
  reservationHoldPeriodDays: z.union([z.string(), z.number()]).optional().refine((val) => {
    if (val === "" || val === undefined || val === null) return true;
    const numVal = typeof val === 'string' ? parseFloat(val) : val;
    return !isNaN(numVal) && numVal >= 0;
  }, "Must be a valid number"),
  active: z.union([z.boolean(), z.number()]).optional(),
});


export const LocationFormSchema = z.object({
  section: z
    .string()
    .min(1, "Section is required")
    .regex(/^[A-Za-z\s]+$/, "Section Name must contain letters only"),
  shelf: z
    .string()
    .min(1, "Shelf is required"),
  row: z
    .string()
    .min(1, "Row is required"),
  status: z.union([z.boolean(), z.number()]).optional(),
});

export const UserFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  mobile: z.string().min(1, "Mobile is required").regex(/^[0-9]+$/, "Mobile must contain only numbers"),
  policy: z.string().min(1, "Policy is required"),
  profileImage: z.any().optional(),
});

export const AssignLocationSchema = z.object({
  sectionId: z.string().min(1, "Section is required"),
  shelfId: z.string().min(1, "Shelf is required"),
  rowId: z.string().min(1, "Row is required"),
});

export const EmployeeFormSchema = z.object({
  employeeName: z.string().min(1, "Employee Name is required"),
  email: z.string().email("Please enter a valid email address"),
  mobile: z.string().min(1, "Mobile is required").regex(/^[0-9]{10}$/, "Mobile must be 10 digits"),
  role: z.string().min(1, "Role is required"),
  status: z.union([z.boolean(), z.number()]).optional(),
  profileImage: z.any().optional(),
  createPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
});

export const CategoryFormSchema = z.object({
  category: z.string().min(1, "Category is required"),
});

export const BookTypeFormSchema = z.object({
  bookType: z.string().min(1, "Book Type is required"),
});

export const LanguageFormSchema = z.object({
  language: z.string().min(1, "Language is required"),
});