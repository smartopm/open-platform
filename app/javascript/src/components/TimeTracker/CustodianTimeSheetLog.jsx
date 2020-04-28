import React from 'react'
import { useQuery } from 'react-apollo'
import { AllEventLogsQuery } from '../../graphql/queries'
import { Spinner } from '../Loading'
import DataTable, { StyledTableCell, StyledTableRow } from './DataTable'
import dateutil from '../../utils/dateutil'
import { useHistory } from 'react-router'
import { Typography } from '@material-ui/core'
import Nav from '../Nav'

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

  const columns = ['Name', 'Last Shift']

  return (

    <div>
      <Nav navName="Timesheet" menuButton="back" backTo="/" />

      <DataTable columns={columns}>

        {
          data.result.map(event => (
            <StyledTableRow key={event.id} onClick={() => history.push(`/timesheet/${event.refId}`)}>
              <StyledTableCell>{event.data.ref_name}</StyledTableCell>

              <StyledTableCell>
                <div className='justify-content-between' >
                  <Typography variant="body1" color='textSecondary'><strong>{dateutil.dateToString(new Date(event.data.shift.start_date))}</strong></Typography>

                  <Typography variant="body1" color='textSecondary'><strong>2020</strong></Typography>
                  <br />
                  <Typography variant="caption" color='textSecondary'>More Details</Typography>
                </div>
              </StyledTableCell>
            </StyledTableRow>
          ))
        }

      </DataTable>

    </div>
  )
}
