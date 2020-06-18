import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles'
import DateFnsUtils from '@date-io/date-fns'
import { StyleSheet, css } from 'aphrodite'
import { createMuiTheme } from '@material-ui/core'
import TextField from '@material-ui/core/TextField';
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider
} from '@material-ui/pickers'


const theme = createMuiTheme({
    overrides: {
        MuiPickersToolbar: {
            toolbar: {
                backgroundColor: '#25c0b0',
            },
        },
        MuiPickersDay: {
            day: {
                color: '#25c0b0',
            },
            daySelected: {
                backgroundColor: '#25c0b0',
            },
            current: {
                color: '#25c0b0',
            },
        },
    }
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
                    format="yyyy/MM/dd"
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

export function DateAndTimePickers({ selectedDateTime, handleDateChange,label}) {

    return (
        <ThemeProvider theme={theme}>
        <TextField
          id="datetime-local"
          label={label}
          type="datetime-local"
          className={css(styles.fileInput)}
          InputLabelProps={{
            shrink: true,
          }}
          value={selectedDateTime}
          onChange={date => handleDateChange(date)}
        />
        </ThemeProvider>
    );
  }

  const styles = StyleSheet.create({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
      }
  })
