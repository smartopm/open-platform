import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function CustomDialog({ open, handleDialogStatus, children, actions, title }) {
  return (
    <>
      <Dialog
        fullWidth
        maxWidth="lg"
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
              <IconButton
                data-testid="custom-dialog-close-icon"
                onClick={handleDialogStatus}
                size="large"
              >
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
