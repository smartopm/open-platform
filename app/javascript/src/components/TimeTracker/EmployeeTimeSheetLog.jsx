import React from 'react'
import { useQuery } from 'react-apollo'
import { useParams } from 'react-router'
import dateutil from '../../utils/dateutil'
import { UserTimeSheetQuery } from '../../graphql/queries'
import { Spinner } from '../Loading'
import DataTable, { StyledTableCell, StyledTableRow } from './DataTable'
import { zonedDate } from '../DateContainer'

export default function EmployeeTimeSheetLog() {
  const { id } = useParams()
  const { loading, data, error } = useQuery(UserTimeSheetQuery, {
    variables: {
      userId: id,
    }
  })
  if (loading) return <Spinner />
  if (error) return <span>{error.message}</span>

  const shifts = data.userTimeSheetLogs
  const columns = ['Day', 'Date' , 'Start Time', 'Stop Time', 'Total Hours']
  return (
    <DataTable columns={columns}>
            {
                shifts.length && shifts.map(shift => (
                  <StyledTableRow key={shift.id}>
                      <StyledTableCell>{dateutil.getWeekDay(zonedDate(shift.startedAt))}</StyledTableCell>
                      <StyledTableCell>{dateutil.dateToString(zonedDate(shift.startedAt))}</StyledTableCell>
                      <StyledTableCell>{dateutil.dateTimeToString(zonedDate(shift.startedAt))}</StyledTableCell>
                      <StyledTableCell>{shift.endedAt ? dateutil.dateTimeToString(zonedDate(shift.endedAt)) : 'In-Progress'}</StyledTableCell>
                      <StyledTableCell>{shift.endedAt ? dateutil.differenceInHours(zonedDate(shift.startedAt), zonedDate(shift.endedAt)) : 'In-Progress'}</StyledTableCell>
                  </StyledTableRow>
                ))
            }
    </DataTable>
  )
}
