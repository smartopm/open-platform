import React, { Fragment, useContext } from 'react'
import Nav from '../../components/Nav'
import EmployeeTimeSheetLogs from '../../components/TimeTracker/EmployeeTimeSheetLog'
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider'
import { UserTimeSheetQuery } from '../../graphql/queries'
import Spinner  from '../../components/Loading'
import { useQuery } from 'react-apollo'
import { useParams } from 'react-router'
import ErrorPage from '../../components/Error'


export default function EmployeeLogs() {
  const { id } = useParams()
  const { loading, data, error } = useQuery(UserTimeSheetQuery, {
    variables: {
      userId: id
    },
    fetchPolicy: 'no-cache'
  })
  const authState = useContext(AuthStateContext)

  if (loading) return <Spinner />
  if (error) return <ErrorPage title={error.message} />

  return (
    <Fragment>
      <Nav navName="TimeSheet" menuButton="back" backTo={`/timesheet/`} />
      <br />
      <EmployeeTimeSheetLogs data={data} name={authState.user.name} />
    </Fragment>
  )
}
