import React from 'react'
import { useQuery } from 'react-apollo'
import { Table, TableBody, TableHead, TableRow } from '@material-ui/core'
import {
  StyledTableCell,
  StyledTableRow,
  useStyles
} from '../../containers/Users'
import { AllEventLogsQuery } from '../../graphql/queries'
import { useHistory } from 'react-router'

export default function CustodianTimeSheetLog() {
  const { loading, data, error } = useQuery(AllEventLogsQuery, {
    variables: {
      subject: 'user_shift',
      refType: null,
      refId: null,
      limit: 20,
      offset: 0,
    }
  })
  const classes = useStyles()
  const history = useHistory()

  if (loading) return '<Loading />'
  if (error) return <span>{error.message}</span>

//   day
// Day, Date, Start Time, Stop Time, Total Hours in the day
  return (
    <Table stickyHeader className={classes.table} aria-label="timesheet table">
      <TableHead>
        <TableRow>
          <StyledTableCell align="right">Name</StyledTableCell>
          <StyledTableCell align="right">Total Hours</StyledTableCell>
          {/* 
          
          <StyledTableCell align="right">Start Time</StyledTableCell>
          <StyledTableCell align="right">Stop Time</StyledTableCell> */}
        </TableRow>
      </TableHead>
      <TableBody>
          {
              data.result.map(event => (
                <StyledTableRow key={event.id} onClick={() => history.push(`/timesheet/${event.refId}`)}>
                    <StyledTableCell align="right">{event.data.ref_name}</StyledTableCell>
                    {/* 
                    <StyledTableCell align="right">{getWeekDay(shift.start_date)}</StyledTableCell>
                    <StyledTableCell align="right">{dateutil.dateToString(shift.start_date)}</StyledTableCell>
                    <StyledTableCell align="right">{dateutil.dateTimeToString(shift.start_date)}</StyledTableCell>
                    <StyledTableCell align="right">{shift.end_date && dateutil.dateTimeToString(shift.end_date)}</StyledTableCell> */}
                </StyledTableRow>
              ))
          }
      </TableBody>
    </Table>
  )
}
