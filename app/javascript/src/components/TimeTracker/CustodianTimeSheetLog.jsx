import React from 'react'
import { useQuery } from 'react-apollo'
import { AllEventLogsQuery } from '../../graphql/queries'
import { Spinner } from '../Loading'
import DataTable, { StyledTableCell, StyledTableRow } from './DataTable'
import dateutil from '../../utils/dateutil'
import { useHistory } from 'react-router'

export default function EmployeeTimeSheetLog() {
  const { loading, data, error } = useQuery(AllEventLogsQuery, {
    variables: {
      subject: 'user_shift',
      refType: null,
      refId: null,
      limit: 100,
      offset: 0,
    }
  })
  const history = useHistory()
  if (loading) return <Spinner />
  if (error) return <span>{error.message}</span>

  const columns = ['Name', 'Last Shift' ]
  
  return (
    <DataTable columns={columns}>
            {
                data.result.map(event=> (
                  <StyledTableRow key={event.id} onClick={() => history.push(`/timesheet/${event.refId}`)}>
                      <StyledTableCell>{event.data.ref_name}</StyledTableCell>
                      <StyledTableCell>{dateutil.dateToString(new Date(event.data.shift.start_date))}</StyledTableCell>
                  </StyledTableRow>
                ))
            }
    </DataTable>
  )
}
