// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React, { useState } from 'react';
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from "react-router-dom";
import Drawer from './src/components/drawer.jsx'
import QRScan from './src/components/scan.jsx'

const App = () => {
  return (
    <Router>
      <Drawer>
        <Route path='/scan'>
          <QRScan />
        </Route>
      </Drawer>
    </Router>
  )

}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.getElementById('root'))
})

