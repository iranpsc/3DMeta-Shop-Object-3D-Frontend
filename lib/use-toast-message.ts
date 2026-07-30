"use client";

import { useCallback, useEffect, useState } from "react";
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
  showWarningToast,
} from "@/components/ui/toast";

export type ToastMessageType = "success" | "error" | "warning" | "info";

/**
 * Shows a toast when `message` is truthy.
 * Pass a new `token` (or bump a counter) to re-fire the same message text.
 */
export function useToastMessage(
  message: string | null | undefined,
  type: ToastMessageType = "success",
  token = 0,
) {
  useEffect(() => {
    if (!message) return;

    switch (type) {
      case "success":
        showSuccessToast(message);
        break;
      case "error":
        showErrorToast(message);
        break;
      case "warning":
        showWarningToast(message);
        break;
      case "info":
        showInfoToast(message);
        break;
    }
  }, [message, type, token]);
}

/** State helper that bumps a token so repeating the same message still toasts. */
export function useToastState(type: ToastMessageType = "success") {
  const [message, setMessageState] = useState<string | null>(null);
  const [token, setToken] = useState(0);

  const setMessage = useCallback((next: string | null) => {
    setMessageState(next);
    if (next) setToken((t) => t + 1);
  }, []);

  useToastMessage(message, type, token);

  return { message, setMessage } as const;
}
