import { Grid, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import DatePickerDialog from '../../../components/DatePickerDialog';

export default function LogsReportView({ startDate, endDate, handleChange, children }) {
  const { t } = useTranslation(['logbook', 'common']);
  const classes = useStyles();
  return (
    <>
      <div className={classes.flowReportTitle}>
        <Typography variant="subtitle1">
          {t('guest_book.gate_flow_report')}
        </Typography>
      </div>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <DatePickerDialog
            selectedDate={startDate}
            handleDateChange={date => handleChange({ target: { name: 'startDate', value: date } })}
            label={t('guest_book.start_date')}
            inputProps={{ 'data-testid': 'start_date' }}
            inputVariant="outlined"
            maxDate={new Date()}
            size="small"
            t={t}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <DatePickerDialog
            selectedDate={endDate}
            handleDateChange={date => handleChange({ target: { name: 'endDate', value: date } })}
            label={t('guest_book.end_date')}
            inputProps={{ 'data-testid': 'end_date' }}
            inputVariant="outlined"
            maxDate={new Date()}
            size="small"
            t={t}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
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
};

const useStyles = makeStyles(() => ({
  flowReportTitle: {
    marginTop: 13,
    marginBottom: 9
  }
}));
