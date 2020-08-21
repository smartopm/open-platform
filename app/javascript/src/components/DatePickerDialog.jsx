import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles'
import DateFnsUtils from '@date-io/date-fns'
import { createMuiTheme } from '@material-ui/core'
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
    KeyboardDateTimePicker
} from '@material-ui/pickers'


const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#69ABA4'
        }
      },
});



export default function DatePickerDialog({ selectedDate, handleDateChange, label }) {
    return (
        <ThemeProvider theme={theme}>
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
                    onChange={date => handleDateChange(date)}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />

            </MuiPickersUtilsProvider>
        </ThemeProvider>

    );

}

export function DateAndTimePickers({ selectedDateTime, handleDateChange, label}) {

    return (
        <ThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDateTimePicker
                label={label}
                style={{width: '100%'}}
                value={selectedDateTime}
                format="yyyy/MM/dd hh:mm a"
                placeholder="YYYY-MM-DD hh:mm a"
                onChange={date => handleDateChange(new Date(date).toISOString())}
                clearable
            />
        </MuiPickersUtilsProvider>
        </ThemeProvider>
    );
  }