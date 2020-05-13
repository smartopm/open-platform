import React from 'react';
import {ThemeProvider } from '@material-ui/core/styles'
import DateFnsUtils from '@date-io/date-fns'
import { createMuiTheme } from '@material-ui/core'
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
        MuiPickersModal: {
            dialogAction: {
                color: '#25c0b0'
            },
            current: {
                color: '#25c0b0',
            },
        },
    }
});

export default function DatePickerDialog({selectedDate, handleDateChange, label }) {
    return (
        <ThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    data-testid='date-picker'
                    style={{width: '100%'}}
                    margin="normal"
                    id="date-picker-dialog"
                    label={label}
                    format="yyyy/MM/dd"
                    placeholder="YYYY-MM-DD"
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
            </MuiPickersUtilsProvider>
        </ThemeProvider>

    );

}


