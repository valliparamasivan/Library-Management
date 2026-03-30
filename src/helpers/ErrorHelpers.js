import { toast } from "sonner";

export const successToast = (message, options = {}) => {
  toast.success(message, {
    duration: 4000,
    ...options,
  });
};

export const errorToast = (error, options = {}) => {
  let message = "An unexpected error occurred";

  if (typeof error === "string") {
    message = error;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (error?.message) {
    message = error.message;
  } else if (error?.data?.message) {
    message = error.data.message;
  }

  toast.error(message, {
    duration: 5000,
    ...options,
  });
};

export const setFieldErrors = (setErrorFn, error) => {
  if (error?.errorMessages) {
    Object.keys(error.errorMessages).forEach((field) => {
      const fieldErrors = error.errorMessages[field];
      if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
        setErrorFn(field, {
          type: "server",
          message: fieldErrors[0],
        });
      }
    });
  }
};
