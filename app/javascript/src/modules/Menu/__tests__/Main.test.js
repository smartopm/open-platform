import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import Main, { MainNav, NewsNav } from '../component/Main';
import authState from '../../../__mocks__/authstate';
import { Context } from '../../../containers/Provider/AuthStateProvider';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Main Nav component', () => {
  const theme = createTheme();
  const mockGeolocation = {
    getCurrentPosition: jest.fn()
      .mockImplementationOnce((success) => Promise.resolve(success({
        coords: {
          latitude: 51.1,
          longitude: 45.3
        }
      }))),
      watchPosition: jest.fn(),
  };
  global.navigator.geolocation = mockGeolocation;

  it('should render proper the main nav', async () => {
    const container = render(
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <MockedProvider>
            <BrowserRouter>
              <MainNav authState={authState} />
            </BrowserRouter>
          </MockedProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    );

    await waitFor(() => {
      expect(container.queryByTestId('nav-container')).toBeInTheDocument();

      fireEvent.click(container.queryByTestId('drawer'));

      expect(container.queryAllByTestId('sidenav-container')[0]).toBeInTheDocument();
      expect(container.queryAllByTestId('sidenav-container')).toHaveLength(1);
    }, 10)

  });
  it('should render the main', async () => {
    const wrapper =  render(
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <MockedProvider>
            <Context.Provider value={authState}>
              <BrowserRouter>
                <Main />
              </BrowserRouter>
            </Context.Provider>
          </MockedProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    );

    await waitFor(() => {
      expect(wrapper.queryByTestId('loader')).toBeInTheDocument();
    }, 10)
  });
  it('should test the ordinary nav', () => {
    const historyMock = { push: jest.fn() }
    const wrapper = render(
      <NewsNav history={historyMock}>
        <h4>This is the content for the nav maybe a title</h4>
      </NewsNav>
    );
    expect(wrapper.queryByText('This is the content for the nav maybe a title')).toBeInTheDocument()
    fireEvent.click(wrapper.queryByTestId('take_me_back_icon'));
    expect(historyMock.push).toBeCalled()
  });
});
