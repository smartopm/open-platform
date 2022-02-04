import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import { createTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

function MockedThemeProvider({ children }) {
  const theme = createTheme({
    props: { MuiWithWidth: { initialWidth: "sm" } },
  });
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}



MockedThemeProvider.propTypes = {
    children: PropTypes.node.isRequired
}

export default MockedThemeProvider;