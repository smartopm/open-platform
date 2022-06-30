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
  textFieldStyle,
  margin,
  size,
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
          <div style={textFieldStyle}>
            <TextField
              {...params}
              helperText={
                inputValidation.error &&
                t('form:errors.required_field', { fieldName: inputValidation.fieldName })
              }
              placeholder="YYYY-MM-DD"
              variant={inputVariant}
              margin={margin}
              size={size}
              data-testid="date-picker"
              style={
                textFieldStyle
                  ? { width: `${width || '100%'}`, background: '#FFFFFF' }
                  : { width: `${width || '100%'}` }
              }
            />
          </div>
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
        disableMaskedInput
      />
    </LocalizationProvider>
  );
}

export function DateAndTimePickers({
  selectedDateTime,
  handleDateChange,
  label,
  pastDate,
  inputValidation,
  inputVariant,
  textFieldStyle
}) {
  const { t } = useTranslation(['logbook', 'form']);
  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      locale={getCurrentLng().includes('es') ? es : enUS}
    >
      <MobileDateTimePicker
        renderInput={params => (
          <div style={textFieldStyle}>
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
              variant={inputVariant}
              data-testid="datetime-picker"
              margin="dense"
              fullWidth
              style={textFieldStyle ? { background: '#FFFFFF' } : {}}
            />
          </div>
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
  textFieldStyle,
  inputVariant,
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
          renderInput={params =>
            textFieldStyle ? (
              <div style={textFieldStyle}>
                <TextField
                  {...params}
                  data-testid="time_picker"
                  fullWidth
                  margin="dense"
                  variant={inputVariant}
                  style={{ background: '#FFFFFF' }}
                />
              </div>
            ) : (
              <TextField
                {...params}
                data-testid="time_picker"
                style={otherProps.fullWidth ? { width: '100%' } : {}}
                variant={inputVariant}
              />
            )
          }
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
  disabled: false,
  textFieldStyle: undefined,
  inputVariant: 'standard',
  size: undefined
};

DateAndTimePickers.defaultProps = {
  inputValidation: {
    error: false,
    fieldName: ''
  },
  inputVariant: 'standard',
  textFieldStyle: undefined,
  margin: 'dense'
};

ThemedTimePicker.defaultProps = {
  inputValidation: {
    error: false,
    fieldName: ''
  },
  disabled: false,
  textFieldStyle: null,
  inputVariant: 'standard'
};

DatePickerDialog.propTypes = {
  inputValidation: PropTypes.shape({
    error: PropTypes.bool,
    fieldName: PropTypes.string
  }),
  disabled: PropTypes.bool,
  textFieldStyle: PropTypes.shape({}),
  inputVariant: PropTypes.string,
  size: PropTypes.string
};

DateAndTimePickers.propTypes = {
  inputValidation: PropTypes.shape({
    error: PropTypes.bool,
    fieldName: PropTypes.string
  }),
  inputVariant: PropTypes.string,
  textFieldStyle: PropTypes.shape({}),
  margin: PropTypes.string
};

ThemedTimePicker.propTypes = {
  inputValidation: PropTypes.shape({
    error: PropTypes.bool,
    fieldName: PropTypes.string
  }),
  disabled: PropTypes.bool,
  textFieldStyle: PropTypes.shape({}),
  inputVariant: PropTypes.string
};
