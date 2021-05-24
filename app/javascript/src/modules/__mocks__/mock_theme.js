import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import PropTypes from 'prop-types'

function MockedThemeProvider({ children }) {
  const theme = createMuiTheme({});
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

MockedThemeProvider.propTypes = {
    children: PropTypes.node.isRequired
}

export default MockedThemeProvider;