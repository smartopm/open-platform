/* eslint-disable react/prop-types */
import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core'
import { useTranslation } from 'react-i18next';

export default function DeleteDialogueBox({
  handleClose,
  handleDelete,
  open
}) {
  const { t } = useTranslation('campaign');
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t('actions.delete_campaign')}
        </DialogTitle>
        <DialogContent>
          {t('message.sure_to_delete')}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" data-testid='no'>
            {t('misc.no')}
          </Button>
          <Button onClick={handleDelete} color="primary" data-testid='yes' autoFocus>
            {t('misc.yes')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
