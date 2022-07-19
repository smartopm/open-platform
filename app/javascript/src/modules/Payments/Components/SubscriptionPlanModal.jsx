/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { MenuItem, TextField, Switch } from '@mui/material';
import { CustomizedDialogs } from '../../../components/Dialog';
import DatePickerDialog from '../../../components/DatePickerDialog';
import { subscriptionPlanType } from '../../../utils/constants';
import { formatError, titleize } from '../../../utils/helpers';
import { SubscriptionPlanCreate, SubscriptionPlanUpdate } from '../graphql/payment_mutations';

const initialPlanState = {
  active: true,
  planType: '',
  startDate: new Date(),
  endDate: new Date(+new Date() + 86400000),
  amount: ''
};

export default function SubscriptionPlanModal({
  open,
  handleModalClose,
  subscriptionPlansRefetch,
  showSnackbar,
  messageType,
  subscriptionData
}) {
  const { t } = useTranslation(['payment', 'common']);
  const [createSubscriptionPlan] = useMutation(SubscriptionPlanCreate);
  const [updateSubscriptionPlan] = useMutation(SubscriptionPlanUpdate);
  const [inputValue, setInputValues] = useState(initialPlanState);
  const [isError, setIsError] = useState(false);
  const [modalType, setModalType] = useState('new');
  const [mutationLoading, setMutationloading] = useState(false);

  useEffect(() => {
    if (subscriptionData) {
      const { id, status, planType, startDate, endDate, amount } = subscriptionData;
      setInputValues({
        id,
        active: status === 'active',
        planType,
        startDate,
        endDate,
        amount
      });
      setModalType('edit');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (modalType === 'new') {
      handleSubmit();
    } else {
      handleUpdateSubmit();
    }
  }

  function handleUpdateSubmit() {
    setMutationloading(true);
    updateSubscriptionPlan({
      variables: {
        status: inputValue.active ? 'active' : 'in_active',
        planType: inputValue.planType,
        startDate: inputValue.startDate,
        endDate: inputValue.endDate,
        amount: parseFloat(inputValue.amount),
        id: inputValue.id
      }
    })
      .then(() => {
        handleModalClose();
        subscriptionPlansRefetch();
        showSnackbar({ type: messageType.success, message: t('misc.subscription_plan_updated') });
        setInputValues(initialPlanState);
        setMutationloading(false);
      })
      .catch(err => {
        showSnackbar({ type: messageType.error, message: formatError(err.message) });
        setMutationloading(false);
      });
  }

  function handleSubmit() {
    setMutationloading(true);
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
        showSnackbar({ type: messageType.success, message: t('misc.subscription_plan_created') });
        setInputValues(initialPlanState);
        setMutationloading(false);
      })
      .catch(err => {
        showSnackbar({ type: messageType.error, message: formatError(err.message) });
        setMutationloading(false);
      });
  }

  return (
    <CustomizedDialogs
      open={open}
      handleModal={handleModalClose}
      dialogHeader={modalType === 'new' ? t('misc.create_subscription_plan') : t('actions.edit_subscription_plan')}
      subHeader={modalType === 'new' ? t('misc.set_monthly_payment') : null}
      saveAction={
        modalType === 'new' && mutationLoading
          ? t('common:form_actions.creating_plan')
          : modalType === 'edit' && mutationLoading
          ? t('common:form_actions.saving')
          : modalType === 'edit'
          ? t('common:form_actions.save_changes')
          : t('common:form_actions.create_plan')
      }
      cancelAction={t('common:form_actions.cancel')}
      handleBatchFilter={createSubscriptionPlanHandler}
      disableActionBtn={mutationLoading}
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
          error={isError && !inputValue.planType}
          helperText={isError && !inputValue.planType && t('errors.plan_type_required')}
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
          t={t}
        />
        <DatePickerDialog
          selectedDate={inputValue.endDate}
          handleDateChange={date => handleInputChange({ target: { name: 'endDate', value: date } })}
          label={t('table_headers.end_date')}
          required
          t={t}
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
          helperText={isError && !inputValue.amount && t('errors.amount_required')}
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

SubscriptionPlanModal.defaultProps = {
  subscriptionData: {}
}

SubscriptionPlanModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  subscriptionPlansRefetch: PropTypes.func.isRequired,
  showSnackbar: PropTypes.func.isRequired,
  messageType: PropTypes.shape({
    success: PropTypes.string,
    error: PropTypes.string,
  }).isRequired,
  subscriptionData: PropTypes.shape({
    id: PropTypes.string,
    status: PropTypes.string,
    planType: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    amount: PropTypes.number
  })
};
