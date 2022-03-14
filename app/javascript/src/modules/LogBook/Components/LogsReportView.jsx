import { Grid, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import DatePickerDialog from '../../../components/DatePickerDialog';


export default function LogsReportView({ startDate, endDate, handleChange, isSmall, children }) {
  const { t } = useTranslation(['logbook', 'common']);
  return (
    <>
      <br />
      <Typography>{t('guest_book.gate_flow_report')}</Typography>
      <br />
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={5} md={3}>
          <DatePickerDialog
            selectedDate={startDate}
            handleDateChange={date => handleChange({ target: { name: 'startDate', value: date } })}
            label={!isSmall ? t('guest_book.start_date') : 'From'}
            inputProps={{ 'data-testid': 'start_date' }}
            inputVariant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={5} md={3}>
          <DatePickerDialog
            selectedDate={endDate}
            handleDateChange={date => handleChange({ target: { name: 'endDate', value: date } })}
            label={!isSmall ? t('guest_book.end_date') : 'To'}
            inputProps={{ 'data-testid': 'end_date' }}
            inputVariant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={2} md={2}>
          {children}
        </Grid>
      </Grid>
    </>
  );
}

LogsReportView.defaultProps = {
  startDate: null,
  endDate: null
};

LogsReportView.propTypes = {
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  handleChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  isSmall: PropTypes.bool.isRequired,
};
