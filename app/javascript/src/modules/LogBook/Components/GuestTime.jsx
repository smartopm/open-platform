import React from 'react';
import { IconButton, Avatar, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import DatePickerDialog, { ThemedTimePicker } from '../../../components/DatePickerDialog';

export default function GuestTime({ userData, handleChange, handleChangeOccurrence }) {
  const { t } = useTranslation(['logbook', 'common', 'days']);
  return (
    <>
      <DatePickerDialog
        selectedDate={userData.visitationDate}
        handleDateChange={date => handleChange({ target: { name: 'visitationDate', value: date } })}
        label={t('common:misc.day_of_visit')}
        inputProps={{ 'data-testid': 'day_of_visit_input' }}
      />

      <div>
        <ThemedTimePicker
          time={userData.startsAt || userData.startTime}
          handleTimeChange={date => handleChange({ target: { name: 'startsAt', value: date } })}
          label={t('common:misc.start_time')}
          inputProps={{ 'data-testid': 'start_time_input' }}
        />
        <span style={{ marginLeft: 20 }}>
          <ThemedTimePicker
            time={userData.endsAt || userData.endTime}
            handleTimeChange={date => handleChange({ target: { name: 'endsAt', value: date } })}
            label={t('common:misc.end_time')}
            inputProps={{ 'data-testid': 'end_time_input' }}
          />
        </span>
      </div>

      <br />
      <Typography gutterBottom data-testid="guest_repeats_on">{t('guest_book.repeats_on')}</Typography>
      {Object.entries(t('days:days', { returnObjects: true })).map(([key, value]) => (
        <IconButton
          key={key}
          color="primary"
          aria-label="choose day of week"
          component="span"
          onClick={() => handleChangeOccurrence(key)}
          data-testid="week_days"
        >
          <Avatar style={{ backgroundColor: new Set(userData.occursOn).has(key) ? '#009CFF' : '#ADA7A7' }}>
            {value.charAt(0)}
          </Avatar>
        </IconButton>
      ))}
      {Boolean(userData.occursOn.length) && (
        <DatePickerDialog
          selectedDate={userData.visitEndDate}
          handleDateChange={date => handleChange({ target: { name: 'visitEndDate', value: date } })}
          label={t('guest_book.repeats_until')}
          inputProps={{ 'data-testid': 'repeats_until_input' }}
          disablePastDate
        />
      )}
    </>
  );
}

GuestTime.propTypes = {
  userData: PropTypes.shape({
    visitEndDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    startsAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    endsAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    startTime: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    endTime: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    visitationDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    occursOn: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleChangeOccurrence: PropTypes.func.isRequired,
};
