import React from 'react'
import { useLocation } from 'react-router'
import dateutil from '../../utils/dateutil'

import DataTable, { StyledTableCell, StyledTableRow } from './DataTable'
import Typography from '@material-ui/core/Typography'
import { zonedDate } from '../DateContainer'

export default function EmployeeTimeSheetLog({ data }) {
  const { state } = useLocation()

  const shifts = data.userTimeSheetLogs
  const columns = ['Day', 'Date', 'Start Time', 'Stop Time', 'Total Hours']
  // Day, Date, Start Time, Stop Time, Total Hours in the day
  return (
    <div>
      <div className="container">
        <div className="container " style={{ marginRight: 10 }}>
          <Typography variant="body1" style={{ marginLeft: 10 }}>
            <strong>Name: {state && state.name}</strong>
          </Typography>
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
                <StyledTableCell>
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