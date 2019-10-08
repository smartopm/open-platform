// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React, { useContext, Component } from 'react';
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import ApolloProvider from '../src/containers/Provider/ApolloProvider';
import AuthStateProvider, {Context as AuthStateContext} from '../src/containers/Provider/AuthStateProvider';
import Home from '../src/containers/Home';
import IDVerify from '../src/containers/IdVerify';
import IDCard from '../src/containers/IdCard';
import EntryLogs from '../src/containers/EntryLogs';
import Search from '../src/containers/Search';

class DynamicImport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      component: null
    }
  }
  componentDidMount () {
    this.props.load()
      .then((component) => {
        this.setState(() => ({
          component: component.default ? component.default : component
        }))
      })
  }
  render() {
    return this.props.children(this.state.component)
  }
}

const Scan = (props) => (
  <DynamicImport load={() => import('../src/containers/Scan.jsx')}>
    {(Component) => Component === null
      ? <p>Loading</p>
      : <Component {...props} />}
  </DynamicImport>
)

const LoggedInOnly = (props) => {
  const authState = useContext(AuthStateContext)
  if (authState.loggedIn) {
    return props.children
  }
  return <Redirect to="/login" />
}

const App = () => {
  return (
    <ApolloProvider>
      <AuthStateProvider>
        <Router>
          <LoggedInOnly>
            <Route path='/' exact component={Home}/>
            <Route path='/scan' component={Scan}/>
            <Route path='/search' component={Search}/>
            <Route path='/id/:id' component={IDCard}/>
            <Route path='/id_verify/:id' component={IDVerify}/>
            <Route path='/entry_logs/:memberId' component={EntryLogs}/>
          </LoggedInOnly>
        </Router>
      </AuthStateProvider>
    </ApolloProvider>
  )

}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.getElementById('root'))
})

