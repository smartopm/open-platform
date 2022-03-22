import React from 'react';
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material';
import PropTypes from 'prop-types'

function MockedThemeProvider({ children }) {
  const theme = createTheme({
    props: { MuiWithWidth: { initialWidth: "sm" } },
  });
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  );
}

MockedThemeProvider.propTypes = {
    children: PropTypes.node.isRequired
}

export default MockedThemeProvider;
