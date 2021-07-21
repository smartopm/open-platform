import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

export default function PlanTransferConfirmDialog({ open, handleDialogStatus, PaymentData, handlePlanTransferClick }) {
  const classes = useStyles();
  const { totalPayment, totalPaymentAmount } = PaymentData;
  const { t } = useTranslation('common');

  return (
    <>
      <Dialog fullWidth open={open} onClose={handleDialogStatus} aria-labelledby="entry-dialog-title" data-testid="entry-dialog">
        <DialogTitle id="entry-dialog-title" className={classes.title} data-testid="entry-dialog-title">
          {t('common:menu.transfer_plan')}
        </DialogTitle>
        <DialogContent dividers>
          <Typography align='center' className={classes.content}>
            <Typography paragraph variant="body1" color="textPrimary" display="inline">
              {t('common:misc.plan_transfer_confirmation_message_1')}
            </Typography>
            <Typography paragraph variant="body1" color="primary" display="inline">
              &nbsp;
              {totalPayment}
              &nbsp;
            </Typography>
            <Typography paragraph variant="body1" color="textPrimary" display="inline">
              {t('common:misc.plan_transfer_confirmation_message_2')}
            </Typography>
            <Typography paragraph variant="body1" color="primary" display="inline">
              &nbsp;
              {totalPaymentAmount}
              &nbsp;
            </Typography>
            <Typography paragraph variant="body1" color="textPrimary" display="inline">
              {t('common:misc.plan_transfer_confirmation_message_3')}
            </Typography>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogStatus}
            color="default"
            variant="outlined"
            data-testid="cancel"
          >
            {t('common:misc.close')}
          </Button>
          <Button
            onClick={(event) => handlePlanTransferClick(event)}
            color="primary"
            variant="contained"
            data-testid="save"
            style={{ color: 'white' }}
            autoFocus
          >
            {t('common:menu.continue_to_verification')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

PlanTransferConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleDialogStatus: PropTypes.func.isRequired,
  PaymentData: PropTypes.shape({
    totalPayment: PropTypes.string.isRequired,
    totalPaymentAmount: PropTypes.string.isRequired
  }).isRequired,
  handlePlanTransferClick: PropTypes.func.isRequired,
}

const useStyles = makeStyles(() => ({
  title: {
    color: '#cf5628',
    borderBottom: `1px #cf5628 solid`
  },
  content: {
    minHeight: '50px',
    marginTop: 30,
    marginBottom: 30
  }
}));
