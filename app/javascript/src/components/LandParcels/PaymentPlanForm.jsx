import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, MenuItem, TextField, InputAdornment, Typography } from '@material-ui/core';
import { useMutation } from 'react-apollo';
import DatePickerDialog from '../DatePickerDialog';
import { paymentPlanStatus, currencies } from '../../utils/constants';
import { LandPaymentPlanCreateMutation } from '../../graphql/mutations/land_parcel';
import { Spinner } from '../../shared/Loading';
import { formatError } from '../../utils/helpers';

import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider';

const initialPlanState = {
  status: 0,
  planType: 'lease',
  percentage: '',
  startDate: new Date(),
  userId: '',
  monthlyAmount: '',
  totalAmount: 0,
  durationInMonth: ''
};
export default function PaymentPlanForm({ landParcel, refetch }) {
  const [paymentPlanState, setPaymentPlanState] = useState(initialPlanState);
  const [createPaymentPlan] = useMutation(LandPaymentPlanCreateMutation);
  const [mutationInfo, setMutationInfo] = useState({
    loading: false,
    isError: false,
    message: null
  });
  const [errorInfo, setErrorInfo] = useState({ isError: false, isSubmitting: false });
  const authState = useContext(AuthStateContext);
  const currency = currencies[authState.user?.community.currency] || '';

  useEffect(() => {
    const { percentage, monthlyAmount, durationInMonth } = paymentPlanState;

    let totalAmount = 0;
    if (Number(percentage) > 0 || Number(monthlyAmount) > 0 || Number(durationInMonth) > 0) {
      totalAmount = (monthlyAmount * durationInMonth * 100) / percentage;
    }

    setPaymentPlanState({ ...paymentPlanState, totalAmount: Number(parseFloat(totalAmount).toFixed(2)) })
  }, [paymentPlanState.percentage, paymentPlanState.monthlyAmount, paymentPlanState.durationInMonth]);

  function handleOnChange(event) {
    const { name, value } = event.target;
    setPaymentPlanState({ ...paymentPlanState, [name]: value });
  }

  function handleSubmit() {
    const values = Object.values(paymentPlanState);

    function isNotValid(element) {
      if (Number.isInteger(element) || element instanceof Date) {
        return false;
      }
      return !element;
    }
    const isAnyInValid = values.some(isNotValid);
    if (isAnyInValid) {
      setErrorInfo({ isError: true, isSubmitting: true });
      return;
    }
    setMutationInfo({ ...mutationInfo, loading: true });
    createPaymentPlan({
      variables: {
        ...paymentPlanState,
        landParcelId: landParcel.id,
        monthlyAmount: parseFloat(paymentPlanState.monthlyAmount),
        durationInMonth: parseInt(paymentPlanState.durationInMonth, 10)
      }
    })
      .then(() => {
        setMutationInfo({
          ...mutationInfo,
          message: 'Payment plan created successfully',
          loading: false
        });
        refetch();
      })
      .catch(error => {
        setMutationInfo({ isError: true, message: formatError(error.message), loading: false });
      });
  }

  return (
    <>
      <TextField
        autoFocus
        margin="normal"
        id="purchase_plan"
        aria-label="purchase_plan"
        label="Purchase Plan"
        value={paymentPlanState.planType}
        onChange={handleOnChange}
        name="planType"
        style={{ width: '100%' }}
        required
        select
      >
        <MenuItem key="lease_" value="lease">
          Lease
        </MenuItem>
        <MenuItem key="other" value="other">
          Other
        </MenuItem>
      </TextField>

      <TextField
        autoFocus
        margin="normal"
        id="purchase_plan_owner"
        aria-label="payment_plan_owner"
        label="Choose Payment Plan User"
        value={paymentPlanState.userId}
        onChange={handleOnChange}
        name="userId"
        style={{ width: '100%' }}
        required
        select
        error={errorInfo.isError && !paymentPlanState.userId}
        helperText={errorInfo.isError && !paymentPlanState.userId && 'User is required'}
      >
        {landParcel.accounts.map(account => (
          <MenuItem key={account.user.id} value={account.user.id}>
            {account.fullName}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        autoFocus
        margin="normal"
        id="status"
        aria-label="status"
        label="Status"
        value={paymentPlanState.status}
        onChange={handleOnChange}
        name="status"
        style={{ width: '100%' }}
        required
        select
        error={errorInfo.isError && !Number.isInteger(paymentPlanState.status)}
        helperText={errorInfo.isError && paymentPlanState.status === '' && 'Status is required'}
      >
        {Object.entries(paymentPlanStatus).map(([key, val]) => (
          <MenuItem key={key} value={Number(key)}>
            {val}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        margin="normal"
        id="Percentage-of-premium-paid"
        label="Percentage of premium paid"
        aria-label="Percentage-of-premium-paid"
        value={paymentPlanState.percentage}
        onChange={handleOnChange}
        name="PercentageOfPremiumPaid"
        style={{ width: '100%' }}
        type="number"
        InputProps={{
          inputProps: {
            min: 1
          },
          startAdornment: <InputAdornment position="start">%</InputAdornment>
        }}
        error={errorInfo.isError && !paymentPlanState.percentage}
        helperText={errorInfo.isError && !paymentPlanState.percentage && 'Percentage is required'}
      />
      <TextField
        margin="normal"
        id="monthly-amount"
        label="Monthly Amount"
        aria-label="monthly-amount"
        value={paymentPlanState.monthlyAmount}
        onChange={handleOnChange}
        name="monthlyAmount"
        style={{ width: '100%' }}
        type="number"
        InputProps={{
          inputProps: {
            min: 1
          },
          startAdornment: <InputAdornment position="start">{currency}</InputAdornment>
        }}
        error={errorInfo.isError && !paymentPlanState.monthlyAmount}
        helperText={
          errorInfo.isError &&
          !paymentPlanState.monthlyAmount &&
          'Monthly amount is required'
        }
      />
      <TextField
        margin="normal"
        id="duration-in-month"
        label="Duration(in months)"
        aria-label="duration-in-month"
        value={paymentPlanState.durationInMonth}
        onChange={handleOnChange}
        name="durationInMonth"
        style={{ width: '100%' }}
        type="number"
        InputProps={{
          inputProps: {
            min: 1
          }
        }}
        error={errorInfo.isError && !paymentPlanState.durationInMonth}
        helperText={
          errorInfo.isError && !paymentPlanState.durationInMonth && 'Duration is required'
        }
      />
      <DatePickerDialog
        selectedDate={paymentPlanState.startDate}
        handleDateChange={date => setPaymentPlanState({ ...paymentPlanState, startDate: date })}
        label="Start Date"
        required
      />
      {paymentPlanState.totalAmount > 0 && (
        <Typography
          variant="caption"
          color="textSecondary"
          component="p"
          data-testid="total-amount-txt"
        >
          {`Approx. Total Property Valuation: ${currency} ${paymentPlanState.totalAmount}`}
        </Typography>
      )}
      {mutationInfo.loading ? (
        <Spinner />
      ) : (
        <Button variant="text" color="primary" onClick={handleSubmit} data-testid="submit_btn">
          Save Plan
        </Button>
      )}
      <br />
      {mutationInfo.message}
    </>
  );
}

PaymentPlanForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  landParcel: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired
};
