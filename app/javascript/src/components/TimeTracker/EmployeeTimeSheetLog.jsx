import React from 'react'
import { useQuery } from 'react-apollo'
import { useParams } from 'react-router'
import dateutil, { getWeekDay } from '../../utils/dateutil'
import { AllEventLogsQuery } from '../../graphql/queries'
import { Spinner } from '../Loading'
import DataTable, { StyledTableCell, StyledTableRow } from './DataTable'
import Typography from '@material-ui/core/Typography'
import Nav from '../Nav'

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
  if (loading) return <Spinner />
  if (error) return <span>{error.message}</span>

  const shifts = data.result.map(res => res.data.shift)
  const columns = ['Day', 'Date', 'Start Time', 'Stop Time']

  // Day, Date, Start Time, Stop Time, Total Hours in the day

  return (

    <div>

      <Nav navName="Timesheet" menuButton="back" backTo="/timesheet" />
      <div className="container">

        <div className="container " style={{ marginRight: 10 }}>
          <Typography variant="body1" style={{ marginLeft: 10 }} >
            <strong>Name: </strong>
          </Typography>
        </div>
        <div className="d-flex container justify-content-between pb-0">

          <Typography variant="body2" style={{ marginLeft: 10 }} >
            <strong>Total days worked this month:10 </strong>
          </Typography>

          <Typography variant="body2" style={{ marginRight: 10 }}>
            <strong>Total hours worked this month:10 </strong>
          </Typography>

        </div>
        <DataTable columns={columns}>
          {
            shifts.map((shift, i) => (
              <StyledTableRow key={i}>
                <StyledTableCell>{getWeekDay(shift.start_date)}</StyledTableCell>
                <StyledTableCell>{dateutil.dateToString(shift.start_date)}</StyledTableCell>
                <StyledTableCell>{dateutil.dateTimeToString(shift.start_date)}</StyledTableCell>
                <StyledTableCell>{shift.end_date && dateutil.dateTimeToString(shift.end_date)}</StyledTableCell>
              </StyledTableRow>
            ))
          }
        </DataTable>

      </div>

    </div>
  )


}
