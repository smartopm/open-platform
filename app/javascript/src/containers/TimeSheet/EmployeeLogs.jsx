import React, { Fragment, useState } from 'react'
import Nav from '../../components/Nav'
import EmployeeTimeSheetLogs from '../../components/TimeTracker/EmployeeTimeSheetLog'
import { UserTimeSheetQuery } from '../../graphql/queries'
import Spinner  from '../../components/Loading'
import { useQuery } from 'react-apollo'
import { useParams } from 'react-router'
import ErrorPage from '../../components/Error'
import Paginate from '../../components/Paginate'
import Grid from '@material-ui/core/Grid'
import dateutil from '../../utils/dateutil'
import { zonedDate } from '../../components/DateContainer'

export default function EmployeeLogs() {
  const { id } = useParams()
  const [monthCount, setMonthCount] = useState(-1)
  const date = new Date()
  const firstDay = new Date(date.getFullYear(), date.getMonth() + 1 + monthCount, 27)
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 2 + monthCount, 26)

  const { loading, data, error } = useQuery(UserTimeSheetQuery, {
    variables: {
      userId: id,
      dateFrom: firstDay.toUTCString(),
      dateTo: lastDay.toUTCString(),
    },
    fetchPolicy: 'no-cache'
  })

  function paginate(action) {
    if (action === 'prev') {
      setMonthCount(monthCount - 1)
    } else {
      setMonthCount(monthCount + 1)
    }
  }

  if (loading) return <Spinner />
  if (error) return <ErrorPage title={error.message} />

  return (
    <Fragment>
      <Nav navName="TimeSheet" menuButton="back" backTo={`/timesheet/`} />
      <br />
      <EmployeeTimeSheetLogs
        data={data}
        name={
          Boolean(data.userTimeSheetLogs.length) &&
          data.userTimeSheetLogs[0].user.name
        }
        lastDay={dateutil.dateToString(zonedDate(lastDay))}
        firstDay={dateutil.dateToString(zonedDate(firstDay))}
      />

      <Grid container direction="row" justify="center" alignItems="center">
        <Paginate
          count={data.userTimeSheetLogs.length}
          active={true}
          handlePageChange={paginate}
        />
      </Grid>
    </Fragment>
  )
}