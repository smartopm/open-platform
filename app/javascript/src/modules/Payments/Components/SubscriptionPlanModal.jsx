import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { MenuItem, TextField, Switch } from '@material-ui/core';
import { CustomizedDialogs } from '../../../components/Dialog';
import DatePickerDialog from '../../../components/DatePickerDialog';
import { subscriptionPlanType } from '../../../utils/constants';
import { formatError, titleize } from '../../../utils/helpers';
import { SubscriptionPlanCreate } from '../graphql/payment_mutations';

const initialPlanState = {
  active: true,
  planType: '',
  startDate: new Date(),
  endDate: new Date(),
  amount: ''
};

export default function SubscriptionPlanModal({
  open,
  handleModalClose,
  subscriptionPlansRefetch,
  setMessage,
  openAlertMessage
}) {
  const { t } = useTranslation(['payment', 'common']);
  const [createSubscriptionPlan] = useMutation(SubscriptionPlanCreate);
  const [inputValue, setInputValues] = useState(initialPlanState);
  const [isError, setIsError] = useState(false);

  function handleInputChange(event) {
    const { name, value } = event.target;
    const fields = { ...inputValue };
    if (name === 'active') {
      fields[String(name)] = event.target.checked;
    } else {
      fields[String(name)] = value;
    }
    setInputValues(fields);
  }

  function createSubscriptionPlanHandler(event) {
    event.preventDefault();
    if (
      !inputValue.planType ||
      !inputValue.amount ||
      !inputValue.startDate ||
      !inputValue.endDate
    ) {
      setIsError(true);
      return;
    }

    handleSubmit();
  }

  function handleSubmit() {
    createSubscriptionPlan({
      variables: {
        status: inputValue.active ? 'active' : 'in_active',
        planType: inputValue.planType,
        startDate: inputValue.startDate,
        endDate: inputValue.endDate,
        amount: parseFloat(inputValue.amount)
      }
    })
      .then(() => {
        handleModalClose();
        subscriptionPlansRefetch();
        setMessage({ isError: false, detail: t('misc.subscription_plan_created') });
        openAlertMessage();
        setInputValues(initialPlanState);
      })
      .catch(err => {
        setMessage({ isError: true, detail: formatError(err.message) });
        openAlertMessage();
      });
  }

  return (
    <CustomizedDialogs
      open={open}
      handleModal={handleModalClose}
      dialogHeader={t('misc.create_subscription_plan')}
      subHeader={t('misc.set_monthly_payment')}
      saveAction={t('common:form_actions.create_plan')}
      cancelAction={t('common:form_actions.cancel')}
      handleBatchFilter={createSubscriptionPlanHandler}
    >
      <>
        <TextField
          margin="normal"
          id="plan_type"
          aria-label="plan_type"
          label={t('table_headers.plan_type')}
          value={inputValue.planType}
          onChange={handleInputChange}
          name="planType"
          required
          style={{ width: '100%' }}
          select
        >
          {Object.entries(subscriptionPlanType)?.map(([key, val]) => (
            <MenuItem key={key} value={val}>
              {titleize(val)}
            </MenuItem>
          ))}
        </TextField>

        <DatePickerDialog
          selectedDate={inputValue.startDate}
          handleDateChange={date =>
            handleInputChange({ target: { name: 'startDate', value: date } })
          }
          label={t('common:table_headers.start_date')}
          required
        />
        <DatePickerDialog
          selectedDate={inputValue.endDate}
          handleDateChange={date => handleInputChange({ target: { name: 'endDate', value: date } })}
          label={t('table_headers.end_date')}
          required
        />
        <TextField
          id="amount"
          label={t('common:table_headers.amount')}
          aria-label="amount"
          value={inputValue.amount}
          onChange={handleInputChange}
          name="amount"
          type="number"
          style={{ width: '100%' }}
          required
          InputProps={{
            inputProps: {
              min: 1
            }
          }}
          error={isError && !inputValue.amount}
          helperText={isError && !inputValue.duration && t('errors.amount_required')}
        />
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            marginTop: '20px'
          }}
        >
          <div>{t('common:misc.activate')}</div>
          <div>
            <Switch
              checked={inputValue.active}
              onChange={handleInputChange}
              name="active"
              color="primary"
            />
          </div>
        </div>
      </>
    </CustomizedDialogs>
  );
}

SubscriptionPlanModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  subscriptionPlansRefetch: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  openAlertMessage: PropTypes.func.isRequired
};
