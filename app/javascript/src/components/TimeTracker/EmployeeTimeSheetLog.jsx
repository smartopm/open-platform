import React from 'react'
import { useQuery } from 'react-apollo'
import { Table, TableBody, TableHead, TableRow } from '@material-ui/core'
import { useParams } from 'react-router'
import {
  StyledTableCell,
  StyledTableRow,
  useStyles
} from '../../containers/Users'
import dateutil, { getWeekDay } from '../../utils/dateutil'
import { AllEventLogsQuery } from '../../graphql/queries'

export default function EmployeeTimeSheetLog() {
  const { id } = useParams()
  const { loading, data, error } = useQuery(AllEventLogsQuery, {
    variables: {
      subject: 'user_shift',
      refType: null,
      refId: id,
      limit: 10,
      offset: 0,
    }
  })
  const classes = useStyles()

  if (loading) return '<Loading />'
  if (error) return <span>{error.message}</span>

  const shifts = data.result.map(res => res.data.shift)

//   day
// Day, Date, Start Time, Stop Time, Total Hours in the day
  return (
    <Table stickyHeader className={classes.table} aria-label="timesheet table">
      <TableHead>
        <TableRow>
          <StyledTableCell align="right">Day</StyledTableCell>
          <StyledTableCell align="right">Date</StyledTableCell>
          <StyledTableCell align="right">Start Time</StyledTableCell>
          <StyledTableCell align="right">Stop Time</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
          {
              shifts.map((shift, i) => (
                <StyledTableRow key={i}>
                    <StyledTableCell align="right">{getWeekDay(shift.start_date)}</StyledTableCell>
                    <StyledTableCell align="right">{dateutil.dateToString(shift.start_date)}</StyledTableCell>
                    <StyledTableCell align="right">{dateutil.dateTimeToString(shift.start_date)}</StyledTableCell>
                    <StyledTableCell align="right">{shift.end_date && dateutil.dateTimeToString(shift.end_date)}</StyledTableCell>
                </StyledTableRow>
              ))
          }
      </TableBody>
    </Table>
  )
}
