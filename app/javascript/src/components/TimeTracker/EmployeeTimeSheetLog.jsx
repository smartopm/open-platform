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
        <div className="d-flex container justify-content-between pb-0">
          <Typography variant="body2" key={1} style={{ marginLeft: 10 }}>
            <strong>Total days worked this month:10 </strong>
          </Typography>

          <Typography variant="body2" key={2} style={{ marginRight: 10 }}>
            <strong>Total hours worked this month:10 </strong>
          </Typography>
        </div>
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
