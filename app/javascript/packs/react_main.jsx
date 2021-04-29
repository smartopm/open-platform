// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.
/* eslint-disable */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React, { useContext, useEffect, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Redirect, Route, useHistory } from 'react-router-dom';
import ReactGA from 'react-ga';
import { makeStyles } from '@material-ui/core/styles';
import { MuiThemeProvider } from '@material-ui/core';
import ApolloProvider from '../src/containers/Provider/ApolloProvider';
import AuthStateProvider, {
  Consumer,
  Context as AuthStateContext
} from '../src/containers/Provider/AuthStateProvider';
import UserShow from '../src/containers/UserShow';
import IDCard from '../src/containers/IdCard';
import EntryLogs from '../src/containers/AllLogs/EntryLogs';
import EventLogs from '../src/containers/AllLogs/EventLogs';
import Search from '../src/containers/Search';
import UserEdit from '../src/containers/UserEdit';
import Loading from '../src/shared/Loading';
import '../src/modules/i18n';
import Map from '../src/containers/Map';
import LoginScreen from '../src/components/AuthScreens/LoginScreen';
import ConfirmCodeScreen from '../src/components/AuthScreens/ConfirmCodeScreen';
import OneTimeLoginCode from '../src/components/AuthScreens/OneTimeLoginCode';
import Support from '../src/containers/Support';
import MobileMoney from '../src/components/MobileMoney';
import GuardHome from '../src/modules/Dashboard/Components/GuardHome';
import EntryRequest from '../src/containers/Requests/EntryRequest';
import RequestUpdate from '../src/containers/Requests/RequestUpdate';
import RequestConfirm from '../src/containers/Requests/RequestConfirm';
import WaitScreen from '../src/containers/Requests/WaitingScreen';
import RequestApproval from '../src/containers/Requests/RequestApproval';
import ErrorPage from '../src/components/Error';
import MainAuthCallback from '../src/components/AuthScreens/MainAuthCallback';
import ShowRoom from '../src/containers/showroom/Home';
import VisitingReasonScreen from '../src/containers/showroom/VisitReasonScreen';
import ComingSoon from '../src/containers/showroom/ComingSoon';
import VisitingClientForm from '../src/containers/showroom/CheckInForm';
import { AUTH_TOKEN_KEY } from '../src/utils/apollo';
import CheckInComplete from '../src/containers/showroom/CheckInComplete';
import Feedback from '../src/containers/Activity/Feedback';
import FeedbackSuccess from '../src/containers/Activity/FeedbackSuccess';
import AllNotes from '../src/containers/Activity/AllNotes';
import FeedbackPage from '../src/containers/Activity/AllFeedback';
import ShowroomLogs from '../src/containers/showroom/ShowroomLogs';
import EmployeeLogs from '../src/containers/TimeSheet/EmployeeLogs';
import ClientRequestForm from '../src/containers/ClientRequestForm';
import CampaignCreate from '../src/containers/Campaigns/CampaignCreate';
import Scan from '../src/containers/Scan';
import WelcomePage from '../src/components/AuthScreens/WelcomePage';
import CampaignUpdate from '../src/containers/Campaigns/CampaignUpdate';
import Posts from '../src/containers/Posts/Posts';
import PostPage from '../src/containers/Posts/PostPage';
import ThemeProvider from '../Themes/Nkwashi/ThemeProvider';
import DiscussonPage from '../src/containers/Discussions/DiscussionPage';
import BusinessProfile from '../src/containers/Businesses/BusinessProfile';
import GeoMap from '../src/containers/GeoMap';
import Notifications from '../src/containers/Preferences/Notifications';
import { theme } from '../src/themes/nkwashi/theme';
import FormPage from '../src/containers/Forms/FormPage';
import UsersImport from '../src/containers/UsersImport';

import FormBuilderPage from '../src/containers/Forms/FormBuilderPage';
import CommentsPage from '../src/containers/Comments/CommentPage';
import { MainMenu } from '../src/modules/Menu';
import modules from '../src/modules';
import UserRoutes from '../src/modules/Users/UserRoutes';

// The routes defined here are carefully arranged, be mindful when changing them

// Prevent Google Analytics reporting from staging and dev domains
const PRIMARY_DOMAINS = ['app.doublegdp.com'];

const LoggedInOnly = props => {
  const authState = useContext(AuthStateContext);
  if (authState.loggedIn) {
    return props.children;
  }
  return (
    <Redirect
      to={{
        pathname: '/login',
        state: { from: props.location }
      }}
    />
  );
};

/**
 * @deprecated will deprecate this in favor of individual module authorization using accessibleBy:[]
 *
 */
const AdminRoutes = props => {
  const authState = useContext(AuthStateContext);
  if (authState.user.userType === 'admin') {
    return props.children;
  }
  return <Redirect to="/" />;
};

const Logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  const authState = useContext(AuthStateContext);
  authState.setToken({ action: 'delete' });
  return <Redirect to="/login" />;
};
// page tracking
ReactGA.initialize('UA-150647211-2');

const Analytics = props => {
  const { gtag } = window;
  const liveAnalytics = (host => {
    return PRIMARY_DOMAINS.includes(host);
  })(window.location.host);

  const authState = useContext(AuthStateContext);
  const history = useHistory();

  useEffect(() => {
    const { user } = authState;

    if (user) {
      if (liveAnalytics) {
        console.debug('GA PRODUCTION MODE: UserData:', user.id, user.userType);
        gtag('set', { user_id: user.id });
        gtag('set', 'user_properties', { Role: user.userType });
        ReactGA.event({
          category: 'LoggedInUserType',
          action: user.userType,
          eventLabel: user.id,
          nonInteraction: true
        });
      } else {
        console.log('GA DEVELOPMENT MODE: log user', user);
      }
    }
    return history.listen(location => {
      if (location.pathname.includes('/id') || location.pathname.includes('/user')) {
        const [, rootURL, , userPage] = location.pathname.split('/');

        const pageHit = `/${rootURL}/${userPage}`;
        ReactGA.pageview(pageHit);
      } else {
        ReactGA.set({ page: location.pathname });
        ReactGA.pageview(location.pathname);
      }
    });
    // /* eslint-disable */-next-line react-hooks/exhaustive-deps
  }, [authState.user, history]);

  return props.children;
};

const App = () => {
  const classes = useStyles();
  return (
    <Suspense
      fallback={() => {
        return <Loading />;
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
                      <MainMenu />
                      <div className={classes.appContainer}>
                        <Switch>
                          <Consumer>
                            {({ user }) => (
                              <Switch>
                                {/* these are redirects for pages we don't have yet, they can only be placed here */}
                                {/* build individual modules for these once we have pages that directly route there */}
                                {/* beginning of redirects */}
                                <Route
                                  exact
                                  path="/plots"
                                  render={() => <Redirect to={`/user/${user.id}?tab=Plots`} />}
                                />
                                <Route
                                  exact
                                  path="/communication"
                                  render={() => <Redirect to={`/message/${user.id}`} />}
                                />
                                <Route
                                  exact
                                  path="/user_journey"
                                  render={() => (
                                    <Redirect to={`/user/${user.id}?tab=CustomerJourney`} />
                                  )}
                                />
                                <Route
                                  exact
                                  path="/myforms"
                                  render={() => <Redirect to={`/user/${user.id}?tab=Forms`} />}
                                />
                                <Route
                                  exact
                                  path="/mypayments"
                                  render={() => <Redirect to={`/user/${user.id}?tab=Payments`} />}
                                />
                                <Route
                                  exact
                                  path="/myprofile"
                                  render={() => <Redirect to={`/user/${user.id}`} />}
                                />
                                {/* end of redirects */}
                                {[...modules, ...UserRoutes].map(module => {
                                  if (module.subMenu) {
                                    return module.subMenu.map(sub => {
                                      let routes = [];
                                      if (sub.subRoutes) {
                                        routes = sub.subRoutes.map(subRoute => (
                                          <Route {...subRoute.routeProps} key={subRoute.name} />
                                        ));
                                      }
                                      routes.push(<Route {...sub.routeProps} key={sub.name} />);
                                      return routes;
                                    });
                                  }
                                  if (module.accessibleBy.includes(user.userType)) {
                                    return <Route exact {...module.routeProps} key={module.name} />;
                                  }
                                })}
                                <Route exact path="/scan" component={Scan} />
                                <Route exact path="/search" component={Search} />
                                <Route path="/id/:id" component={IDCard} />
                                <Route path="/entry_logs/:userId" component={EntryLogs} />
                                <Route path="/map" component={Map} />
                                <Route path="/myplot" component={GeoMap} />
                                <Route path="/mobile_money" component={MobileMoney} />
                                <Route path="/contact" component={Support} />
                                <Route path="/settings" component={Notifications} />
                                {/* <Route path="/otp_sent" component={OTPFeedbackScreen} /> */}
                                <Route path="/referral" component={UserEdit} />
                                <Route path="/myaccount/:id" component={UserShow} />
                                {/* requests */}
                                {/* Guard home is somehow kinda special leaving it now */}
                                <Route path="/guard_home" component={GuardHome} />
                                {/* Guard home ends */}
                                <Route path="/entry_request" component={EntryRequest} />
                                <Route path="/request/:id/:logs?" component={RequestUpdate} />
                                <Route path="/request_hos/:id/" component={RequestConfirm} />
                                <Route path="/request_wait/:id" component={WaitScreen} />
                                <Route
                                  path="/request_status/:id/edit"
                                  component={RequestApproval}
                                />
                                <Route path="/request_status/:id" component={RequestApproval} />
                                {/* Showroom kiosk routes */}
                                <Route path="/showroom_kiosk" component={ShowRoom} />
                                <Route path="/sh_reason" component={VisitingReasonScreen} />
                                <Route path="/sh_entry" component={VisitingClientForm} />
                                <Route path="/sh_complete" component={CheckInComplete} />
                                <Route path="/sh_soon" component={ComingSoon} />
                                {/* activity */}
                                <Route path="/feedback" component={Feedback} />
                                <Route path="/feedback_success" component={FeedbackSuccess} />
                                <Route path="/campaign-create" component={CampaignCreate} />
                                <Route path="/campaign/:id" component={CampaignUpdate} />
                                <Route path="/timesheet/:id" exact component={EmployeeLogs} />
                                <Route
                                  path="/client_request_from"
                                  exact
                                  component={ClientRequestForm}
                                />
                                <Route path="/news/:slug" exact component={Posts} />
                                <Route path="/discussions/:id" exact component={DiscussonPage} />
                                <Route path="/business/:id" exact component={BusinessProfile} />
                                <Route path="/form/:formId?/:formName?" component={FormPage} />
                                <Route path="/edit_form/:formId" component={FormBuilderPage} />
                                <Route
                                  path="/user_form/:formId?/:userId?/:formName?/:type?"
                                  component={FormPage}
                                />

                                <AdminRoutes>
                                  <Switch>
                                    <Route path="/users/import" component={UsersImport} />
                                    <Route path="/showroom_logs" component={ShowroomLogs} />
                                    <Route path="/notes" component={AllNotes} />
                                    <Route
                                      exact
                                      path="/todo/:taskId"
                                      render={({ match }) => (
                                        <Redirect to={`/tasks/${match.params.taskId}`} />
                                      )}
                                    />
                                    <Route
                                      exact
                                      path="/todo"
                                      render={() => <Redirect to="/tasks" />}
                                    />
                                    <Route path="/feedbacks" component={FeedbackPage} />
                                    <Route path="/event_logs" component={EventLogs} />
                                    <Route path="/new/user" exact component={UserEdit} />
                                    <Route path="/comments" exact component={CommentsPage} />
                                    <Route path="/visit_request" component={EntryRequest} />
                                  </Switch>
                                </AdminRoutes>
                                {/* we will also need a not found page for non-logged in user */}
                                {/* if you are going to move this to another line carry it like an egg */}
                                <Route
                                  render={() => (
                                    <ErrorPage title="Sorry!! We couldn't find this page" />
                                  )}
                                />
                              </Switch>
                            )}
                          </Consumer>
                        </Switch>
                      </div>
                    </LoggedInOnly>
                  </Switch>
                </Analytics>
              </ThemeProvider>
            </AuthStateProvider>
          </Router>
        </MuiThemeProvider>
      </ApolloProvider>
    </Suspense>
  );
};

const useStyles = makeStyles(() => ({
  '@media (min-width: 768px)': {
    appContainer: {
      marginLeft: '260px',

    }
  },
    appContainer: {
    '@supports ( -moz-appearance:none )': {
      paddingTop: '75px'
    }
  }
}));

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.getElementById('root'));
});
