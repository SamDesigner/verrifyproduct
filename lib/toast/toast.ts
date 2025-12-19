import Swal from "sweetalert2";

export const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  iconColor: "#a855f7", // purple (matches your UI)
  background: "#0f172a", // dark background
  color: "#f8fafc",
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const toastSuccess = (message: string) => {
  Toast.fire({
    icon: "success",
    title: message,
  });
};

/**
 * Error Toast
 */
export const toastError = (message: string) => {
  Toast.fire({
    icon: "error",
    title: message,
  });
};


/**
 * Info Toast
 */
export const toastInfo = (message: string) => {
  Toast.fire({
    icon: "info",
    title: message,
  });
};

/**
 * Warning Toast
 */
export const toastWarning = (message: string) => {
  Toast.fire({
    icon: "warning",
    title: message,
  });
};