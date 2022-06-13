/* eslint-disable react/prop-types */
import React from 'react';
import { useLocation } from 'react-router';
import Typography from '@mui/material/Typography';
import { PropTypes } from 'prop-types';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { differenceInHours } from '../../../utils/dateutil';
import DataTable, { StyledTableCell, StyledTableRow } from './DataTable';
// import { dateTimeToString, dateToString } from '../DateContainer';

export default function EmployeeTimeSheetLog({ data, name, firstDay, lastDay }) {
  const { state } = useLocation();
  const { t } = useTranslation(['timecard', 'common']);
  const shifts = data.userTimeSheetLogs;
  const columns = ['Day', 'Date', 'Start Time', 'Stop Time', 'Total Hours'];
  const timezone = 'Africa/Lusaka';
  // Day, Date, Start Time, Stop Time, Total Hours in the day

  const getWeekDay = dateString => {
    const date = new Date(dateString);
    return date.toLocaleString('en-us', { weekday: 'long', timeZone: timezone });
  };

  const formatDate = dateString => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: timezone };
    const date = new Date(dateString).toLocaleString('en-CA', options);
    return date;
  };

  const formatTime = dateString => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: timezone };
    const time = new Date(dateString).toLocaleString('en-US', options);
    return time;
  };

  const { days, hours } = calculateHoursAndDays(shifts);
  return (
    <div>
      <div className="container">
        <div className="container " style={{ marginRight: 10 }}>
          <Typography variant="body1" style={{ marginLeft: 10 }}>
            <strong data-testid="emp_name">
              {t('common:table_headers.name')}
              :
              {(state && state.name) || name}
            </strong>
          </Typography>
          <br />

          <Grid container justifyContent="flex-start">
            <Grid item xs={10}>
              <strong data-testid="summary">
                {t('timecard.worked_time_stats', { dayCount: days, hourCount: hours, firstDay, lastDay })}
              </strong>
            </Grid>
          </Grid>
        </div>
        {/* Removed total of hours and days till we have that. */}
        <DataTable columns={columns}>
          {Boolean(shifts.length) &&
            shifts.map(shift => (
              <StyledTableRow key={shift.id}>
                <StyledTableCell>{getWeekDay(shift.startedAt)}</StyledTableCell>
                <StyledTableCell>{formatDate(shift.startedAt)}</StyledTableCell>
                <StyledTableCell>{formatTime(shift.startedAt)}</StyledTableCell>
                <StyledTableCell>
                  {shift.endedAt ? formatTime(shift.endedAt) : t('timecard.shift_in_progress')}
                </StyledTableCell>
                <StyledTableCell data-testid="prog">
                  {shift.endedAt
                    ? differenceInHours(shift.startedAt, shift.endedAt)
                    : t('timecard.shift_in_progress')}
                </StyledTableCell>
              </StyledTableRow>
            ))}
        </DataTable>
      </div>
    </div>
  );
}

export function calculateHoursAndDays(shifts) {
  // in case user hasn't checked in, it means everything is at 0
  if (!shifts.length) {
    return {
      days: 0,
      hours: 0
    };
  }
  // return hours || minutes diffs in shifts
  const shiftArray = shifts.map(shift =>
    differenceInHours(shift.startedAt, shift.endedAt)
  );
  // separate shifts that are under one hour
  const filteredMinuteShifts = shiftArray.filter(shift => shift.includes('minutes'));
  const filteredHourShifts = shiftArray.filter(shift => shift.includes('hr'));
  const shiftReducer = (a, b) => a + b;
  // remove the hours and make it a number to do calculations
  const cleanHourShifts = filteredHourShifts.map(shift => {
    const clean = shift.replace(/hr|hrs/gi, '');
    return parseFloat(clean);
  });
  const cleanMinutesShifts = filteredMinuteShifts.map(shift => {
    const clean = shift.replace(/minutes/gi, '');
    return parseFloat(clean);
  });
  const totalMinutes = cleanMinutesShifts.reduce(shiftReducer, 0);
  const totalHours = cleanHourShifts.reduce(shiftReducer, 0);
  const totalHoursAndMinutes = totalMinutes / 60 + totalHours;

  return {
    hours: totalHoursAndMinutes.toFixed(2),
    days: filteredHourShifts.length
  };
}

EmployeeTimeSheetLog.prototype = {
  data: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  month: PropTypes.string.isRequired
};
