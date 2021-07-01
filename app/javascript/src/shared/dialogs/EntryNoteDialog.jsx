import React from 'react';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';
import useDialogStyles from './dialogStyles';

export default function EntryNoteDialog({ open, handleDialogStatus, observationHandler, children }) {
  const classes = useDialogStyles();
  const { t } = useTranslation('logbook')
  return (
    <>
      <Dialog fullWidth open={open} onClose={handleDialogStatus} aria-labelledby="entry-dialog-title" data-testid="entry-dialog">
        <DialogTitle id="entry-dialog-title" className={classes.title} data-testid="entry-dialog-title">
          {t('observations.observation_title')}
        </DialogTitle>
        <DialogContent>
          <TextField
            id="outlined-multiline-static"
            label={t('observations.add_your_observation')}
            rows={5}
            variant="outlined"
            value={observationHandler.value}
            onChange={event => observationHandler.handleChange(event.target.value)}
            inputProps={{
              "data-testid":"entry-dialog-field"
            }}
            multiline
            fullWidth
          />
          <br />
          {children}
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
  handleDialogStatus: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}
