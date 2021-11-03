import React from 'react'
import { addDecorator } from '@storybook/react'
import { ThemeProvider } from '@material-ui/core/styles'
import { theme } from '../app/javascript/src/themes/nkwashi/theme'
import { Context } from '../app/javascript/src/containers/Provider/AuthStateProvider'
import ApolloProvider from '../app/javascript/src/containers/Provider/ApolloProvider'
import { BrowserRouter } from 'react-router-dom'

const user = {
  loggedIn: true,
  loaded: true,
  user: {
    userType: 'admin'
  },
  token: '98374r8sjduhr8234ruiweufr823rsdbfnu3r4'
}

addDecorator(story => (
  <ThemeProvider theme={theme(null)}>
    <ApolloProvider>
      <BrowserRouter>
        <Context.Provider value={user}>{story()}</Context.Provider>
      </BrowserRouter>
    </ApolloProvider>
  </ThemeProvider>
))
