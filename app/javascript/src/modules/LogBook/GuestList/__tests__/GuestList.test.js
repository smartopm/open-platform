import React from 'react';
import { render, waitFor,fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import MockedThemeProvider from '../../../__mocks__/mock_theme'
import { GuestListEntriesQuery } from '../../graphql/guest_list_queries'
import GuestList from '../Components/GuestList';

describe('Should render Guest List Component', () => {
  const openGuestRequestForm = jest.fn()
  const handleGuestDetails = jest.fn()
  const handleGuestRevoke = jest.fn()
  const paginate = jest.fn()
  const mocks = {
    request: {
      query: GuestListEntriesQuery,
      variables: { offset: 0, limit: 50}
    },
    result: {
      data: {
        /* eslint-disable no-dupe-keys */
        scheduledGuestList: [
          {
            id: 'a91dbad4-eeb4',
            name: 'Test another',
            user: {
              id: '162f7517',
              name: 'Js user x',
              imageUrl: 'https://lh3.googleusercontent.com',
              avatarUrl: null
            },
            active: true,
            occursOn: [],
            visitEndDate: null,
            visitationDate: '2021-08-20T10:51:00+02:00',
            endTime: '2021-10-31 22:51',
            startTime: '2021-10-31 02:51',
            endsAt: '2021-10-31 22:51',
            startsAt: '2021-10-31 02:51',
            revoked: false,
            active: true
          },
          {
            id: '696d857',
            name: 'X Name',
            user: {
              id: '162f7517-69',
              name: 'Js sdd',
              imageUrl: 'https://lh3.googleusercontent.com/a-/',
              avatarUrl: null
            },
            active: true,
            occursOn: [],
            visitEndDate: null,
            visitationDate: '2021-08-31T10:20:21+02:00',
            endTime: '2021-10-31 22:51',
            startTime: '2021-10-31 02:51',
            endsAt: '2021-10-31 22:51',
            startsAt: '2021-10-31 02:51',
            revoked: false,
            active: true
          }
        ]
      }
    }
  };

  it('should render proper data', async() => {
    const { getByTestId, getAllByTestId, getByText } = render(
      <MockedProvider mocks={[mocks]} addTypename={false}>
        <BrowserRouter>
          <MockedThemeProvider>
            <GuestList />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    expect(getByText('logbook.no_invited_guests')).toBeInTheDocument()
    expect(getByTestId('new_guest_btn').textContent).toContain('common:form_actions.new_guest');
    expect(getByTestId('next-btn').textContent).toContain('misc.next');
    expect(getByTestId('prev-btn').textContent).toContain('misc.previous');
    expect(getByTestId('new_guest_btn').textContent).toContain('common:form_actions.new_guest');
    expect(getByTestId('next-btn').textContent).toContain('misc.next');
    expect(getByTestId('prev-btn').textContent).toContain('misc.previous');    
    await waitFor(() => {
      expect(getAllByTestId('guest_name')[0].textContent).toContain('Test another');
      expect(getAllByTestId('start_of_visit')[0].textContent).toContain('logbook:guest_book.start_on_date_time');
      expect(getAllByTestId('end_of_visit')[0].textContent).toContain('logbook:guest_book.ends_on_date_time');
    }, 50)


    fireEvent.click(getByTestId('new_guest_btn'))
    await waitFor(() => {
      expect(openGuestRequestForm).not.toBeCalled()
    });

    fireEvent.click(getAllByTestId('menu')[0])
    await waitFor(() => {
      expect(getAllByTestId('menu_item')[0].textContent).toContain('common:menu.revoke_access');
    });
    

    fireEvent.click(getAllByTestId('menu_item')[0])
    await waitFor(() => {
      expect(handleGuestRevoke).not.toBeCalled()
    });

    fireEvent.click(getAllByTestId('menu_item')[1])
    await waitFor(() => {
      expect(handleGuestDetails).not.toBeCalled()
    });

    fireEvent.click(getByTestId('next-btn'))
    await waitFor(() => {
      expect(paginate).not.toBeCalled()
    });

    fireEvent.click(getByTestId('prev-btn'))
    await waitFor(() => {
      expect(paginate).not.toBeCalled()
    });

  });

});

