// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React, { useState, Component } from 'react';
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from "react-router-dom";
import Provider from '../src/components/Provider';
import IDCard from '../src/components/id_card';
import Drawer from '../src/components/drawer.jsx'

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
  <DynamicImport load={() => import('../src/components/scan.jsx')}>
    {(Component) => Component === null
      ? <p>Loading</p>
      : <Component {...props} />}
  </DynamicImport>
)

const App = () => {
  return (
    <Provider>
      <Router>
        <Drawer>
          <Route path='/scan' component={Scan}/>
          <Route path='/react_id/:id' component={IDCard}/>
        </Drawer>
      </Router>
    </Provider>
  )

}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.getElementById('root'))
})

