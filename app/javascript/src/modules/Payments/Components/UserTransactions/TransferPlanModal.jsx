import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery, useMutation } from 'react-apollo';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import MessageAlert from '../../../../components/MessageAlert';
import { Spinner } from '../../../../shared/Loading';
import { UserLandParcelWithPlan } from '../../../../graphql/queries';
import { TransferPaymentPlanMutation } from '../../graphql/payment_plan_mutations';
import { formatError, formatMoney } from '../../../../utils/helpers';
import { dateToString } from '../../../../components/DateContainer';
import { CustomizedDialogs } from '../../../../components/Dialog';
import PlanTransferConfirmDialog from './PlanTransferConfirmDialog';

export default function TransferPlanModal({
  open,
  handleModalClose,
  userId,
  paymentPlanId,
  refetch,
  balanceRefetch,
  planData,
  currencyData,
}) {
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [acceptanceCheckbox, setAcceptanceCheckbox] = useState(false);
  const [destinationPlanId, setDestinationPlanId] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  const [transferPaymentPlan] = useMutation(TransferPaymentPlanMutation);
  const [confirmTransferPlanOpen, setConfirmTransferPlanOpen] = useState(false);
  const classes = useStyles();
  const { t } = useTranslation('common');
  const [loadPaymentPlans, { loading, data }] = useLazyQuery(UserLandParcelWithPlan, {
    variables: { userId },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  });

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setMessageAlert('');
  }

  function handleRadioChange(event) {
    setDestinationPlanId(event.target.value);
  }

  function handleAcceptanceCheckChange() {
    setAcceptanceCheckbox(!acceptanceCheckbox);
  }

  function planPaymentSummaryDetail() {
    if (paymentPlanId === '') return {};

    let totalPayment = 0;
    let totalPaymentAmount = 0;
    planData.planPayments.forEach(payment => {
      if (payment.status === 'paid') {
        totalPaymentAmount += payment.amount;
        totalPayment += 1;
      }
    });
    return {
      totalPayment,
      totalPaymentAmount: formatMoney(currencyData, totalPaymentAmount)
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    transferPaymentPlan({
      variables: { sourcePlanId: paymentPlanId, destinationPlanId }
    })
      .then(res => {
        const resLandParcel = res.data?.transferPaymentPlan?.paymentPlan?.landParcel;
        const planStartDate = res.data?.transferPaymentPlan?.paymentPlan?.startDate;
        const paymentPlanName = `${resLandParcel.parcelNumber} ${planStartDate}`;
        handleModalClose();
        setMessageAlert(t('common:misc.plan_transferred_successfully', { paymentPlanName }));
        setIsSuccessAlert(true);
        refetch();
        balanceRefetch();
      })
      .catch(err => {
        handleModalClose();
        setMessageAlert(formatError(err.message));
        setIsSuccessAlert(false);
      });
  }

  function handleTransferPlanClose() {
    setConfirmTransferPlanOpen(false)
    handleModalClose()
  }

  function handleTransferPlanSubmit() {
    setConfirmTransferPlanOpen(true)
    handleModalClose()
  }

  useEffect(() => {
    if (open) {
      loadPaymentPlans({ variables: { userId }, errorPolicy: 'all', fetchPolicy: 'no-cache' });
    } else {
      setAcceptanceCheckbox(false);
      setDestinationPlanId('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (destinationPlanId?.length !== 0 && acceptanceCheckbox) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [destinationPlanId, acceptanceCheckbox]);

  if (loading) return <Spinner />;

  return (
    <>
      {console.log(userId)}
      {console.log(paymentPlanId)}
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={!!messageAlert}
        handleClose={handleMessageAlertClose}
      />
      <PlanTransferConfirmDialog
        open={confirmTransferPlanOpen}
        handleClose={handleTransferPlanClose}
        PaymentData={planPaymentSummaryDetail()}
        handleSubmit={handleSubmit}
      />
      <CustomizedDialogs
        open={open}
        handleModal={handleModalClose}
        dialogHeader={t('common:menu.transfer_plan')}
        handleBatchFilter={handleTransferPlanSubmit}
        saveAction={t('common:menu.transfer_plan')}
        cancelAction={t('common:misc.close')}
        disableActionBtn={!canSubmit}
      >
        <div>
          <Typography paragraph variant="h6" color="textPrimary" display="body">
            {t('common:misc.select_transfer_plan')}
          </Typography>
          <Typography
            className={classes.content}
            paragraph
            variant="body1"
            color="textPrimary"
            display="body"
          >
            {data?.userLandParcelWithPlan.length > 1 ? (
              <PaymentPlansForTransferPlan
                data={data}
                sourcePlanId={paymentPlanId}
                destinationPlanId={destinationPlanId}
                handleRadioChange={handleRadioChange}
              />
            ) : (
              <Typography
                className={classes.content}
                paragraph
                variant="body1"
                color="secondary"
                display="body"
              >
                {t('common:misc.no_property_found_for_plan_transfer')}
              </Typography>
            )}
          </Typography>
          <Typography
            className={classes.footer}
            paragraph
            variant="body1"
            color="textPrimary"
            display="body"
          >
            {data?.userLandParcelWithPlan.length > 1 && (
              <FormGroup row>
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={acceptanceCheckbox}
                      onChange={handleAcceptanceCheckChange}
                      name="acceptanceCheckbox"
                    />
                  )}
                  label={t('common:misc.transfer_plan_acceptance')}
                  labelPlacement="end"
                />
              </FormGroup>
            )}
          </Typography>
        </div>
      </CustomizedDialogs>
    </>
  );
}

export function PaymentPlansForTransferPlan({
  data,
  destinationPlanId,
  sourcePlanId,
  handleRadioChange
}) {
  const filteredPaymentPlans = data?.userLandParcelWithPlan.filter(
    plan => plan.id !== sourcePlanId
  );

  return (
    <FormControl component="fieldset">
      <RadioGroup
        aria-label="paymentPlanId"
        name="paymentPlanId"
        value={destinationPlanId}
        onChange={handleRadioChange}
      >
        {filteredPaymentPlans.map(plan => (
          <FormControlLabel
            key={plan.id}
            checked={destinationPlanId === plan?.id}
            value={plan?.id}
            control={<Radio />}
            label={`${plan?.landParcel?.parcelNumber} - ${dateToString(plan?.startDate)}`}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

TransferPlanModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  paymentPlanId: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired,
  balanceRefetch: PropTypes.func.isRequired
};

PaymentPlansForTransferPlan.propTypes = {
  data: PropTypes.shape({
    userLandParcelWithPlan: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string
      })
    ).isRequired
  }).isRequired,
  sourcePlanId: PropTypes.string.isRequired,
  destinationPlanId: PropTypes.string.isRequired,
  handleRadioChange: PropTypes.func.isRequired
};

const useStyles = makeStyles(() => ({
  title: {
    color: '#cf5628',
    borderBottom: `1px #cf5628 solid`
  },
  content: {
    marginTop: '5%'
  },
  footer: {
    marginTop: '25%'
  }
}));
