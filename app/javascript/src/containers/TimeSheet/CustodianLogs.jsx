import React, { Fragment } from 'react'
import Nav from '../../components/Nav'
import { useQuery } from 'react-apollo'
import { TimeSheetLogsQuery } from '../../graphql/queries'
import { Spinner } from '../../components/Loading'
import CustodianTimeSheetLogs from '../../components/TimeTracker/CustodianTimeSheetLog'

export default function CustodianLogs() {
  const { loading, data, error } = useQuery(TimeSheetLogsQuery)

  if (loading) return <Spinner />
  if (error) return <span>{error.message}</span>

  return (
    <Fragment>
      <Nav navName="Time Cards" menuButton="back" backTo="/" />
      <br />
      <CustodianTimeSheetLogs data={data}/>
    </Fragment>
  )
}
