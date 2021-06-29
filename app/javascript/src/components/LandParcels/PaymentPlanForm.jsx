import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem, TextField, InputAdornment, Typography } from '@material-ui/core';
import DatePickerDialog from '../DatePickerDialog';
import { paymentPlanStatus } from '../../utils/constants';
import UserAutoResult from '../../shared/UserAutoResult';

export default function PaymentPlanForm({
  landParcel,
  handleChange,
  paymentPlanState,
  paymentCurrency,
  errorInfo,
}) {
  return (
    <>
      <TextField
        autoFocus
        margin="normal"
        id="purchase_plan"
        aria-label="purchase_plan"
        label="Purchase Plan"
        value={paymentPlanState.planType}
        onChange={handleChange}
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
        onChange={handleChange}
        name="userId"
        style={{ width: '100%' }}
        required
        select
        error={errorInfo.isError && !paymentPlanState.userId}
        helperText={errorInfo.isError && !paymentPlanState.userId && 'User is required'}
      >
        {landParcel.accounts.map(account => (
          <MenuItem key={account.user.id} value={account.user.id}>
            <UserAutoResult user={account.user} />
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
        onChange={handleChange}
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
        id="percentage-of-total-valuation"
        label="Percentage of total valuation"
        aria-label="percentage-of-total-valuation"
        value={paymentPlanState.percentage}
        onChange={handleChange}
        name="percentage"
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
        onChange={handleChange}
        name="monthlyAmount"
        style={{ width: '100%' }}
        type="number"
        InputProps={{
          inputProps: {
            min: 1
          },
          startAdornment: <InputAdornment position="start">{paymentCurrency}</InputAdornment>
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
        onChange={handleChange}
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
        handleDateChange={date => handleChange({ target: { name: 'startDate', value: date }})}
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
          {`Approx. Total Property Valuation: ${paymentCurrency} ${paymentPlanState.totalAmount}`}
        </Typography>
      )}
    </>
  );
}

PaymentPlanForm.defaultProps = {
  errorInfo: {
    isError: false,
    isSubmitting: false 
  }
}

PaymentPlanForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  landParcel: PropTypes.object.isRequired,
  paymentPlanState: PropTypes.shape({
    status: PropTypes.number,
    planType: PropTypes.string,
    percentage: PropTypes.string,
    startDate:  PropTypes.instanceOf(Date),
    userId:  PropTypes.string,
    monthlyAmount:  PropTypes.string,
    totalAmount:  PropTypes.number,
    durationInMonth:  PropTypes.string,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  paymentCurrency:  PropTypes.string.isRequired,
  errorInfo: PropTypes.shape({
    isError: PropTypes.bool,
    isSubmitting: PropTypes.bool
  }),
};
