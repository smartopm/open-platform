import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import UserLog from '../Components/UserLog';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('User infromation component loads', () => {
  const data = {
    result: [
      {
        id: '1',
        createdAt: '2020-06-18T13:47:42Z',
        sentence: 'I am testing this again',
        refType: 'Logs::EntryRequest',
        refId: '29837382eda2'
      }
    ]
  };
  it('should route appropriately when it is a request', () => {
    const routerMock = {
      push: jest.fn(() => '/some_routes')
    };
    const { getByText, getByTestId } = render(
      <MockedProvider mock={[]}>
        <BrowserRouter>
          <MockedThemeProvider>
            <UserLog data={data} router={routerMock} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    expect(getByText('I am testing this again')).toBeInTheDocument();

    fireEvent.click(getByTestId('log_title'));
    expect(routerMock.push).toBeCalled();
    expect(routerMock.push).toBeCalledWith(`/request/${data.result[0].refId}`);
  });

  it('should route appropriately when it is a user', () => {
    const routerMock = {
      push: jest.fn(() => '/some_routes')
    };
    const userData = {
      result: [
        {
          id: '12020232',
          createdAt: '2020-06-18T13:47:42Z',
          sentence: 'I am testing this again and again',
          refType: 'Users::User',
          refId: '283adjand293'
        }
      ]
    };
    const { getByText, getByTestId } = render(
      <MockedProvider mock={[]}>
        <BrowserRouter>
          <MockedThemeProvider>
            <UserLog data={userData} router={routerMock} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    expect(getByText('I am testing this again and again')).toBeInTheDocument();

    fireEvent.click(getByTestId('log_title'));
    expect(routerMock.push).toBeCalledWith(`/user/${userData.result[0].refId}`);
  });

  it('should render properly when no data is provided', () => {
    const routerMock = {
      push: jest.fn(() => '/some_routes')
    };
    const noData = {};
    const { getByText } = render(
      <MockedProvider mock={[]}>
        <BrowserRouter>
          <MockedThemeProvider>
            <UserLog data={noData} router={routerMock} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    expect(getByText('No logs found')).toBeInTheDocument();
  });
});
