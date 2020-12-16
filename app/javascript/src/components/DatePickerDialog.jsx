/* eslint-disable react/prop-types */
import React from 'react';
import DateFnsUtils from '@date-io/date-fns'
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
  TimePicker
} from '@material-ui/pickers'
import { checkPastDate } from "../utils/dateutil"

export default function DatePickerDialog({ selectedDate, handleDateChange, label, width, required }) {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          data-testid='date-picker'
          style={{ width: `${width || '100%'}` }}
          clearable
          margin="normal"
          id="date-picker-dialog"
          label={label}
          format="yyyy-MM-dd"
          placeholder="YYYY-MM-DD"
          value={selectedDate}
          name={label}
          required={required}
          onChange={date => handleDateChange(date)}
          KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
        />
      </MuiPickersUtilsProvider>
    );
}

export function DateAndTimePickers({ selectedDateTime, handleDateChange, label, pastDate }) {
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
        disablePast={pastDate || false}
        minutesStep={pastDate ? 60 : 1}
        error={pastDate ? checkPastDate(selectedDateTime) : null}
        helperText={pastDate ? 'Please select a date and time in the future' : ''}
      />
    </MuiPickersUtilsProvider>
  );
}


export function ThemedTimePicker({ handleTimeChange, time, label }){
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <TimePicker
        autoOk
        clearable
        label={label}
        value={time}
        onChange={handleTimeChange}
      />
    </MuiPickersUtilsProvider>
  )
}
