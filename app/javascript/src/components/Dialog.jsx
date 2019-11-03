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
          Are you sure you want to {action} request <strong>{name}</strong> ?
        </p>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleConfirm} color="secondary">
          {action}
        </Button>
        <Button onClick={handleClose} color="primary">
          Never Mind
        </Button>
      </DialogActions>
    </Dialog>
  );
}
ModalDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};
