import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { CustomizedDialogs } from '../../../../components/Dialog';
import { formatError } from '../../../../utils/helpers';
import { TransferPaymentPlanMutation, TransferPaymentMutation } from '../../graphql/payment_plan_mutations';
import { dateToString } from '../../../../components/DateContainer';
import { SnackbarContext } from '../../../../shared/snackbar/Context';

export default function PlanTransferConfirmDialog({
  open,
  handleClose,
  paymentsSummary,
  paymentPlanId,
  destinationPlanId,
  refetch,
  balanceRefetch,
  transferType,
  paymentId,
  paymentAmount
}) {
  const classes = useStyles();
  const { totalPayment, totalPaymentAmount } = paymentsSummary;
  const { t } = useTranslation(['common', 'payment']);
  const [transferPaymentPlan] = useMutation(TransferPaymentPlanMutation);
  const [transferPayment] = useMutation(TransferPaymentMutation);
  const [mutationLoading, setMutationStatus] = useState(false);

  const { showSnackbar, messageType } = useContext(SnackbarContext);

  function handleSubmit(e) {
    e.preventDefault();
    setMutationStatus(true);
    if(transferType === 'plan'){
      processPlanTransfer();
    }else if(transferType === 'payment'){
      processPaymentTransfer();
    }
  }

  function processPlanTransfer() {
    transferPaymentPlan({
      variables: { sourcePlanId: paymentPlanId, destinationPlanId }
    })
    .then(res => {
      const paymentPlanName = `${res.data?.transferPaymentPlan?.paymentPlan?.landParcel.parcelNumber} ${dateToString(res.data?.transferPaymentPlan?.paymentPlan?.startDate)}`;
      showSnackbar({ type: messageType.success, message: t('common:misc.plan_transferred_successfully', { paymentPlanName }) });
      handleClose();
      refetch();
      balanceRefetch();
      setMutationStatus(false);
    })
    .catch(err => {
      showSnackbar({ type: messageType.error, message: formatError(err.message) });
      handleClose();
      setMutationStatus(false);
    });
  }

  function processPaymentTransfer() {
    transferPayment({
      variables: { paymentId, destinationPlanId }
    })
    .then(() => {
      showSnackbar({ type: messageType.success, message: t('payment:misc.payment_transferred_successfully')});
      handleClose();
      refetch();
      balanceRefetch();
      setMutationStatus(false);
    })
    .catch(err => {
      showSnackbar({ type: messageType.error, message: formatError(err.message) });
      handleClose();
      setMutationStatus(false);
    });
  }

  return (
    <>
      <CustomizedDialogs
        open={open}
        handleModal={handleClose}
        dialogHeader={transferType === 'plan' ? t('common:menu.transfer_plan') : t('common:menu.transfer_payment')}
        handleBatchFilter={handleSubmit}
        saveAction={mutationLoading ? t('common:menu.transferring') : t('common:menu.continue')}
        cancelAction={t('common:misc.close')}
        disableActionBtn={mutationLoading}
      >
        <div className={classes.content} data-testid='content'>
          {transferType === 'plan' ? (
            <>
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
            </>
          ) : (
            <>
              <Typography paragraph variant="body1" color="textPrimary" display="inline">
                {t('common:misc.payment_transfer_confirmation_message_1')}
              </Typography>
              <Typography paragraph variant="body1" color="primary" display="inline">
              &nbsp;
                {paymentAmount}
              &nbsp;
              </Typography>
              <Typography paragraph variant="body1" color="textPrimary" display="inline">
                {t('common:misc.payment_transfer_confirmation_message_2')}
              </Typography>
            </>
          )}
        </div>
      </CustomizedDialogs>
    </>
  );
}

PlanTransferConfirmDialog.defaultProps = {
  paymentAmount: 0
}

PlanTransferConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  paymentPlanId: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  destinationPlanId: PropTypes.string.isRequired,
  paymentsSummary: PropTypes.shape({
    totalPayment: PropTypes.number,
    totalPaymentAmount: PropTypes.string
  }).isRequired,
  refetch: PropTypes.func.isRequired,
  balanceRefetch: PropTypes.func.isRequired,
  paymentId: PropTypes.string.isRequired,
  transferType: PropTypes.string.isRequired,
  paymentAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const useStyles = makeStyles(() => ({
  title: {
    color: '#cf5628',
    borderBottom: `1px #cf5628 solid`
  },
  content: {
    minHeight: '50px',
    marginTop: 30,
    marginBottom: 30,
    textAlign: 'center'
  }
}));
