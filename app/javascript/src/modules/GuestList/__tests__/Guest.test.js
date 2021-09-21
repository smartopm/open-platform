import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import Guest from '../Components/Guest';

describe('Should render Guest Book Component', () => {
    const handleGuestDetails = jest.fn()
    const handleGuestRevoke = jest.fn()

    const guestListEntry =
        {
        id: 'a91dbad4-eeb4',
        name: 'Test Mutuba',
        user: {
            id: '162f7517',
            name: 'Js user x',
            imageUrl: 'https://lh3.googleusercontent.com',
            avatarUrl: null
        },
        occursOn: [],
        visitEndDate: null,
        visitationDate: '2021-08-20T10:51:00+02:00',
        endTime: '2021-10-31 22:51',
        startTime: '2021-10-31 02:51',
        revoked: true
        }

  it('should render proper data', async() => {
    const { getByText } = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <Guest  
              guestListEntry={guestListEntry}
              handleGuestDetails={handleGuestDetails}
              handleGuestRevoke={handleGuestRevoke}
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    expect(getByText('Test Mutuba')).toBeInTheDocument()
    expect(getByText('logbook:guest_book.start_on_date_time')).toBeInTheDocument()
    expect(getByText('logbook:guest_book.ends_on_date_time')).toBeInTheDocument()
    expect(getByText('guest_book.revoked')).toBeInTheDocument()
    expect(getByText('guest_book.revoked')).toBeInTheDocument()
    expect(getByText('common:menu.revoke_access')).toBeInTheDocument()
    expect(getByText('common:menu.more_details')).toBeInTheDocument()

    fireEvent.click(getByText('common:menu.more_details'))
    expect(handleGuestDetails).toBeCalled()

    fireEvent.click(getByText('common:menu.revoke_access'))
    expect(handleGuestRevoke).toBeCalled()
  });
});
