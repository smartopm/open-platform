import React from 'react'
import { useQuery } from 'react-apollo'
import { useParams } from 'react-router'
import dateutil, { getWeekDay } from '../../utils/dateutil'
import { AllEventLogsQuery } from '../../graphql/queries'
import { Spinner } from '../Loading'
import DataTable, { StyledTableCell, StyledTableRow } from './DataTable'

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
  const columns = ['Day', 'Date' , 'Start Time', 'Stop Time']
  
// Day, Date, Start Time, Stop Time, Total Hours in the day

return (
  <DataTable columns={columns}>
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
  </DataTable>
)
}
