import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import Main, { MainNav, NewsNav } from '../component/Main';
import authState from '../../../__mocks__/authstate';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Main Nav component', () => {
  const theme = createMuiTheme();
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

  it('should render proper the main nav', () => {
    const container = render(
      <ThemeProvider theme={theme}>
        <MockedProvider>
          <BrowserRouter>
            <MainNav authState={authState} />
          </BrowserRouter>
        </MockedProvider>
      </ThemeProvider>
    );

    expect(container.queryByTestId('nav-container')).toBeInTheDocument();

    fireEvent.click(container.queryByTestId('drawer'));

    expect(container.queryAllByTestId('sidenav-container')[0]).toBeInTheDocument();
    expect(container.queryAllByTestId('sidenav-container')).toHaveLength(1);
  });
  it('should render the main', () => {
    render(
      <ThemeProvider theme={theme}>
        <MockedProvider>
          <BrowserRouter>
            <Main />
          </BrowserRouter>
        </MockedProvider>
      </ThemeProvider>
    );
  });
  it('should test the ordinary nav', () => {
    const historyMock = jest.fn()
    const wrapper = render(
      <NewsNav history={historyMock}>
        <h4>This is the content for the nav maybe a title</h4>
      </NewsNav>
    );
    expect(wrapper.queryByText('This is the content for the nav maybe a title')).toBeInTheDocument()
  });
});
