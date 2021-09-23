import React from 'react';
import { TextField, Button, Grid } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import EmailIcon from '@material-ui/icons/Email';

export default function QRCodeConfirmation({
  open,
  closeModal,
  guestEmail,
  emailHandler,
  sendQrCode,
  guestRequest
}) {
  const classes = useStyles();
  const { t } = useTranslation('logbook');

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        onClose={closeModal}
        aria-labelledby="confirmation-dialog-title"
        data-testid="confirmation-dialog"
      >
        <DialogTitle
          id="confirmation-dialog-title"
          className={classes.title}
          data-testid="confirmation-dialog-title"
        >
          {t('qrcode_confirmation.title')}
        </DialogTitle>
        <DialogContent dividers>
          {guestEmail ? (
            <>
              <Typography gutterBottom>{`${t('qrcode_confirmation.send_qr_code')}:`}</Typography>
              <Grid className={classes.emailGrid}>
                <EmailIcon color="primary" />
                <Typography className={classes.emailText}>{guestEmail}</Typography>
              </Grid>
            </>
          ) : (
            <>
              <Typography gutterBottom className={classes.newEmail}>
                {`${t('qrcode_confirmation.enter_email_text')}`}
              </Typography>
              <TextField
                fullWidth
                label="Enter email address"
                name="email"
                type="email"
                onChange={event => emailHandler.handleEmailChange(event.target.value)}
                value={emailHandler.value}
                inputProps={{ 'data-testid': 'guest-email' }}
                className={`form-control ${classes.newEmail}`}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <>
            <Button
              onClick={closeModal}
              color="secondary"
              variant="outlined"
              data-testid="dont-send-confirmation"
            >
              {t('qrcode_confirmation.dont_send')}
            </Button>
            <Button
              onClick={() => sendQrCode(guestRequest?.id, guestEmail || emailHandler.value)}
              color="primary"
              variant="contained"
              data-testid="send-confirmation"
              style={{ color: 'white' }}
              autoFocus
            >
              {t('qrcode_confirmation.send')}
            </Button>
          </>
        </DialogActions>
      </Dialog>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  title: {
    color: theme.palette.primary.main,
    borderBottom: `1px ${theme.palette.primary.main} solid`
  },
  textField: {
    width: '100%'
  },
  emailGrid: {
    display: 'flex',
    marginBottom: '30px'
  },
  emailText: {
    marginTop: '1px',
    marginLeft: '10px'
  },
  newEmail: {
    marginBottom: '30px'
  }
}));

QRCodeConfirmation.propTypes = {
  open: PropTypes.bool.isRequired,
  emailHandler: PropTypes.shape({
    value: PropTypes.string,
    handleEmailChange: PropTypes.func
  }).isRequired,
  closeModal: PropTypes.func.isRequired,
  sendQrCode: PropTypes.func.isRequired,
  guestEmail: PropTypes.string.isRequired,
  guestRequest: PropTypes.shape({
    id: PropTypes.string
  }).isRequired
};
