/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {
  MobileDatePicker,
  MobileDateTimePicker,
  MobileTimePicker,
  LocalizationProvider
} from '@mui/lab';
import enUS from 'date-fns/locale/en-US';
import es from 'date-fns/locale/es';
import FormHelperText from '@mui/material/FormHelperText';
import { useTranslation } from 'react-i18next';
import { checkPastDate } from '../utils/dateutil';
import { getCurrentLng } from '../modules/i18n/util';

export default function DatePickerDialog({
  selectedDate,
  handleDateChange,
  label,
  width,
  required,
  inputProps,
  disablePastDate,
  inputVariant,
  styles,
  inputValidation,
  disabled,
  ...others
}) {
  const { t } = useTranslation(['logbook', 'form']);
  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      locale={getCurrentLng().includes('es') ? es : enUS}
    >
      <MobileDatePicker
        renderInput={params => (
          <TextField
            {...params}
            helperText={
              inputValidation.error &&
              t('form:errors.required_field', { fieldName: inputValidation.fieldName })
            }
            placeholder="YYYY-MM-DD"
            variant={inputVariant ? 'outlined' : 'standard'}
            data-testid='date-picker'
            style={{ width: `${width || '100%'}`}}
          />
        )}
        okText={t('date_picker.ok_label')}
        clearText={t('date_picker.clear')}
        cancelText={t('date_picker.cancel')}
        data-testid="date-picker"
        style={{ width: `${width || '100%'}`, ...styles }}
        clearable
        id={`date-picker-dialog-${label}`}
        label={label}
        inputFormat="yyyy-MM-dd"
        inputProps={inputProps}
        value={selectedDate}
        required={required}
        onChange={date => handleDateChange(date)}
        {...others}
        disabled={disabled}
      />
    </LocalizationProvider>
  );
}

export function DateAndTimePickers({
  selectedDateTime,
  handleDateChange,
  label,
  pastDate,
  inputValidation
}) {
  const { t } = useTranslation(['logbook', 'form']);
  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      locale={getCurrentLng().includes('es') ? es : enUS}
    >
      <MobileDateTimePicker
        renderInput={params => (
          <TextField
            {...params}
            /* eslint-disable no-nested-ternary */
            helperText={
              pastDate
                ? t('form:errors.date_time_in_the_future')
                : inputValidation.error
                ? t('form:errors.required_field', { fieldName: inputValidation.fieldName })
                : ''
            }
            placeholder="YYYY-MM-DD hh:mm a"
            error={pastDate ? checkPastDate(selectedDateTime) : inputValidation.error}
            variant="standard"
            data-testid='datetime-picker'
            style={{ width: '100%' }}
          />
        )}
        okText={t('date_picker.ok_label')}
        clearText={t('date_picker.clear')}
        cancelText={t('date_picker.cancel')}
        data-testid="datetime-picker"
        label={label}
        value={selectedDateTime}
        inputFormat="yyyy/MM/dd hh:mm"
        onChange={handleDateChange}
        clearable
        minDate={pastDate && new Date()}
        minutesStep={1}
      />
    </LocalizationProvider>
  );
}

export function ThemedTimePicker({
  handleTimeChange,
  time,
  label,
  inputValidation,
  disabled,
  ...otherProps
}) {
  const { t } = useTranslation(['logbook', 'form']);
  return (
    <>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        locale={getCurrentLng().includes('es') ? es : enUS}
      >
        <MobileTimePicker
          renderInput={params => <TextField {...params} variant="outlined" data-testid='time_picker' style={otherProps.fullWidth ? { width: '100%' } : {}} />}
          okText={t('date_picker.ok_label')}
          clearText={t('date_picker.clear')}
          cancelText={t('date_picker.cancel')}
          data-testid="time_picker"
          clearable
          label={label}
          value={time}
          onChange={handleTimeChange}
          {...otherProps}
        />
      </LocalizationProvider>
      {/* Moved the validation error outside to silence the MUI error */}
      {inputValidation.error && (
        <FormHelperText error>
          {t('form:errors.required_field', { fieldName: inputValidation.fieldName })}
        </FormHelperText>
      )}
    </>
  );
}

DatePickerDialog.defaultProps = {
  inputValidation: {
    error: false,
    fieldName: ''
  },
  disabled: false
};

DateAndTimePickers.defaultProps = {
  inputValidation: {
    error: false,
    fieldName: ''
  }
};

ThemedTimePicker.defaultProps = {
  inputValidation: {
    error: false,
    fieldName: ''
  },
  disabled: false
};

DatePickerDialog.propTypes = {
  inputValidation: PropTypes.shape({
    error: PropTypes.bool,
    fieldName: PropTypes.string
  }),
  disabled: PropTypes.bool
};

DateAndTimePickers.propTypes = {
  inputValidation: PropTypes.shape({
    error: PropTypes.bool,
    fieldName: PropTypes.string
  })
};

ThemedTimePicker.propTypes = {
  inputValidation: PropTypes.shape({
    error: PropTypes.bool,
    fieldName: PropTypes.string
  }),
  disabled: PropTypes.bool
};
