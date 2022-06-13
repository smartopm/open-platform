import React from 'react';
import { render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import GuestValidate from '../../Containers/GuestValidate';
import { Context } from '../../../../../containers/Provider/AuthStateProvider';
import MockedThemeProvider from '../../../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('Guest Validate component', () => {
  const data = {
    user: {
      id: 'a54d6184-b10e-4865-bee7-7957701d423d',
      name: 'Another somebodyy',
      userType: 'client',
      permissions: [
        { module: 'entry_request',
          permissions: ['can_grant_entry']
        },
      ],
      expiresAt: null,
      community: {
        supportName: 'Support Officer',
        features: { LogBook: { features: [] } }
      }
    }
  };
  it('should render correctly', () => {
    const container = render(
      <Context.Provider value={data}>
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <GuestValidate />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );
    expect(container.queryByTestId('stepper_container')).toBeInTheDocument();
  });
});
