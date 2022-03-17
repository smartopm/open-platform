import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useLazyQuery, useMutation } from 'react-apollo';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { CustomizedDialogs } from '../../../../components/Dialog';
import { UserLandParcelWithPlan } from '../../../../graphql/queries';
import { dateToString } from '../../../../components/DateContainer';
import { Spinner } from '../../../../shared/Loading';
import { AllocateGeneralFunds } from '../../graphql/payment_plan_mutations';
import { formatError } from '../../../../utils/helpers';
import MessageAlert from '../../../../components/MessageAlert';
import CenteredContent from '../../../../shared/CenteredContent';

export default function AllocatePlanModal({ 
  open,
  handleClose,
  userId,
  balanceRefetch,
  genRefetch,
  paymentPlansRefetch
}) {
  const { t } = useTranslation(['common', 'payment']);
  const [paymentPlanId, setPaymentPlanId] = useState('');
  const [acceptanceCheckbox, setAcceptanceCheckbox] = useState(false)
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [mutationLoading, setMutationStatus] = useState(false);
  const [loadPaymentPlans, { loading, data }] = useLazyQuery(UserLandParcelWithPlan, {
    variables: { userId },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  });

  const [alllocatFunds] = useMutation(AllocateGeneralFunds);

  useEffect(() => {
    if (open) {
      loadPaymentPlans({ variables: { userId }, errorPolicy: 'all', fetchPolicy: 'no-cache' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleSubmit() {
    setMutationStatus(true);
    alllocatFunds({
      variables: { paymentPlanId }
    })
    .then(() => {
      setIsSuccessAlert(true);
      setMessageAlert(t('common:misc.allocating_success'));
      handleClose();
      paymentPlansRefetch();
      balanceRefetch();
      genRefetch();
      setMutationStatus(false);
    })
    .catch(err => {
      setMessageAlert(formatError(err.message));
      setIsSuccessAlert(false);
      handleClose();
      setMutationStatus(false);
    });
  }

  if (loading) return <Spinner />;

  return (
    <>
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={!!messageAlert}
        handleClose={() => setMessageAlert('')}
      />
      <CustomizedDialogs
        open={open}
        handleModal={handleClose}
        dialogHeader={t('common:menu.allocate_funds')}
        handleBatchFilter={handleSubmit}
        saveAction={mutationLoading ? t('common:menu.allocating') : t('common:menu.allocate')}
        cancelAction={t('common:misc.close')}
        disableActionBtn={!acceptanceCheckbox || mutationLoading || !paymentPlanId}
      >
        {data?.userLandParcelWithPlan?.length > 0 ? (
          <>
            <Typography paragraph color="textPrimary" data-testid='title'>
              {t('common:misc.allocate_select')}
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="allocatePlanId"
                name="allocatePlanId"
                value={paymentPlanId}
                data-testid='radio-group'
                onChange={(event) => setPaymentPlanId(event.target.value)}
              >
                {data?.userLandParcelWithPlan.map(plan => (
                  <FormControlLabel
                    key={plan.id}
                    checked={paymentPlanId === plan.id}
                    data-testid={plan.id}
                    value={plan.id}
                    control={<Radio />}
                    label={`${plan?.landParcel?.parcelNumber} - ${dateToString(plan?.startDate)}`}
                  />
          ))}
              </RadioGroup>
            </FormControl>

            <div
              style={{marginTop: '25%'}}
              color="textPrimary"
            >
              <FormGroup row>
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={acceptanceCheckbox}
                      onChange={() => setAcceptanceCheckbox(!acceptanceCheckbox)}
                      data-testid='confirmation'
                      name="acceptanceCheckbox"
                    />
          )}
                  label={t('common:misc.allocating_message')}
                  labelPlacement="end"
                />
              </FormGroup>
            </div>
          </>
        ) : (
          <CenteredContent>{t('common:misc.no_allocating')}</CenteredContent>
        )}
      </CustomizedDialogs>
    </>
  )
}

AllocatePlanModal.defaultProps = {
  genRefetch: () => {},
  paymentPlansRefetch: () => {},
  balanceRefetch: () => {}
}

AllocatePlanModal.propTypes = {
  userId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  genRefetch: PropTypes.func,
  paymentPlansRefetch: PropTypes.func,
  balanceRefetch: PropTypes.func
};