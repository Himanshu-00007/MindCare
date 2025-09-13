import React, { useEffect } from "react";
import { createPortal } from "react-dom";

type SnackbarProps = {
  message: string;
  type: "success" | "error";
  onClose: () => void;
};

const Snackbar: React.FC<SnackbarProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return createPortal(
    <div
      className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white transition-opacity duration-500 opacity-100 ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>,
    document.body
  );
};

export default Snackbar;
