import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import CustodianTimeSheetLogs from './CustodianTimeSheetLog'
import { Spinner } from '../../../shared/Loading'
import Paginate from '../../../components/Paginate'
import CenteredContent from '../../../shared/CenteredContent'
import { TimeSheetLogsQuery } from '../graphql/timecard_queries'
import { formatError } from '../../../utils/helpers'

const limit = 20
export default function CustodianLogs() {
  const [offset, setOffset] = useState(0)
  const { loading, data, error } = useQuery(TimeSheetLogsQuery, {
    fetchPolicy: 'no-cache'
  })

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
  if (error) return <CenteredContent>{formatError(error?.message)}</CenteredContent>;

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
