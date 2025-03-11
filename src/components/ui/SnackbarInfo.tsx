import { Alert, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";

function SnackbarInfo({
  isOpen,
  duration,
  type,
  message,
  onClose,
}: {
  isOpen: boolean;
  duration?: number;
  type: "success" | "error" | "info" | "warning";
  message: string;
  onClose?: VoidFunction;
}) {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={open}
      autoHideDuration={duration || 5000}
      onClose={() => {
        if (onClose) onClose();
        setOpen(false);
      }}
    >
      <Alert severity={type}>{message}</Alert>
    </Snackbar>
  );
}

export default SnackbarInfo;

export const initialSnackbar = { message: "", type: "info", modal: false };
