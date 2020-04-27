import React from 'react'
import { useQuery } from 'react-apollo'
import { useParams } from 'react-router'
import dateutil, { getWeekDay } from '../../utils/dateutil'
import { userTimeSheet } from '../../graphql/queries'
import { Spinner } from '../Loading'
import DataTable, { StyledTableCell, StyledTableRow } from './DataTable'

// TODO: @olivier => Fix the component with right data

export default function EmployeeTimeSheetLog() {
  const { id } = useParams()
  const { loading, data, error } = useQuery(userTimeSheet, {
    variables: {
      id,
    }
  })
  if (loading) return <Spinner />
  if (error) return <span>{error.message}</span>

  const shifts = data.userTimesheets
  const columns = ['Day', 'Date' , 'Start Time', 'Stop Time']

  return (
    <DataTable columns={columns}>
            {
                shifts.length && shifts.map(shift => (
                  <StyledTableRow key={shift.id}>
                      <StyledTableCell>{getWeekDay(shift.startedAt)}</StyledTableCell>
                      <StyledTableCell>{dateutil.dateToString(shift.startedAt)}</StyledTableCell>
                      <StyledTableCell>{dateutil.dateTimeToString(shift.startedAt)}</StyledTableCell>
                      <StyledTableCell>{shift.endedAt ? dateutil.dateTimeToString(shift.endedAt) : 'In-Progress'}</StyledTableCell>
                  </StyledTableRow>
                ))
            }
    </DataTable>
  )
}
