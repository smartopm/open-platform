import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { CustomizedDialogs } from '../../../../components/Dialog';
import { formatError } from '../../../../utils/helpers';
import { TransferPaymentPlanMutation } from '../../graphql/payment_plan_mutations';
import MessageAlert from '../../../../components/MessageAlert';
import { dateToString } from '../../../../components/DateContainer';

export default function PlanTransferConfirmDialog({
  open,
  handleClose,
  PaymentData,
  paymentPlanId,
  destinationPlanId,
  refetch,
  balanceRefetch,
  handleModal
}) {
  const classes = useStyles();
  const { totalPayment, totalPaymentAmount } = PaymentData;
  const { t } = useTranslation('common');
  const [transferPaymentPlan] = useMutation(TransferPaymentPlanMutation);
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setMessageAlert('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    transferPaymentPlan({
      variables: { sourcePlanId: paymentPlanId, destinationPlanId }
    })
    .then(res => {
      const paymentPlanName = `${res.data?.transferPaymentPlan?.paymentPlan?.landParcel.parcelNumber} ${dateToString(res.data?.transferPaymentPlan?.paymentPlan?.startDate)}`;
      setMessageAlert(t('common:misc.plan_transferred_successfully', { paymentPlanName }));
      setIsSuccessAlert(true);
      handleModal();
      refetch();
      balanceRefetch();
    })
    .catch(err => {
      setMessageAlert(formatError(err.message));
      setIsSuccessAlert(false);
      handleModal();
    });
  }

  return (
    <>
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={!!messageAlert}
        handleClose={handleMessageAlertClose}
      />
      <CustomizedDialogs
        open={open}
        handleModal={handleClose}
        dialogHeader={t('common:menu.transfer_plan')}
        handleBatchFilter={handleSubmit}
        saveAction={t('common:menu.continue_to_verification')}
        cancelAction={t('common:misc.close')}
      >
        <div className={classes.content} data-testid='content'>
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
        </div>
      </CustomizedDialogs>
    </>
  );
}

PlanTransferConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  paymentPlanId: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  destinationPlanId: PropTypes.string.isRequired,
  PaymentData: PropTypes.shape({
    totalPayment: PropTypes.number,
    totalPaymentAmount: PropTypes.string
  }).isRequired,
  refetch: PropTypes.func.isRequired,
  balanceRefetch: PropTypes.func.isRequired,
  handleModal: PropTypes.func.isRequired
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
