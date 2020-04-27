import React from 'react'
import { useQuery } from 'react-apollo'
import { TimeSheetLogsQuery } from '../../graphql/queries'
import { Spinner } from '../Loading'
import DataTable, { StyledTableCell, StyledTableRow } from './DataTable'
import dateutil from '../../utils/dateutil'
import { useHistory } from 'react-router'

export default function EmployeeTimeSheetLog() {
  const { loading, data, error } = useQuery(TimeSheetLogsQuery)
  const history = useHistory()
  if (loading) return <Spinner />
  if (error) return <span>{error.message}</span>

  const columns = ['Name', 'Last Shift' ]
  return (
    <DataTable columns={columns}>
            {
                data.timeSheetLogs.map(shift=> (
                  <StyledTableRow key={shift.id} onClick={() => history.push(`/timesheet/${shift.userId}`)}>
                      <StyledTableCell>{shift.user.name}</StyledTableCell>
                      <StyledTableCell>{dateutil.dateToString(new Date(shift.startedAt))}</StyledTableCell>
                  </StyledTableRow>
                ))
            }
    </DataTable>
  )
}
