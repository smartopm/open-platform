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

const limit = 20
export default function EmployeeLogs() {
  const { id } = useParams()
  const [offset, setOffset] = useState(0)
  const { loading, data, error } = useQuery(UserTimeSheetQuery, {
    variables: {
      userId: id,
      offset,
      limit
    },
    fetchPolicy: 'no-cache'
  })
  const authState = useContext(AuthStateContext)

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) {
        return
      }
      setOffset(offset - limit)
    } else {
      setOffset(offset + limit)
    }
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
          offset={offset}
          limit={limit}
          handlePageChange={paginate}
        />
      </Grid>
    </Fragment>
  )
}