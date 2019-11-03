import React from "react";
import {
  DialogContent,
  DialogActions,
  Button,
  Dialog
} from "@material-ui/core";
import PropTypes from "prop-types";

export function ModalDialog({
  handleClose,
  open,
  handleConfirm,
  action,
  name
}) {
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogContent>
        <p className="deny-msg">
          Are you sure you want to {action} access to <strong>{name}</strong> ?
        </p>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={handleConfirm}
          color={action === "grant" ? "primary" : "secondary"}
        >
          {action}
        </Button>
        <Button onClick={handleClose}>Never Mind</Button>
      </DialogActions>
    </Dialog>
  );
}
ModalDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  handleConfirm: PropTypes.func.isRequired
};
