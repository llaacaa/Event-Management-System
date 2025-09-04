import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

export const showToast = (message: string, type: "success" | "error") => {
  const $toast = useToast();
  if (type === "success") {
    $toast.success(message);
  } else {
    $toast.error(message);
  }
};
