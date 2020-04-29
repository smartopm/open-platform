import React, { Fragment } from 'react'
import Nav from '../../components/Nav'
import EmployeeTimeSheetLogs from '../../components/TimeTracker/EmployeeTimeSheetLog'
import { UserTimeSheetQuery } from '../../graphql/queries'
import { Spinner } from '../../components/Loading'
import { useQuery } from 'react-apollo'
import { useParams } from 'react-router'


export default function EmployeeLogs() {
  const { id } = useParams()
  const { loading, data, error } = useQuery(UserTimeSheetQuery, {
    variables: {
      userId: id
    }
  })
  if (loading) return <Spinner />
  if (error) return <span>{error.message}</span>

  return (
    <Fragment>
      <Nav navName="TimeSheet" menuButton="back" backTo={`/timesheet/`} />
      <br />
      <EmployeeTimeSheetLogs data={data}/>
    </Fragment>
  )
}
