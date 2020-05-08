import React from 'react'
import { useLocation } from 'react-router'
import dateutil from '../../utils/dateutil'
import DataTable, { StyledTableCell, StyledTableRow } from './DataTable'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { zonedDate } from '../DateContainer'
import { PropTypes } from 'prop-types'


export default function EmployeeTimeSheetLog({ data, name }) {
  const { state } = useLocation()

  const shifts = data.userTimeSheetLogs
  const columns = ['Day', 'Date', 'Start Time', 'Stop Time', 'Total Hours']
  // Day, Date, Start Time, Stop Time, Total Hours in the day

  function calculateHoursAndDays(shifts) {
    // in case user hasn't checked in, it means everything is at 0
    if (!shifts.length) {
      return {
        days: 0,
        hours: 0
      }
    }
    // return hours || minutes diffs in shifts
    const shiftArray = shifts.map(shift =>
      dateutil.differenceInHours(
        zonedDate(shift.startedAt),
        zonedDate(shift.endedAt || new Date())
      )
    )
    // separate shifts that are under one hour
    const filteredMinuteShifts = shiftArray.filter(shift => shift.includes('minutes'))
    const filteredHourShifts = shiftArray.filter(shift => shift.includes('hr'))
    const shiftReducer = (a, b) => a + b
    // remove the hours and make it a number to do calculations
    const cleanHourShifts = filteredHourShifts.map(shift => {
      const clean = shift.replace(/hr|hrs/gi, '')
      return parseFloat(clean)
    })
    const cleanMinutesShifts = filteredMinuteShifts.map(shift => {
      const clean = shift.replace(/minutes/gi, '')
      return parseFloat(clean)
    })
    const totalMinutes = cleanMinutesShifts.reduce(shiftReducer, 0)
    const totalHours = cleanHourShifts.reduce(shiftReducer, 0)
    const totalHoursAndMinutes = (totalMinutes / 60) + totalHours

    return {
      hours: totalHoursAndMinutes.toFixed(2),
      days: filteredHourShifts.length
    }
  }
  return (
    <div>
      <div className="container">
        <div className="container " style={{ marginRight: 10 }}>
          <Typography variant="body1" style={{ marginLeft: 10 }}>
            <strong data-testid="emp_name">
              Name: {(state && state.name) || name}
            </strong>
          </Typography>
          <br />
          <Grid container justify="flex-start">
            <Grid item xs={8}>
              <strong>
                Total days worked this month:{' '}
                {calculateHoursAndDays(shifts).days}
              </strong>
            </Grid>
            <Grid item xs={4}>
              <strong>
                Total hours worked this month:{' '}
                {calculateHoursAndDays(shifts).hours}
              </strong>
            </Grid>
          </Grid>
        </div>
        {/* Removed total of hours and days till we have that. */}

        <DataTable columns={columns}>
          {Boolean(shifts.length) &&
            shifts.map(shift => (
              <StyledTableRow key={shift.id}>
                <StyledTableCell>
                  {dateutil.getWeekDay(zonedDate(shift.startedAt))}
                </StyledTableCell>
                <StyledTableCell>
                  {dateutil.dateToString(zonedDate(shift.startedAt))}
                </StyledTableCell>
                <StyledTableCell>
                  {dateutil.dateTimeToString(zonedDate(shift.startedAt))}
                </StyledTableCell>
                <StyledTableCell>
                  {shift.endedAt
                    ? dateutil.dateTimeToString(zonedDate(shift.endedAt))
                    : 'In-Progress'}
                </StyledTableCell>
                <StyledTableCell data-testid="prog">
                  {shift.endedAt
                    ? dateutil.differenceInHours(
                        zonedDate(shift.startedAt),
                        zonedDate(shift.endedAt)
                      )
                    : 'In-Progress'}
                </StyledTableCell>
              </StyledTableRow>
            ))}
        </DataTable>
      </div>
    </div>
  )
}


EmployeeTimeSheetLog.prototype = {
  data: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired
}