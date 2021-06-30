import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types'
import useDialogStyles from './dialogStyles';
import CenteredContent from '../../components/CenteredContent';

export default function EntryNoteDialog({ open, handleDialogStatus, observationHandler }) {
  const classes = useDialogStyles();

  function handleNoteDialog() {}

  return (
    <>
      <Dialog fullWidth open={open} onClose={handleDialogStatus} aria-labelledby="entry-dialog-title">
        <DialogTitle id="entry-dialog-title" className={classes.title}>
          Observations
        </DialogTitle>
        <DialogContent>
          <DialogContentText />
          <TextField
            id="outlined-multiline-static"
            label="Add your observation here"
            rows={5}
            variant="outlined"
            value={observationHandler.value}
            onChange={event => observationHandler.handleChange(event.target.value)}
            multiline
            fullWidth
          />
          <br />
          <CenteredContent>
            {/* should go to /scan */}
            <Button onClick={handleNoteDialog}>
              Skip & Scan Next Entry
            </Button>
            {/* should go to /entry_request */}
            <Button onClick={handleNoteDialog}>
              Skip & Manually record Entry
            </Button>
            {/* should save and go back to dashboard */}
            <Button onClick={handleNoteDialog} variant="outlined" color="primary">
              Save & Go to dashboard
            </Button>
            <br />
          </CenteredContent>
        </DialogContent>
      </Dialog>
    </>
  );
}

EntryNoteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  observationHandler: PropTypes.shape({
    value: PropTypes.string,
    handleChange: PropTypes.func
  }).isRequired,
  handleDialogStatus: PropTypes.func.isRequired
}
