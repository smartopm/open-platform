import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, MenuItem, TextField } from '@material-ui/core';
import DatePickerDialog from '../DatePickerDialog';
import { paymentPlanStatus } from '../../utils/constants';
// list all owners of the land parcel
// pass a land_parcel
// lazy query list of owners of
// pick one owner

const initialPlanState = {
  status: '',
  planType: '',
  percentage: '',
  startDate: new Date(),
  showPaymentPlan: false
}
export default function PaymentPlanForm({ landParcelId }) {
  const [paymentPlanState, setPaymentPlanState] = useState(initialPlanState)
  console.log(landParcelId)
  console.log('I appeared yeahhhh')

  function handleOnChange(event) {
    const { name, value } = event.target;
    setPaymentPlanState({ ...paymentPlanState, [name]: value });
  }
  return (
    <>
      <TextField
        autoFocus
        margin="normal"
        id="purchase_plan"
        inputProps={{ 'data-testid': 'purchase_plan' }}
        label="Purchase Plan"
        value={paymentPlanState.planType}
        onChange={handleOnChange}
        name="planType"
        style={{ width: '100%' }}
        required
        select
      >
        <MenuItem value="lease">Lease</MenuItem>
        <MenuItem value="other">Other</MenuItem>
      </TextField>
      <TextField
        autoFocus
        margin="normal"
        id="status"
        inputProps={{ 'data-testid': 'status' }}
        label="Status"
        value={paymentPlanState.status}
        onChange={handleOnChange}
        name="status"
        style={{ width: '100%' }}
        required
        select
      >
        {Object.entries(paymentPlanStatus).map(([key, val]) => (
          <MenuItem key={key} value={key}>
            {val}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        margin="normal"
        id="percentage"
        label="Percentage"
        inputProps={{ 'data-testid': 'percentage' }}
        value={paymentPlanState.percentage}
        onChange={handleOnChange}
        name="percentage"
        style={{ width: '100%' }}
      />
      <DatePickerDialog
        selectedDate={paymentPlanState.startDate}
        handleDateChange={date => setPaymentPlanState({ ...paymentPlanState, startDate: date })}
        label="Start Date"
        required
      />
      <Button variant="text" color="primary">Save Plan</Button>
    </>
  );
}

PaymentPlanForm.propTypes = {
  landParcelId: PropTypes.string.isRequired,
};
