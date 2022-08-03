import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import { useQuery } from 'react-apollo'
import { useParams } from 'react-router'
import EmployeeTimeSheetLogs from './EmployeeTimeSheetLog'
import Loading  from '../../../shared/Loading'
import ErrorPage from '../../../components/Error'
import Paginate from '../../../components/Paginate'
import { dateToString } from '../../../utils/dateutil'
import { UserTimeSheetQuery } from '../graphql/timecard_queries'


export default function EmployeeLogs() {
  const { id } = useParams()
  const [monthCount, setMonthCount] = useState(-1)
  const date = new Date()
  let month = date.getMonth()
  if (date.getDate() >= 27) {
    month += 1
  }
  const firstDay = new Date(date.getFullYear(), month + monthCount, 27)
  const lastDay = new Date(date.getFullYear(), month + 1 + monthCount, 26)

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

  if (loading) return <Loading />
  if (error) return <ErrorPage title={error.message} />

  return (
    <>
      <br />
      <EmployeeTimeSheetLogs
        data={data}
        name={
        Boolean(data.userTimeSheetLogs.length) &&
        data.userTimeSheetLogs[0].user.name
      }
        lastDay={dateToString(lastDay)}
        firstDay={dateToString(firstDay)}
      />

      <Grid container direction="row" justifyContent="center" alignItems="center">
        <Paginate
          count={data.userTimeSheetLogs.length}
        // This does not matter. It's there to make pagination links active
          limit={-1}
          active
          handlePageChange={paginate}
        />
      </Grid>
    </>
);
}