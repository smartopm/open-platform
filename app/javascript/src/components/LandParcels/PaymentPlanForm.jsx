import React from 'react';
import PropTypes from 'prop-types';
import { Button, MenuItem, TextField } from '@material-ui/core';
import DatePickerDialog from '../DatePickerDialog';
import { paymentPlanStatus } from '../../utils/constants';

export default function PaymentPlanForm({ planState, updatePlanState }) {
  function update(event) {
    const { name, value } = event.target;
    updatePlanState({ ...planState, [name]: value });
  }
  return (
    <>
      <TextField
        autoFocus
        margin="normal"
        id="purchase_plan"
        inputProps={{ 'data-testid': 'purchase_plan' }}
        label="Purchase Plan"
        value={planState.planType}
        onChange={update}
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
        value={planState.status}
        onChange={update}
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
        value={planState.percentage}
        onChange={update}
        name="percentage"
        style={{ width: '100%' }}
      />
      <DatePickerDialog
        selectedDate={planState.startDate}
        handleDateChange={date => updatePlanState({ ...planState, startDate: date })}
        label="Start Date"
        required
      />
      <Button variant="text" color="primary">Save Plan</Button>
    </>
  );
}

PaymentPlanForm.propTypes = {
  planState: PropTypes.shape({
    status: PropTypes.string,
    planType: PropTypes.string,
    startDate: PropTypes.instanceOf(Date),
    percentage: PropTypes.string
  }).isRequired,
  updatePlanState: PropTypes.func.isRequired
};
