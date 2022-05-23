/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types */
import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@mui/material'

import { useTranslation } from 'react-i18next'

export default function FollowDialogueBox({
  authState,
  open,
  handleClose,
  subscribe,
  handleFollow,
  textFieldOnChange,
  handleSendEmail,
  handleEmailUpdate,
  updateEmail,
  error
}) {
  const email = authState.user?.email
  const { t } = useTranslation(['common','discussion'])
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t('discussion:headers.subscribe')}
        </DialogTitle>
        <DialogContent>
          {!subscribe && email ? (
            <DialogContentText id="alert-dialog-description">
              {t('dicussion:messages.subscribed_first_part')}
              {' '}
              <b>{email}</b>
              {t('dicussion:messages.subscribed_second_part')}
              {' '}
              <a href="https://app.doublegdp.com/contact">{t('dicussion:messages.contact_team')}</a>
            </DialogContentText>
          ) : !subscribe && !email ?
              (
                <DialogContentText id="alert-dialog-description">
                  {t('discussion:messages.not_subscribed_first_part')}
                  {' '}
                  <a href="#" onClick={handleEmailUpdate}>
                    {t('discussion:messages.not_subscribed_second_part')}
                  </a>
                  {' '}
                  {t('discussion:messages.not_subscribed_third_part')}
                </DialogContentText>
              ) :
              (
                <DialogContentText id="alert-dialog-description">
                  {t('discussion:messages.unfolllow_ack_message')}
                </DialogContentText>
              )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            {t('discussion:form_actions.disagree')}
          </Button>
          <Button onClick={handleFollow} color="primary" autoFocus>
            {t('discussion:form_actions.agree')}
          </Button>
        </DialogActions>
      </Dialog>
      {
        updateEmail && (
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{t('discussion:headers.update_email_header')}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {t('discussion:messages.update_email_helper')}
              </DialogContentText>
              <TextField
                error={error}
                autoFocus
                margin="dense"
                id="name"
                label={t('discussion:form_fields.email_address')}
                type="email"
                onChange={textFieldOnChange}
                fullWidth
                helperText={t('discussion:helper_text.invalid_email')}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleEmailUpdate} color="primary">
                {t('form_actions.cancel')}
              </Button>
              <Button onClick={handleSendEmail} color="primary">
                {t('misc.send')}
              </Button>
            </DialogActions>
          </Dialog>
        )
      }
    </>
  )
}
