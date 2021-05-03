/* eslint-disable no-use-before-define */
import React, { useContext } from 'react'
import Divider from '@material-ui/core/Divider';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider'
import Loading from '../../../shared/Loading'
import Homepage from '../../../components/HomePage'
import { TaskReminder } from '../../Tasks'
import { PaymentSummary } from '../../Payments'
import UserDetail from '../../Users/Components/UserDetail'
import ViewCustomerJourney from '../../CustomerJourney/Components/ViewCustomerJourney'
import LanguageToggle from '../../i18n/Components/LanguageToggle';
import NewsFeed from '../../News/Components/NewsFeed';
import { PlotDetail } from '../../Plots'
import CustomerJourneyStatus from '../../CustomerJourney/Components/CustomerJourneyStatus'

export default function Home() {
  const authState = useContext(AuthStateContext)

  if (!authState.loggedIn) return <Loading />
  return (
    // todo: tolu will refactor this to be more dynamic
    <div style={{backgroundColor: '#FFFFFF', marginTop: '-30px'}}>
      <LanguageToggle />
      {authState.user.userType === 'admin' && (
        <div>
          <UserDetail user={authState.user} />
          <ViewCustomerJourney />
          <PaymentSummary authState={authState} />
          <br />
          <Divider />
          <TaskReminder />
          <Divider />
          <NewsFeed wordpressEndpoint={authState.user?.community.wpLink} />
        </div>
      )}
      {authState.user.userType === 'client' && (
        (
          <div>
            <UserDetail user={authState.user} />
            {authState.user.subStatus && (
              <CustomerJourneyStatus subStatus={authState.user.subStatus} />
            )}
            <Divider />
            <PlotDetail authState={authState.user} />
            <Divider />
            <NewsFeed />
          </div>
        )
      )}
      {authState.user.userType !== 'admin' && authState.user.userType !==  'client'  && (
        <div>
          <NewsFeed wordpressEndpoint={authState.user?.community.wpLink} />
          <Homepage authState={authState} />
        </div>
      )}
    </div>
  )
}
