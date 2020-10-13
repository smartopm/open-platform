/* eslint-disable react/prop-types */
import React from 'react';
import DateFnsUtils from '@date-io/date-fns'
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers'

export default function DatePickerDialog({ selectedDate, handleDateChange, label }) {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          data-testid='date-picker'
          style={{ width: '100%' }}
          clearable
          margin="normal"
          id="date-picker-dialog"
          label={label}
          format="yyyy-MM-dd"
          placeholder="YYYY-MM-DD"
          value={selectedDate}
          name={label}
          onChange={date => handleDateChange(date)}
          KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
        />
      </MuiPickersUtilsProvider>
    );
}

export function DateAndTimePickers({ selectedDateTime, handleDateChange, label }) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDateTimePicker
        label={label}
        style={{ width: '100%' }}
        value={selectedDateTime}
        format="yyyy/MM/dd hh:mm"
        placeholder="YYYY-MM-DD hh:mm a"
        onChange={handleDateChange}
        clearable
      />
    </MuiPickersUtilsProvider>
  );
}
