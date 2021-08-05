import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { CustomizedDialogs } from '../../../../components/Dialog';

export default function PlanTransferConfirmDialog({
  open,
  handleClose,
  PaymentData,
  handleSubmit
}) {
  const classes = useStyles();
  const { totalPayment, totalPaymentAmount } = PaymentData;
  const { t } = useTranslation('common');

  return (
    <CustomizedDialogs
      open={open}
      handleModal={handleClose}
      dialogHeader="Transfer Plan"
      handleBatchFilter={handleSubmit}
      saveAction="Continue to Verification"
      cancelAction="Close"
    >
      <Typography align="center" className={classes.content}>
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
    </CustomizedDialogs>
  );
}

PlanTransferConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleDialogStatus: PropTypes.func.isRequired,
  PaymentData: PropTypes.shape({
    totalPayment: PropTypes.string.isRequired,
    totalPaymentAmount: PropTypes.string.isRequired
  }).isRequired,
  handlePlanTransferClick: PropTypes.func.isRequired
};

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
