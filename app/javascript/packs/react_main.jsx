// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React, { useState, useContext, Component } from 'react';
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import ApolloProvider from '../src/components/Provider/ApolloProvider';
import AuthStateProvider, {Context as AuthStateContext} from '../src/components/Provider/AuthStateProvider';
import Home from '../src/components/Home';
import IDVerify from '../src/components/IdVerify';
import IDCard from '../src/components/IdCard';
import Nav from '../src/components/Nav'

class DynamicImport extends Component {
  state = {
    component: null
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
  <DynamicImport load={() => import('../src/components/Scan.jsx')}>
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
            <Route component={Nav}/>
            <Route path='/' exact component={Home}/>
            <Route path='/scan' component={Scan}/>
            <Route path='/id/:id' component={IDCard}/>
            <Route path='/id_verify/:id' component={IDVerify}/>
          </LoggedInOnly>
        </Router>
      </AuthStateProvider>
    </ApolloProvider>
  )

}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.getElementById('root'))
})

