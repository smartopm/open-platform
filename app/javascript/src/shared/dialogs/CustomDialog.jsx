import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { Box, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

export default function CustomDialog({ open, handleDialogStatus, children, actions, title }) {
  return (
    <>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleDialogStatus}
        aria-labelledby="custom-dialog-title"
        data-testid="custom-dialog"
      >
        <DialogTitle
          id="custom-dialog-title"
          data-testid="custom-dialog-title"
        >
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>{title}</Box>
            <Box>
              <IconButton data-testid="custom-dialog-close-icon" onClick={handleDialogStatus}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
    </>
  );
}

CustomDialog.defaultProps = {
    actions: null
}

CustomDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  handleDialogStatus: PropTypes.func.isRequired,
  actions: PropTypes.node,
  children: PropTypes.node.isRequired
};
