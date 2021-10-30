/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types'
import DateFnsUtils from '@date-io/date-fns'
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
  TimePicker
} from '@material-ui/pickers'
import FormHelperText from '@material-ui/core/FormHelperText';
import { useTranslation } from 'react-i18next';
import { es, enUS } from "date-fns/locale";
import { checkPastDate } from "../utils/dateutil"
import { getCurrentLng } from '../modules/i18n/util';

export default function DatePickerDialog({ selectedDate, handleDateChange, label, width, required, inputProps, disablePastDate, inputVariant, styles, inputValidation, disabled, ...others }) {
  const { t } = useTranslation(['logbook', 'form'])
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={getCurrentLng().includes('es') ? es : enUS}>
        <KeyboardDatePicker
          okLabel={t('date_picker.ok_label')}
          clearLabel={t('date_picker.clear')}
          cancelLabel={t('date_picker.cancel')}
          data-testid='date-picker'
          style={{ width: `${width || '100%'}`, ...styles }}
          clearable
          margin="normal"
          id={`date-picker-dialog-${label}`}
          label={label}
          format="yyyy-MM-dd"
          placeholder="YYYY-MM-DD"
          inputVariant={inputVariant ? 'outlined' : 'standard'}
          value={selectedDate}
          name={label}
          required={required}
          onChange={date => handleDateChange(date)}
          inputProps={inputProps}
          disablePast={disablePastDate}
          KeyboardButtonProps={{
                        'aria-label': 'change date'
                    }}
          {...inputValidation}
          helperText={inputValidation.error && t('form:errors.required_field', { name: inputValidation.fieldName })}
          {...others}
          disabled={disabled}
        />
      </MuiPickersUtilsProvider>
    );
}

export function DateAndTimePickers({ selectedDateTime, handleDateChange, label, pastDate, inputValidation }) {
  const { t } = useTranslation(['logbook', 'form'])
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={getCurrentLng().includes('es') ? es : enUS}>
      <KeyboardDateTimePicker
        okLabel={t('date_picker.ok_label')}
        clearLabel={t('date_picker.clear')}
        cancelLabel={t('date_picker.cancel')}
        data-testid='datetime-picker'
        label={label}
        style={{ width: '100%' }}
        value={selectedDateTime}
        format="yyyy/MM/dd hh:mm"
        placeholder="YYYY-MM-DD hh:mm a"
        onChange={handleDateChange}
        clearable
        disablePast={pastDate || false}
        minutesStep={pastDate ? 60 : 1}
        error={pastDate ? checkPastDate(selectedDateTime) : inputValidation.error}
        /* eslint-disable no-nested-ternary */
        helperText={pastDate
          ? t('form:errors.date_time_in_the_future')
          : inputValidation.error
            ? t('form:errors.required_field', { name: inputValidation.fieldName })
            : ''}
      />
    </MuiPickersUtilsProvider>
  );
}


export function ThemedTimePicker({ handleTimeChange, time, label, inputValidation, disabled, ...otherProps }){
  const { t } = useTranslation(['logbook', 'form'])
  return (
    <>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={getCurrentLng().includes('es') ? es : enUS}>
        <TimePicker
          okLabel={t('date_picker.ok_label')}
          clearLabel={t('date_picker.clear')}
          cancelLabel={t('date_picker.cancel')}
          data-testid="time_picker"
          autoOk
          clearable
          label={label}
          value={time}
          onChange={handleTimeChange}
          {...otherProps}
        />
      </MuiPickersUtilsProvider>
      {/* Moved the validation error outside to silence the MUI error */}
      {inputValidation.error && <FormHelperText error>{t('form:errors.required_field', { name: inputValidation.fieldName })}</FormHelperText>}
    </>
  )
}

DatePickerDialog.defaultProps = {
  inputValidation: {
    error: false,
    fieldName: '',
  },
  disabled: false
}

DateAndTimePickers.defaultProps = {
  inputValidation: {
    error: false,
    fieldName: '',
  }
}

ThemedTimePicker.defaultProps = {
  inputValidation: {
    error: false,
    fieldName: '',
  },
  disabled: false
}

DatePickerDialog.propTypes = {
  inputValidation: PropTypes.shape({
    error: PropTypes.bool,
    fieldName: PropTypes.string,
  }),
  disabled: PropTypes.bool
}

DateAndTimePickers.propTypes = {
  inputValidation: PropTypes.shape({
    error: PropTypes.bool,
    fieldName: PropTypes.string,
  })
}

ThemedTimePicker.propTypes = {
  inputValidation: PropTypes.shape({
    error: PropTypes.bool,
    fieldName: PropTypes.string,
  }),
  disabled: PropTypes.bool
}