import React, { Fragment, useContext } from 'react'
import Nav from '../../components/Nav'
import { useQuery } from 'react-apollo'
import { TimeSheetLogsQuery } from '../../graphql/queries'
import Spinner from '../../components/Loading'
import CustodianTimeSheetLogs from '../../components/TimeTracker/CustodianTimeSheetLog'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider.js'
import { useHistory } from 'react-router/'
import ErrorPage from '../../components/Error'


export default function CustodianLogs() {
  const { loading, data, error } = useQuery(TimeSheetLogsQuery, {
    fetchPolicy: 'no-cache'
  })
  const authState = useContext(AuthStateContext)
  const history = useHistory()

  if (!['admin', 'custodian'].includes(authState.user.userType)) {
    history.push('/')
  }
  if (loading) return <Spinner />
 if (error) return <ErrorPage title={error.message} />

  return (
    <Fragment>
      <Nav navName="Time Cards" menuButton="back" backTo="/" />
      <br />
      <CustodianTimeSheetLogs data={data}/>
    </Fragment>
  )
}
