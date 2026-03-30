"use client";

import { useCallback } from "react";
import { errorToast, successToast, setFieldErrors } from "@/helpers/ErrorHelpers";

export const useErrorHandler = (setErrorFn = null) => {
  const showErrorToast = useCallback((error, options = {}) => {
    errorToast(error, options);
  }, []);

  const showSuccessToast = useCallback((message, options = {}) => {
    successToast(message, options);
  }, []);

  const setFieldError = useCallback(
    (error) => {
      if (setErrorFn) {
        if (error?.errorMessages) {
          setFieldErrors(setErrorFn, error);
        } else if (error?.data?.errorMessages) {
          setFieldErrors(setErrorFn, error.data);
        }
      }
    },
    [setErrorFn],
  );

  return {
    showErrorToast,
    showSuccessToast,
    setFieldError,
  };
};

export default useErrorHandler;
