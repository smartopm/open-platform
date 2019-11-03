// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React, { useContext, Component, Suspense } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route
} from "react-router-dom";
import ApolloProvider from "../src/containers/Provider/ApolloProvider";
import AuthStateProvider, {
  Context as AuthStateContext
} from "../src/containers/Provider/AuthStateProvider";
import Home from "../src/containers/Home";
import UserShow from "../src/containers/UserShow";
import IDCard from "../src/containers/IdCard";
import EntryLogs from "../src/containers/EntryLogs";
import Search from "../src/containers/Search";
import UserEdit from "../src/containers/UserEdit";
import Upload from "../src/containers/UploadTest";
import PendingUsers from "../src/containers/PendingUsers";
import Loading from "../src/components/Loading.jsx";
import "../src/i18n";
import { WelcomeScreen } from "../src/components/AuthScreens/WelcomeScreen";

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

const App = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ApolloProvider>
        <AuthStateProvider>
          <Router>
            <LoggedInOnly>
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/scan" component={Scan} />
                <Route path="/search" component={Search} />
                <Route path="/id/:id" component={IDCard} />
                <Route path="/entry_logs/:userId" component={EntryLogs} />
                <Route path="/user" exact component={UserEdit} />
                <Route path="/user/pending" exact component={PendingUsers} />
                <Route path="/user/request" exact component={Request} />
                <Route path="/user/new" exact component={UserEdit} />
                <Route path="/user/:id" exact component={UserShow} />
                <Route path="/upload" component={Upload} />
                <Route path="/user/:id/edit" exact component={UserEdit} />
                <Route path="/user/request/:id" component={Request} />
                <Route path="/welcome" component={WelcomeScreen} />
              </Switch>
            </LoggedInOnly>
          </Router>
        </AuthStateProvider>
      </ApolloProvider>
    </Suspense>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(<App />, document.getElementById("root"));
});
