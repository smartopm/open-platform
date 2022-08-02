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
import makeStyles from '@mui/styles/makeStyles';
import { ThemeProvider, StyledEngineProvider } from '@mui/material';
import ApolloProvider from '../src/containers/Provider/ApolloProvider';
import AuthStateProvider, {
  Consumer,
  Context as AuthStateContext
} from '../src/containers/Provider/AuthStateProvider';
import UserShow from '../src/modules/Users/Containers/UserShow';
import IDCard from '../src/containers/IdCard';
import EventLogs from '../src/modules/LogBook/Components/EventLogs';
import Loading from '../src/shared/Loading';
import '../src/modules/i18n';
import Map from '../src/containers/Map';
import LoginScreen from '../src/components/AuthScreens/LoginScreen';
import ConfirmCodeScreen from '../src/components/AuthScreens/ConfirmCodeScreen';
import OneTimeLoginCode from '../src/components/AuthScreens/OneTimeLoginCode';
import MobileMoney from '../src/components/MobileMoney';
import GuardHome from '../src/modules/Dashboard/Components/GuardHome';
import ErrorPage from '../src/components/Error';
import MainAuthCallback from '../src/components/AuthScreens/MainAuthCallback';
import { AUTH_TOKEN_KEY, AUTH_FORWARD_URL_KEY } from '../src/utils/apollo';
import Feedback from '../src/containers/Activity/Feedback';
import FeedbackSuccess from '../src/containers/Activity/FeedbackSuccess';
import AllNotes from '../src/containers/Activity/AllNotes';
import ProjectsList from '../src/modules/Tasks/Processes/Components/ProjectsList';
import TaskLists from '../src/modules/Tasks/TaskLists/Components/TaskLists'; // TODO: Remove after Task Lists menu is set up
import TaskListConfigure from '../src/modules/Tasks/TaskLists/Components/TaskListConfigure';
import AddSubTasks from '../src/modules/Tasks/TaskLists/Components/AddSubTasks';
import FeedbackPage from '../src/containers/Activity/AllFeedback';
import ShowroomLogs from '../src/containers/showroom/ShowroomLogs';
import ClientRequestForm from '../src/containers/ClientRequestForm';
import CampaignCreate from '../src/modules/Campaigns/containers/Campaigns';
import Scan from '../src/containers/Scan';
import WelcomePage from '../src/components/AuthScreens/WelcomePage';
import CampaignUpdate from '../src/modules/Campaigns/containers/Campaigns';
import DiscussonPage from '../src/modules/Discussions/Containers/DiscussionPage';
import GeoMap from '../src/containers/GeoMap';
import Notifications from '../src/modules/Preferences/Components/Notifications';
import { theme } from '../src/themes/nkwashi/theme';
import FormPage from '../src/modules/Forms/containers/FormPage';
import FormEntriesPage from '../src/modules/Forms/containers/FormEntriesPage';
import FormBuilderPage from '../src/modules/Forms/containers/FormBuilderPage';
import CommentsPage from '../src/containers/Comments/CommentPage';
import { MainMenu } from '../src/modules/Menu';
import modules from '../src/modules';
import UserRoutes from '../src/modules/Users/UserRoutes';
import I18Initializer from '../src/modules/i18n/Components/I18Initializer';
import PostPage from '../src/modules/News/Components/PostPage';
import Posts from '../src/modules/News/Components/Posts';
import { checkAllowedCommunityFeatures } from '../src/utils/helpers';
import BusinessProfile from '../src/modules/Business/Components/BusinessProfilePage';
import EmployeeTimeSheetLog from '../src/modules/TimeCard/Components/EmployeeLogs';
import EmailBuilderDialog from '../src/modules/Emails/components/EmailBuilderDialog';
import { PRIMARY_DOMAINS } from '../src/utils/constants';
import TaskProcessDetail from '../src/modules/Tasks/Processes/Components/TaskProcessDetail';
import GuestQRPage from '../src/modules/LogBook/Components/GuestQRPage';
import Welcome from '../src/modules/LogBook/Kiosk/components/Welcome';
import Accesspage from '../src/modules/LogBook/Kiosk/components/AccessPage';
import ScanPage from '../src/modules/LogBook/Kiosk/components/Scan';
import Errorpage from '../src/modules/LogBook/Kiosk/components/ErrorPage';
import ProcessList from '../src/modules/Processes/Components/ProcessList';
import ProcessBuilderPage from '../src/modules/Processes/Components/ProcessBuilderPage';
import ProcessCommentsPage from '../src/modules/Tasks/Processes/Components/ProcessCommentsPage';
import LanguagePage from '../src/modules/LogBook/Kiosk/components/LanguagePage';
import Page404 from '../src/shared/404';
import { RenderCommunityForms } from '../src/modules/Forms/ManageForms';
import SnackbarProvider from '../src/shared/snackbar/Context';
// The routes defined here are carefully arranged, be mindful when changing them

const LoggedInOnly = props => {
  const authState = useContext(AuthStateContext);
  if (authState.loggedIn) {
    return props.children;
  }
  return (
    <Redirect
      to={{
        pathname: '/login',
        state: { from: props.location },
        search: `?next=${props.location.pathname}`
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
  sessionStorage.removeItem(AUTH_FORWARD_URL_KEY)
  const authState = useContext(AuthStateContext);
  authState.setToken({ action: 'delete' });
  return <Redirect to="/login" />;
};
// page tracking

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
        gtag('set', { user_id: user.id });
        gtag('set', 'user_properties', { Role: user.userType });
        ReactGA.event({
          category: 'LoggedInUserType',
          action: user.userType,
          eventLabel: user.id,
          nonInteraction: true
        });
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
        <Router history={history}>
          <AuthStateProvider>
            <Analytics>
              <I18Initializer
                render={community => (
                  <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme(community?.themeColors)}>
                      <SnackbarProvider>
                      {/* onboarding */}
                      <Switch>
                        <Route path="/welcome" component={WelcomePage} />
                        <Route path="/login/:next?" component={LoginScreen} />
                        <Route path="/code/:id" component={ConfirmCodeScreen} />
                        <Route
                          path="/l/:id/:code/:type?/:requestId?"
                          component={OneTimeLoginCode}
                        />
                        <Route path="/logout" component={Logout} />
                        <Route path="/google/:token" component={MainAuthCallback} />
                        <Route path="/facebook/:token" component={MainAuthCallback} />

                        {/* Spike page */}
                        <Route path="/news/post/:id" exact component={PostPage} />
                        {/* Public form */}
                        <Route path="/form/:formId/public" exact component={FormPage} />

                        <LoggedInOnly>
                          <Switch>
                            <Route path="/logbook/kiosk" exact component={LanguagePage} />
                            <Route path="/logbook/kiosk/index" exact component={Welcome} />
                            <Route path="/logbook/kiosk/success" exact component={Accesspage} />
                            <Route path="/logbook/kiosk/error" exact component={Errorpage} />
                            <Route path="/logbook/kiosk/scan" exact component={ScanPage} />
                            <Consumer>
                              {({ user }) => (
                                <>
                                  <MainMenu />
                                  <div className={classes.appContainer} id="app-container">
                                    <Switch>
                                      {/* these are redirects for pages we don't have yet, they can only be placed here */}
                                      {/* build individual modules for these once we have pages that directly route there */}
                                      {/* beginning of redirects */}
                                      <Route
                                        exact
                                        path="/plots"
                                        render={() => (
                                          <Redirect to={`/user/${user.id}?tab=Plots`} />
                                        )}
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
                                        path="/mypayments"
                                        render={() => (
                                          <Redirect to={`/user/${user.id}?tab=Payments`} />
                                        )}
                                      />
                                      <Route
                                        exact
                                        path="/mymessages"
                                        render={() => <Redirect to={`/message/${user.id}`} />}
                                      />
                                      <Route
                                        exact
                                        path="/myprofile"
                                        render={() => <Redirect to={`/user/${user.id}`} />}
                                      />
                                      <Route exact path="/tasks/task_lists" component={TaskLists} />
                                      <Route
                                        exact
                                        path="/tasks/task_lists/new"
                                        component={TaskListConfigure}
                                      />
                                      <Route
                                        exact
                                        path="/tasks/task_lists/edit/:taskId"
                                        component={TaskListConfigure}
                                      />
                                      <Route
                                        exact
                                        path="/tasks/task_lists/:taskId"
                                        component={AddSubTasks}
                                      />
                                      <Route
                                        path="/processes/:id/comments"
                                        component={ProcessCommentsPage}
                                      />
                                      {/* end of redirects */}
                                      {[...modules, ...UserRoutes].map(module => {
                                        if (module.subMenu) {
                                          return module.subMenu.map(sub => {
                                            if (sub.subMenu) {
                                              return sub.subMenu.map(subSubMenu => {
                                                let subSubMenuRoutes = [];

                                                if (
                                                  subSubMenu.subRoutes &&
                                                  checkAllowedCommunityFeatures(
                                                    user.community.features,
                                                    subSubMenu.featureName
                                                  )
                                                ) {
                                                  subSubMenuRoutes = subSubMenu.subRoutes.map(
                                                    subRoute => (
                                                      <Route
                                                        {...subRoute.routeProps}
                                                        key={subRoute.name}
                                                      />
                                                    )
                                                  );
                                                }
                                                checkAllowedCommunityFeatures(
                                                  user.community.features,
                                                  subSubMenu.featureName
                                                ) &&
                                                  subSubMenuRoutes.push(
                                                    <Route
                                                      {...subSubMenu.routeProps}
                                                      key={subSubMenu.name}
                                                    />
                                                  );
                                                return subSubMenuRoutes;
                                              });
                                            }
                                            let routes = [];
                                            if (
                                              sub.subRoutes &&
                                              checkAllowedCommunityFeatures(
                                                user.community.features,
                                                sub.featureName
                                              )
                                            ) {
                                              routes = sub.subRoutes.map(subRoute => (
                                                <Route
                                                  {...subRoute.routeProps}
                                                  key={subRoute.name}
                                                />
                                              ));
                                            }
                                            checkAllowedCommunityFeatures(
                                              user.community.features,
                                              sub.featureName
                                            ) &&
                                              routes.push(
                                                <Route {...sub.routeProps} key={sub.name} />
                                              );
                                            return routes;
                                          });
                                        }
                                        // module.accessibleBy.includes(user.userType)
                                        // to be deprecated and permissions checked at module level
                                        if (
                                          checkAllowedCommunityFeatures(
                                            user.community.features,
                                            module.featureName
                                          ) &&
                                          (module.moduleName !== undefined ||
                                            module.accessibleBy.includes(user.userType))
                                        ) {
                                          return <Route exact {...module.routeProps} key={module.name} />;
                                        }
                                      })}

                                      <Route exact path='/forms/create' component={RenderCommunityForms} />
                                      <Route exact path="/scan" component={Scan} />
                                      <Route path="/id/:id" component={IDCard} />
                                      <Route path="/map" component={Map} />
                                      <Route path="/myplot" component={GeoMap} />
                                      <Route path="/mobile_money" component={MobileMoney} />
                                      <Route path="/settings" component={Notifications} />
                                      <Route path="/myaccount/:id" component={UserShow} />
                                      {/* requests */}
                                      {/* Guard home is somehow kinda special leaving it now */}
                                      <Route path="/guard_home" component={GuardHome} />
                                      {/* Guard home ends */}
                                      <Route path="/feedback" component={Feedback} />
                                      <Route path="/feedback_success" component={FeedbackSuccess} />
                                      <Route path="/campaign-create" component={CampaignCreate} />
                                      <Route path="/campaign/:id" component={CampaignUpdate} />
                                      <Route
                                        path="/timesheet/:id"
                                        exact
                                        component={EmployeeTimeSheetLog}
                                      />
                                      <Route
                                        path="/client_request_from"
                                        exact
                                        component={ClientRequestForm}
                                      />
                                      <Route path="/news/slug" exact component={Posts} />
                                      <Route
                                        path="/discussions/:id"
                                        exact
                                        component={DiscussonPage}
                                      />
                                      <Route
                                        path="/business/:id"
                                        exact
                                        component={BusinessProfile}
                                      />
                                      <Route
                                        path="/edit_form/:formId"
                                        exact
                                        component={FormBuilderPage}
                                      />
                                      <Route
                                        path="/form/:formId/private"
                                        exact
                                        component={FormPage}
                                      />
                                      {/* Handle backward compatibility with existing forms for logged in users */}
                                      <Route
                                        exact
                                        path="/form/:formId"
                                        render={({ match }) => (
                                          <Redirect to={`/form/${match.params.formId}/private`} />
                                        )}
                                      />
                                      <Route
                                        path="/form/:formId?/:formName?/entries"
                                        component={FormEntriesPage}
                                      />

                                      <Route
                                        path="/mail_templates/:emailId"
                                        component={EmailBuilderDialog}
                                      />
                                      <Route
                                        path="/user_form/:userId?/:formUserId?/:type?"
                                        component={FormPage}
                                      />
                                      <Route
                                        exact
                                        path="/processes/templates/create"
                                        component={ProcessBuilderPage}
                                      />
                                      <Route
                                        exact
                                        path="/processes/templates/edit"
                                        component={ProcessBuilderPage}
                                      />
                                      <Route path="/processes/templates" component={ProcessList} />
                                      <Route
                                        path="/processes/:processId/projects/:id"
                                        component={TaskProcessDetail}
                                      />
                                      <Route
                                        path="/processes/:id/projects"
                                        component={ProjectsList}
                                      />
                                      <Route
                                        exact
                                        path="/entry_logs"
                                        render={() => <Redirect to="/logbook" />}
                                      />
                                      <Route exact path="/qr/invite/:id" component={GuestQRPage} />
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
                                      {/* Deprecated Routes */}
                                      <Route path="/showroom_logs" render={() => <Page404 />} />
                                      <Route path="/notes" render={() => <Page404 />} />
                                      {/* TODO: Remove this wrapper after routes move to their modules */}
                                      <AdminRoutes>
                                        <Switch>
                                          {/* TODO: Migrate to EventLogs module */}
                                          <Route path="/event_logs" component={EventLogs} />
                                          {/* TODO: Migrate to Feedback module */}
                                          <Route path="/feedbacks" component={FeedbackPage} />
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
                                  </div>
                                </>
                              )}
                            </Consumer>
                          </Switch>
                        </LoggedInOnly>
                      </Switch>
                      </SnackbarProvider>
                    </ThemeProvider>
                  </StyledEngineProvider>
                )}
              />
            </Analytics>
          </AuthStateProvider>
        </Router>
      </ApolloProvider>
    </Suspense>
  );
};

const useStyles = makeStyles(() => ({
  appContainer: {
    '@supports ( -moz-appearance:none )': {
      paddingTop: '75px'
    }
  }
}));

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.getElementById('root'));
});
