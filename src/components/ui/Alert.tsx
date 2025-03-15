import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";

function Alert({
  open,
  onClose,
  title,
  message,
  buttons,
}: {
  open: boolean;
  onClose: VoidFunction;
  title: string;
  message: string;
  buttons?: { label: string; onClick: VoidFunction }[];
}) {
  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={"sm"}
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {buttons?.map((item) => {
            return (
              <Button key={item.label} onClick={item.onClick}>
                {item.label}
              </Button>
            );
          })}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Alert;
