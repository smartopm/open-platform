import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import GuestForm from '../../Components/GuestForm';
import { Context } from '../../../../../containers/Provider/AuthStateProvider';
import MockedThemeProvider from '../../../../__mocks__/mock_theme';
import { EntryRequestContext } from '../../Context'
import authState from '../../../../../__mocks__/authstate';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('Guest Form component', () => {
  it('should render correctly', () => {
    const next = jest.fn()
    const grant = jest.fn()
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <EntryRequestContext.Provider value={
                  {
                    request: {
                      id: 'someids',
                      guest: { status: 'active' }
                     },
                    observationDetails: {
                      isError: false,
                      message: 'granted'
                    },
                    grantAccess: grant
                  }
                  }
              >
                <GuestForm handleNext={next} />
              </EntryRequestContext.Provider>
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );
    expect(container.queryAllByText('form_fields.full_name')[0]).toBeInTheDocument();
    expect(container.queryByTestId('entry_user_grant')).toBeInTheDocument();

    fireEvent.click(container.queryByTestId('entry_user_grant')) // no access to validation errors
  });
});
