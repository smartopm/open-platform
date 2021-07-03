import React, { useContext, useState } from 'react'
import { useQuery } from 'react-apollo'
import { useHistory } from 'react-router/'
import CustodianTimeSheetLogs from './CustodianTimeSheetLog'
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider'
import Loading from '../../../shared/Loading'
import ErrorPage from '../../../components/Error'
import Paginate from '../../../components/Paginate'
import CenteredContent from '../../../components/CenteredContent'
import { TimeSheetLogsQuery } from '../graphql/timecard_queries'

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

  if (!['admin', 'custodian'].includes(authState.user?.userType)) {
    history.push('/')
  }
  if (loading) return <Loading />
 if (error) return <ErrorPage title={error.message} />

  return (
    <>
      <br />
      <CustodianTimeSheetLogs data={data} />
      <CenteredContent>
        <Paginate
          count={data.timeSheetLogs.length}
          offSet={offset}
          limit={limit}
          active={offset >= 1}
          handlePageChange={paginate}
        />
      </CenteredContent>
    </>
  )
}
