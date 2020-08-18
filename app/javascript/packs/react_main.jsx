// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import 'core-js/stable'
import 'regenerator-runtime/runtime'

import React, { useContext, useEffect, Suspense } from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
  useHistory
} from 'react-router-dom'
import ReactGA from 'react-ga'
import ApolloProvider from '../src/containers/Provider/ApolloProvider'
import AuthStateProvider, {
  Context as AuthStateContext
} from '../src/containers/Provider/AuthStateProvider'
import Home from '../src/containers/Home'
import UserShow from '../src/containers/UserShow'
import IDCard from '../src/containers/IdCard'
import IDPrint from '../src/containers/IdPrint'
import EntryLogs from '../src/containers/AllLogs/EntryLogs'
import UserLogs from '../src/containers/AllLogs/UserLogs'
import EventLogs from '../src/containers/AllLogs/EventLogs'
import Search from '../src/containers/Search'
import UserEdit from '../src/containers/UserEdit'
import PendingUsers from '../src/containers/PendingUsers'
import Loading from '../src/components/Loading.jsx'
import '../src/i18n'
import Map from '../src/containers/Map'
import { LoginScreen } from '../src/components/AuthScreens/LoginScreen'
import ConfirmCodeScreen from '../src/components/AuthScreens/ConfirmCodeScreen'
import OneTimeLoginCode from '../src/components/AuthScreens/OneTimeLoginCode'
import Support from '../src/containers/Support'
import MobileMoney from '../src/components/MobileMoney'
import GuardHome from '../src/containers/GuardHome'
import EntryRequest from '../src/containers/Requests/EntryRequest'
import RequestUpdate from '../src/containers/Requests/RequestUpdate'
import RequestConfirm from '../src/containers/Requests/RequestConfirm'
import WaitScreen from '../src/containers/Requests/WaitingScreen'
import RequestApproval from '../src/containers/Requests/RequestApproval'
import ErrorPage from '../src/components/Error'
import MainAuthCallback from '../src/components/AuthScreens/MainAuthCallback'
import ShowRoom from '../src/containers/showroom/Home'
import VisitingReasonScreen from '../src/containers/showroom/VisitReasonScreen'
import ComingSoon from '../src/containers/showroom/ComingSoon'
import VisitingClientForm from '../src/containers/showroom/CheckInForm'
import { AUTH_TOKEN_KEY } from '../src/utils/apollo'
import CheckInComplete from '../src/containers/showroom/CheckInComplete'
import Todo from '../src/containers/Todo'
import OTPFeedbackScreen from '../src/containers/OTPScreen'
import Feedback from '../src/containers/Activity/Feedback'
import FeedbackSuccess from '../src/containers/Activity/FeedbackSuccess'
import AllNotes from '../src/containers/Activity/AllNotes'
import FeedbackPage from '../src/containers/Activity/AllFeedback'
import UsersList from '../src/containers/Users'
import ShowroomLogs from '../src/containers/showroom/ShowroomLogs'
import AllMessages from '../src/containers/Messages/AllMessages'
import UserMessages from '../src/containers/Messages/UserMessages'
import CustodianLogs from '../src/containers/TimeSheet/CustodianLogs'
import EmployeeLogs from '../src/containers/TimeSheet/EmployeeLogs'
import ClientRequestForm from '../src/containers/ClientRequestForm'
import NkwashiAccountManagement from '../src/containers/NkwashiAccountManagement'
import CampaignCreate from '../src/containers/Campaigns/CampaignCreate'
import Campaigns from '../src/containers/Campaigns/Campaigns'
import Scan from '../src/containers/Scan.jsx'
import WelcomePage from '../src/components/AuthScreens/WelcomePage'
import CampaignUpdate from '../src/containers/Campaigns/CampaignUpdate'
import Posts from '../src/containers/Posts/Posts'
import NewsPage from '../src/containers/Posts/NewsPage'
import PostPage from '../src/containers/Posts/PostPage'
import ThemeProvider from '../Themes/Nkwashi/ThemeProvider'
import Discussions from '../src/containers/Discussions/Discussions'
import DiscussonPage from '../src/containers/Discussions/DiscussionPage'
import Businesses from '../src/containers/Businesses/Businesses'
import BusinessProfile from '../src/containers/Businesses/BusinessProfile'
import GeoMap from '../src/containers/GeoMap'
import Notifications from '../src/containers/Preferences/Notifications'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: '#d32f2f'
    },
    primary: {
      main: '#69ABA4'
    }
  }
})

// Prevent Google Analytics reporting from staging and dev domains
const PRIMARY_DOMAINS = ['app.doublegdp.com']

const LoggedInOnly = props => {
  const authState = useContext(AuthStateContext)
  if (authState.loggedIn) {
    return props.children
  }
  return (
    <Redirect
      to={{
        pathname: '/login',
        state: { from: props.location }
      }}
    />
  )
}

const AdminRoutes = props => {
  const authState = useContext(AuthStateContext)
  if (authState.user.userType === 'admin') {
    return props.children
  }
  return (
    <Redirect
      to={{
        pathname: '/',
        state: { from: props.location }
      }}
    />
  )
}

const Logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  const authState = useContext(AuthStateContext)
  authState.setToken({ action: 'delete' })
  return <Redirect to="/login" />
}
//page tracking
ReactGA.initialize('UA-150647211-2')

const Analytics = props => {
  const gtag = window.gtag
  const liveAnalytics = (host => {
    return PRIMARY_DOMAINS.includes(host)
  })(window.location.host)

  const authState = useContext(AuthStateContext)
  const history = useHistory()

  useEffect(() => {
    const user = authState.user

    if (user) {
      if (liveAnalytics) {
        console.debug('GA PRODUCTION MODE: UserData:', user.id, user.userType)
        gtag('set', { user_id: user.id })
        gtag('set', 'user_properties', { Role: user.userType })
        ReactGA.event({
          category: 'LoggedInUserType',
          action: user.userType,
          eventLabel: user.id,
          nonInteraction: true
        })
      } else {
        console.log('GA DEVELOPMENT MODE: log user', user)
      }
    }
    return history.listen(location => {
      if (
        location.pathname.includes('/id') ||
        location.pathname.includes('/user')
      ) {
        let [, rootURL, , userPage] = location.pathname.split('/')

        let pageHit = `/${rootURL}/${userPage}`
        ReactGA.pageview(pageHit)
      } else {
        ReactGA.set({ page: location.pathname })
        ReactGA.pageview(location.pathname)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.user, history])

  return props.children
}

const App = () => {
  return (
    <Suspense
      fallback={() => {
        return <Loading />
      }}
    >
      <ApolloProvider>
      <MuiThemeProvider theme={theme}>
        <Router history={history}>
          <AuthStateProvider>
            <ThemeProvider>
              <Analytics>
                {/* onboarding */}
                <Switch>
                  <Route path="/welcome" component={WelcomePage} />
                  <Route path="/login" component={LoginScreen} />
                  <Route path="/code/:id" component={ConfirmCodeScreen} />
                  <Route path="/l/:id/:code" component={OneTimeLoginCode} />
                  <Route path="/logout" component={Logout} />
                  <Route path="/google/:token" component={MainAuthCallback} />
                  <Route path="/facebook/:token" component={MainAuthCallback} />

                  {/* Spike page */}
                  <Route path="/news/post/:id" exact component={PostPage} />

                  <LoggedInOnly>
                    <Switch>
                      <Route path="/" exact component={Home} />
                      <Route path="/scan" component={Scan} />
                      <Route path="/search" component={Search} />
                      <Route path="/id/:id" component={IDCard} />
                      <Route path="/print/:id" component={IDPrint} />
                      <Route path="/entry_logs/:userId" component={EntryLogs} />
                      <Route path="/entry_logs" component={EntryLogs} />
                      <Route path="/user" exact component={UserEdit} />
                      <Route path="/map" component={Map} />
                      <Route path="/myplot" component={GeoMap} />
                      <Route path="/mobile_money" component={MobileMoney} />
                      <Route path="/contact" component={Support} />
                      <Route path="/settings" component={Notifications} />
                      <Route path="/otp_sent" component={OTPFeedbackScreen} />
                      <Route path="/referral" component={UserEdit} />
                      <Route path="/myaccount/:id" component={UserShow} />
                      {/* new routes => guards */}
                      <Route path="/guard_home" component={GuardHome} />
                      {/* requests */}
                      <Route path="/entry_request" component={EntryRequest} />
                      <Route path="/request/:id" component={RequestUpdate} />
                      <Route
                        path="/request_hos/:id/"
                        component={RequestConfirm}
                      />
                      <Route path="/request_wait/:id" component={WaitScreen} />
                      <Route
                        path="/request_status/:id/edit"
                        component={RequestApproval}
                      />
                      <Route
                        path="/request_status/:id"
                        component={RequestApproval}
                      />
                      {/* Showroom kiosk routes */}
                      <Route path="/showroom_kiosk" component={ShowRoom} />
                      <Route
                        path="/sh_reason"
                        component={VisitingReasonScreen}
                      />
                      <Route path="/sh_entry" component={VisitingClientForm} />
                      <Route path="/sh_complete" component={CheckInComplete} />
                      <Route path="/sh_soon" component={ComingSoon} />
                      {/* activity */}
                      
                      <Route path="/feedback" component={Feedback} />
                      <Route
                        path="/feedback_success"
                        component={FeedbackSuccess}
                      />
                      <Route path="/message/:id" component={UserMessages} />
                      <Route
                        path="/campaign-create"
                        component={CampaignCreate}
                      />
                      <Route path="/campaigns" component={Campaigns} />
                      <Route path="/campaign/:id" component={CampaignUpdate} />
                      {/* users */}
                      {/*Nkwashi account management*/}
                      <Route
                        path="/account"
                        component={NkwashiAccountManagement}
                      />
                      <Route path="/user/:id/edit" exact component={UserEdit} />{' '}
                      {/* Still admin route */}
                      <Route
                        path="/user/:id/logs"
                        exact
                        component={UserLogs}
                      />{' '}
                      {/* Still admin route */}
                      <Route path="/user/:id/:tm?/:dg?" component={UserShow} />
                      <Route
                        path="/timesheet"
                        exact
                        component={CustodianLogs}
                      />
                      <Route
                        path="/timesheet/:id"
                        exact
                        component={EmployeeLogs}
                      />
                      <Route
                        path="/client_request_from"
                        exact
                        component={ClientRequestForm}
                      />
                      <Route path="/news" exact component={NewsPage} />
                      <Route path="/news/:slug" exact component={Posts} />
                      <Route
                        path="/discussions"
                        exact
                        component={Discussions}
                      />
                      <Route
                        path="/discussions/:id"
                        exact
                        component={DiscussonPage}
                      />
                      <Route path="/business" exact component={Businesses} />
                      <Route
                        path="/business/:id"
                        exact
                        component={BusinessProfile}
                      />
                      <AdminRoutes>
                        <Switch>
                          <Route
                            path="/client_request_from"
                            exact
                            component={ClientRequestForm}
                          />
                          <Route path="/users" component={UsersList} />
                          <Route path="/messages" component={AllMessages} />
                          <Route
                            path="/showroom_logs"
                            component={ShowroomLogs}
                          />
                          <Route path="/notes" component={AllNotes} />
                          <Route path="/todo" component={Todo} />
                          <Route path="/my_tasks" component={Todo} />
                          <Route path="/feedbacks" component={FeedbackPage} />
                          <Route path="/event_logs" component={EventLogs} />

                          <Route path="/new/user" exact component={UserEdit} />
                          <Route
                            path="/pending"
                            exact
                            component={PendingUsers}
                          />
                        </Switch>
                      </AdminRoutes>
                      <Route
                        path="*"
                        render={() => (
                          <ErrorPage title="Sorry Page not Found" />
                        )}
                      />
                    </Switch>
                  </LoggedInOnly>
                </Switch>
              </Analytics>
            </ThemeProvider>
          </AuthStateProvider>
          </Router>
          </MuiThemeProvider>
      </ApolloProvider>
    </Suspense>
  )
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.getElementById('root'))
})
