"use client";

import Swal from "sweetalert2";

export type ConfirmDialogOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: "warning" | "question" | "info" | "error" | "success";
};

export async function confirmDialog({
  title = "تایید حذف",
  message,
  confirmLabel = "حذف",
  cancelLabel = "انصراف",
  icon = "warning",
}: ConfirmDialogOptions): Promise<boolean> {
  const result = await Swal.fire({
    title,
    text: message,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmLabel,
    cancelButtonText: cancelLabel,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#9ca3af",
    reverseButtons: true,
    focusCancel: true,
    customClass: {
      popup: "swal2-confirm-rtl",
    },
  });

  return result.isConfirmed;
}
