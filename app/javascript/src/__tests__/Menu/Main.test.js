import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import Main, { MainNav, NewsNav } from '../../Main';
import authState from '../../__mocks__/authstate';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Main Nav component', () => {
  const theme = createMuiTheme();
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
    expect(container.queryAllByTestId('sidenav-container')).toHaveLength(2);
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
    const wrapper = render(
      <NewsNav>
        <h4>This is the content for the nav maybe a title</h4>
      </NewsNav>
    );
    expect(wrapper.queryByText('This is the content for the nav maybe a title')).toBeInTheDocument()
  });
});
