import React, { Fragment, useContext, useState } from 'react'
import Nav from '../../components/Nav'
import EmployeeTimeSheetLogs from '../../components/TimeTracker/EmployeeTimeSheetLog'
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider'
import { UserTimeSheetQuery } from '../../graphql/queries'
import Spinner  from '../../components/Loading'
import { useQuery } from 'react-apollo'
import { useParams } from 'react-router'
import ErrorPage from '../../components/Error'
import Paginate from '../../components/Paginate'
import Grid from '@material-ui/core/Grid'
import { utcDate } from '../../components/DateContainer'

export default function EmployeeLogs() {
  const { id } = useParams()
  const [monthCount, setMonthCount] = useState(-1)
  const date = new Date()
  const firstDay = new Date(date.getFullYear(), date.getMonth() + monthCount, 26)
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1 + monthCount, 25)
  const { loading, data, error, refetch } = useQuery(UserTimeSheetQuery, {
    variables: {
      userId: id,
      dateFrom: utcDate(firstDay),
      dateTo: utcDate(lastDay)
    },
    fetchPolicy: 'no-cache'
  })
  const authState = useContext(AuthStateContext)
  console.log(utcDate(firstDay))
console.log(utcDate(lastDay))

  function paginate(action) {
    if (action === 'prev') {
      setMonthCount(monthCount - 1)
    } else {
      setMonthCount(monthCount + 1)
    }
    refetch()
  }

  if (loading) return <Spinner />
  if (error) return <ErrorPage title={error.message} />

  return (
    <Fragment>
      <Nav navName="TimeSheet" menuButton="back" backTo={`/timesheet/`} />
      <br />
      <EmployeeTimeSheetLogs data={data} name={authState.user.name} />

      <Grid container direction="row" justify="center" alignItems="center">
        <Paginate
          count={data.userTimeSheetLogs.length}
          // offSet={offset}
          limit={30}
          handlePageChange={paginate}
        />
      </Grid>
    </Fragment>
  )
}