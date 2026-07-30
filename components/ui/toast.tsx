"use client";

import Swal from "sweetalert2";

export type ToastType = "success" | "error" | "warning" | "info";

type ToastOptions = {
  type?: ToastType;
  duration?: number;
};

const toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    popup: "swal2-toast-rtl",
  },
  didOpen: (popup) => {
    popup.addEventListener("mouseenter", Swal.stopTimer);
    popup.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export function showToast(message: string, options: ToastOptions = {}) {
  const { type = "success", duration = 3000 } = options;

  return toast.fire({
    icon: type,
    title: message,
    timer: duration,
  });
}

export function showSuccessToast(message: string, duration?: number) {
  return showToast(message, { type: "success", duration });
}

export function showErrorToast(message: string, duration?: number) {
  return showToast(message, { type: "error", duration });
}

export function showWarningToast(message: string, duration?: number) {
  return showToast(message, { type: "warning", duration });
}

export function showInfoToast(message: string, duration?: number) {
  return showToast(message, { type: "info", duration });
}
