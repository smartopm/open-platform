import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import { useQuery } from 'react-apollo'
import { useParams } from 'react-router'
import EmployeeTimeSheetLogs from './EmployeeTimeSheetLog'
import { UserTimeSheetQuery } from '../../../graphql/queries'
import Loading  from '../../../shared/Loading'
import ErrorPage from '../../../components/Error'
import Paginate from '../../../components/Paginate'
import { dateToString } from '../../../utils/dateutil'


export default function EmployeeLogs() {
  const { id } = useParams()
  const [monthCount, setMonthCount] = useState(-1)
  const date = new Date()
  const firstDay = new Date(date.getFullYear(), date.getMonth() + monthCount, 27)
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1 + monthCount, 26)

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

      <Grid container direction="row" justify="center" alignItems="center">
        <Paginate
          count={data.userTimeSheetLogs.length}
          active
          handlePageChange={paginate}
        />
      </Grid>
    </>
  )
}