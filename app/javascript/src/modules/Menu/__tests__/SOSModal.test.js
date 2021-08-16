import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import SOSModal from '../component/SOSModal';
import authState from '../../../__mocks__/authstate';

describe('SOSModal component', () => {
  const bind = jest.fn()
  const setOpen = jest.fn
  const theme = createMuiTheme();
  it('should render proper the sos modal', () => {
    const container = render(
      <ThemeProvider theme={theme}>
        <MockedProvider>
          <BrowserRouter>
            <SOSModal open setOpen={setOpen} bind={bind} {...{ authState }} />
          </BrowserRouter>
        </MockedProvider>
      </ThemeProvider>
    );

    expect(container.queryByTestId('sos-modal')).toBeInTheDocument();
    expect(container.queryByText('Press for 3 seconds')).toBeInTheDocument()
  
  });

});
