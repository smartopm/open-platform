// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React, { useContext, useState, Component, Suspense } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
  useLocation,
  useHistory
} from "react-router-dom";
import ApolloProvider from "../src/containers/Provider/ApolloProvider";
import AuthStateProvider, {
  Context as AuthStateContext
} from "../src/containers/Provider/AuthStateProvider";
import Home from "../src/containers/Home";
import UserShow from "../src/containers/UserShow";
import IDCard from "../src/containers/IdCard";
import IDPrint from "../src/containers/IdPrint";
import EntryLogs from "../src/containers/EntryLogs";
import Search from "../src/containers/Search";
import UserEdit from "../src/containers/UserEdit";
import PendingUsers from "../src/containers/PendingUsers";
import Loading from "../src/components/Loading.jsx";
import { WelcomeScreen } from "../src/components/AuthScreens/WelcomeScreen";
import "../src/i18n";
import Explore from "../src/containers/Explore";
import { LoginScreen } from "../src/components/AuthScreens/LoginScreen";
import ConfirmCodeScreen from "../src/components/AuthScreens/ConfirmCodeScreen";
import Support from "../src/containers/Support";
import GuardHome from "../src/containers/GuardHome";
import LogEntry from "../src/containers/LogEntry";

// Prevent Google Analytics reporting from staging and dev domains
const PRIMARY_DOMAINS = ["app.dgdp.site"];

class DynamicImport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      component: null
    };
  }
  componentDidMount() {
    this.props.load().then(component => {
      this.setState(() => ({
        component: component.default ? component.default : component
      }));
    });
  }
  render() {
    return this.props.children(this.state.component);
  }
}

const Scan = props => (
  <DynamicImport load={() => import("../src/containers/Scan.jsx")}>
    {Component => (Component === null ? <Loading /> : <Component {...props} />)}
  </DynamicImport>
);

const LoggedInOnly = props => {
  const authState = useContext(AuthStateContext);
  if (authState.loggedIn) {
    return props.children;
  }
  return <Redirect to="/login" />;
};

const Analytics = props => {
  const gtag = window.gtag;
  const location = useLocation();
  const history = useHistory();
  const [prevLocation, setLocation] = useState("");
  const liveAnalytics = (host => {
    return PRIMARY_DOMAINS.includes(host);
  })(window.location.host);

  if (location.pathname !== prevLocation) {
    if (history.action === "PUSH" && typeof gtag === "function") {
      const pageData = {
        page_location: window.location.href,
        page_path: location.pathname
      };
      if (liveAnalytics) {
        gtag("config", "G-W8TMB8D2SL", pageData);
      } else {
        console.log("GA DEVELOPMENT MODE:", pageData);
      }
    }
    setLocation(location.pathname);
  }

  return props.children;
};

const App = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ApolloProvider>
        <AuthStateProvider>
          <Router>
            <Analytics>
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
                  <Route path="/user/pending" exact component={PendingUsers} />
                  <Route path="/user/new" exact component={UserEdit} />
                  <Route path="/user/:id" exact component={UserShow} />
                  <Route path="/user/:id/edit" exact component={UserEdit} />
                  <Route path="/map" component={Explore} />
                  <Route path="/support" component={Support} />
                  {/* onboarding */}
                  <Route path="/welcome" component={WelcomeScreen} />
                  <Route path="/login_w" component={LoginScreen} />
                  <Route path="/code" component={ConfirmCodeScreen} />

                  {/* new routes => guards */}
                  <Route path="/log_entry" component={LogEntry} />
                  <Route path="/guard_home" component={GuardHome} />
                </Switch>
              </LoggedInOnly>
            </Analytics>
          </Router>
        </AuthStateProvider>
      </ApolloProvider>
    </Suspense>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(<App />, document.getElementById("root"));
});
