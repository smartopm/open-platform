import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery } from 'react-apollo';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { Spinner } from '../../../../shared/Loading';
import { UserLandParcelWithPlan } from '../../../../graphql/queries';
import { formatMoney } from '../../../../utils/helpers';
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
  currencyData
}) {
  const [acceptanceCheckbox, setAcceptanceCheckbox] = useState(false);
  const [destinationPlanId, setDestinationPlanId] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  const [confirmTransferPlanOpen, setConfirmTransferPlanOpen] = useState(false);
  const classes = useStyles();
  const { t } = useTranslation('common');
  const [loadPaymentPlans, { loading, data }] = useLazyQuery(UserLandParcelWithPlan, {
    variables: { userId },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  });

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
    // eslint-disable-next-line no-unused-expressions
    planData?.planPayments?.forEach(payment => {
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

  function handleTransferPlanClose() {
    setDestinationPlanId('');
    setConfirmTransferPlanOpen(false);
  }

  function handleTransferPlanSubmit() {
    setConfirmTransferPlanOpen(true);
    handleModalClose();
  }

  useEffect(() => {
    if (open) {
      loadPaymentPlans({ variables: { userId }, errorPolicy: 'all', fetchPolicy: 'no-cache' });
    } else {
      if(!confirmTransferPlanOpen){
        setDestinationPlanId('');
      }
      setAcceptanceCheckbox(false);
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
      <PlanTransferConfirmDialog
        open={confirmTransferPlanOpen}
        handleClose={handleTransferPlanClose}
        PaymentData={planPaymentSummaryDetail()}
        paymentPlanId={paymentPlanId}
        destinationPlanId={destinationPlanId}
        handleModalClose={handleModalClose}
        refetch={refetch}
        balanceRefetch={balanceRefetch}
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
          <Typography paragraph variant="h6" color="textPrimary" data-testid='title'>
            {t('common:misc.select_transfer_plan')}
          </Typography>
          <div
            className={classes.content}
            color="textPrimary"
            data-testid='plots'
          >
            <PaymentPlansForTransferPlan
              data={data}
              sourcePlanId={paymentPlanId}
              destinationPlanId={destinationPlanId}
              handleRadioChange={handleRadioChange}
              acceptanceCheckbox={acceptanceCheckbox}
              handleAcceptanceCheckChange={handleAcceptanceCheckChange}
            />
          </div>
        </div>
      </CustomizedDialogs>
    </>
  );
}

export function PaymentPlansForTransferPlan({
  data,
  destinationPlanId,
  sourcePlanId,
  handleRadioChange,
  acceptanceCheckbox,
  handleAcceptanceCheckChange
}) {
  const filteredPaymentPlans = data?.userLandParcelWithPlan.filter(
    plan => plan.id !== sourcePlanId
  );
  const classes = useStyles();
  const { t } = useTranslation('common');

  return (
    filteredPaymentPlans?.length >= 1 ? (
      <>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="paymentPlanId"
            name="paymentPlanId"
            value={destinationPlanId}
            onChange={handleRadioChange}
          >
            {filteredPaymentPlans?.map(plan => (
              <FormControlLabel
                key={plan.id}
                checked={destinationPlanId === plan.id}
                value={plan.id}
                control={<Radio />}
                label={`${plan?.landParcel?.parcelNumber} - ${dateToString(plan?.startDate)}`}
              />
          ))}
          </RadioGroup>
        </FormControl>
        <div
          className={classes.footer}
          color="textPrimary"
        >
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
        </div>
      </>
    ) : (
      <Typography
        className={classes.content}
        paragraph
        variant="body1"
        color="secondary"
      >
        {t('common:misc.no_property_found_for_plan_transfer')}
      </Typography>
    )
  );
}

TransferPlanModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  paymentPlanId: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired,
  balanceRefetch: PropTypes.func.isRequired,
  planData: PropTypes.arrayOf({
    planPayments: PropTypes.shape({
      id: PropTypes.string,
      status: PropTypes.string,
      amount: PropTypes.number
    })
  }).isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired,
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
  handleRadioChange: PropTypes.func.isRequired,
  acceptanceCheckbox: PropTypes.bool.isRequired,
  handleAcceptanceCheckChange: PropTypes.func.isRequired
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
