import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import UserInformation from '../Components/UserInformation';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import authState from '../../../__mocks__/authstate';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('User information component loads', () => {
  const data = {
    user: {
      id: '1',
      name: 'Yoram',
      state: 'Valid',
      userType: 'admin',
      formUsers: [],
      substatusLogs: []
    }
  };

  const parcelData = [
    {
      id: 'hiuwkeh',
      parcelNumber: 'ho2ij3',
      updatedAt: '2020-10-20T06:23:12Z'
    }
  ];

  const accountData = {
    user: {
      accounts: [
        {
          id: 'jlklkwe',
          updatedAt: '2020-10-21T06:23:12Z',
          landParcels: [
            {
              id: 'c9de32f7-ad64-41ed-9c05-79d85d088b1b',
              parcelNumber: 'las',
              updatedAt: '2020-10-22T06:23:12Z'
            }
          ]
        }
      ]
    }
  };
  it('should render user name on contacts tab', async () => {
    const mock = jest.fn();
    const routeMock = {
      push: mock
    };
    const { getByText } = render(
      <MockedProvider mock={data}>
        <BrowserRouter>
          <MockedThemeProvider>
            <UserInformation
              data={data}
              authState={authState}
              accountData={accountData}
              parcelData={parcelData}
              onLogEntry={mock}
              sendOneTimePasscode={mock}
              refetch={mock}
              userId={data.user.id}
              router={routeMock}
              accountRefetch={mock}
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(
      () => {
        expect(getByText('Yoram')).toBeInTheDocument();
        expect(getByText('common:user_types.admin')).toBeInTheDocument();
        expect(getByText('common:form_fields.full_name')).toBeInTheDocument();
        expect(getByText('common:form_fields.accounts')).toBeInTheDocument();
        expect(getByText('common:form_fields.primary_number')).toBeInTheDocument();
        expect(getByText('common:form_fields.primary_email')).toBeInTheDocument();
        expect(getByText('common:form_fields.primary_address')).toBeInTheDocument();
      },
      { timeout: 5 }
    );
  });
});
