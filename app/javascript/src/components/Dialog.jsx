import React from "react";
import {
  DialogContent,
  DialogActions,
  Button,
  Dialog
} from "@material-ui/core";
import PropTypes from "prop-types";
import { StyleSheet, css } from "aphrodite";
import Avatar from "./Avatar";

export function DenyModalDialog({ handleClose, open, handleConfirm }) {
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogContent>
        <p className="deny-msg">
          Are you sure you want to deny request <strong>#A5353</strong> ?
        </p>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleConfirm} color="secondary">
          Deny
        </Button>
        <Button onClick={handleClose} color="primary">
          Never Mind
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export function GrantModalDialog({ handleClose, open, imageURL }) {
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogContent>
        <Avatar imageURL={imageURL} user={{}} />
        <br />
        <p className="text-center">Thomas Jones</p>
        <br />
        <p className="text-center ">
          <strong>Access all clear</strong>
        </p>
      </DialogContent>
      <div className="d-flex justify-content-center">
        <Button
          autoFocus
          onClick={handleClose}
          className={`btn  ${css(styles.logButton)}`}
        >
          Log entry
        </Button>
      </div>
      <br />
      <Button onClick={handleClose} color="primary">
        Dismiss
      </Button>
    </Dialog>
  );
}

DenyModalDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleConfirm: PropTypes.func.isRequired
};
GrantModalDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  imageURL: PropTypes.string
};

const styles = StyleSheet.create({
  logButton: {
    backgroundColor: "rgb(61, 199, 113)",
    color: "#FFF",
    width: "50%"
  }
});
