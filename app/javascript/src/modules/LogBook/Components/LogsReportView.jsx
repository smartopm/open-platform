import { Button, Grid, Typography } from '@mui/material';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { CSVLink } from 'react-csv';
import { useTheme } from '@material-ui/core';
import DatePickerDialog from '../../../components/DatePickerDialog';

const csvHeaders = [
  { label: 'Type', key: 'subject' },
  { label: 'Guard Name', key: 'actingUser.name' },
  { label: 'Date', key: 'createdAt' },
  { label: 'Guest', key: 'user.name' }
];

export default function LogsReportView({ startDate, endDate, handleChange, children }) {
  const { t } = useTranslation(['logbook', 'common']);
  return (
    <>
      <Typography gutterBottom>Gate FLow Report</Typography>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={5} md={3}>
          <DatePickerDialog
            selectedDate={startDate}
            handleDateChange={date => handleChange({ target: { name: 'startDate', value: date } })}
            label={t('guest_book.start_date')}
            inputProps={{ 'data-testid': 'start_date' }}
            inputVariant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={5} md={3}>
          <DatePickerDialog
            selectedDate={endDate}
            handleDateChange={date => handleChange({ target: { name: 'endDate', value: date } })}
            label={t('guest_book.end_date')}
            inputProps={{ 'data-testid': 'end_date' }}
            inputVariant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={2} md={1}>
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
  children: PropTypes.node.isRequired
};
