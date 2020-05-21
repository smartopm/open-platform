import React, { Fragment, useContext, useState } from 'react'
import Nav from '../../components/Nav'
import { useQuery } from 'react-apollo'
import { TimeSheetLogsQuery } from '../../graphql/queries'
import Spinner from '../../components/Loading'
import CustodianTimeSheetLogs from '../../components/TimeTracker/CustodianTimeSheetLog'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider.js'
import { useHistory } from 'react-router/'
import ErrorPage from '../../components/Error'
import Paginate from '../../components/Paginate'
import Grid from '@material-ui/core/Grid'
import CenteredContent from '../../components/CenteredContent'

const limit = 20
export default function CustodianLogs() {
  const [offset, setOffset] = useState(0)
  const { loading, data, error } = useQuery(TimeSheetLogsQuery, {
    fetchPolicy: 'no-cache'
  })
  const authState = useContext(AuthStateContext)
  const history = useHistory()

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

  if (!['admin', 'custodian'].includes(authState.user.userType)) {
    history.push('/')
  }
  if (loading) return <Spinner />
 if (error) return <ErrorPage title={error.message} />

  return (
    <Fragment>
      <Nav navName="Time Cards" menuButton="back" backTo="/" />
      <br />
      <CustodianTimeSheetLogs data={data} />
      <CenteredContent>
        <Paginate
          count={data.timeSheetLogs.length}
          offSet={offset}
          limit={limit}
          handlePageChange={paginate}
        />
      </CenteredContent>
    </Fragment>
  )
}
