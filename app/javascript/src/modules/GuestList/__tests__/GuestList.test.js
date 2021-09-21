import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import { GuestListEntriesQuery } from '../graphql/guest_list_queries'
import GuestList from '../Components/GuestList';

describe('Should render Guest Book Component', () => {
//   const openGuestRequestForm = jest.fn()

  const mocks = {
    request: {
      query: GuestListEntriesQuery,
      variables: { offset: 0, limit: 50, query: '' }
    },
    result: {
      data: {
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
            occursOn: [],
            visitEndDate: null,
            visitationDate: '2021-08-20T10:51:00+02:00',
            endTime: '2021-10-31 22:51',
            startTime: '2021-10-31 02:51',
            revoked: true
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
            occursOn: [],
            visitEndDate: null,
            visitationDate: '2021-08-31T10:20:21+02:00',
            endTime: '2021-10-31 22:51',
            startTime: '2021-10-31 02:51',
            revoked: true
          }
        ]
      }
    }
  };

  it('should render proper data', async() => {
    const { getByTestId, getByText } = render(
      <MockedProvider mocks={[mocks]}>
        <BrowserRouter>
          <MockedThemeProvider>
            <GuestList />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    // initially it should not contain any guests, this is because we lazily load this query
    expect(getByText('logbook.no_invited_guests')).toBeInTheDocument()
    expect(getByTestId('new_guest_btn').textContent).toContain('common:form_actions.new_guest');
    expect(getByTestId('next-btn').textContent).toContain('misc.next');
    expect(getByTestId('prev-btn').textContent).toContain('misc.previous');

    // await waitFor(() => {
    //     // expect(getByText('Test another')).toBeInTheDocument()
    //     // expect(getByText('X Name')).toBeInTheDocument()
    //     // expect(getByText('Js sdd')).toBeInTheDocument()
    //     // expect(getByText('Js user x')).toBeInTheDocument()
    //     // expect(getAllByText('guest_book.start_on_date_time')[0]).toBeInTheDocument()
    //     // expect(getAllByText('guest_book.ends_on_date_time')[0]).toBeInTheDocument()

    //     expect(getByTestId('new_guest_btn').textContent).toContain('common:form_actions.new_guest');
    //     expect(getByTestId('next-btn').textContent).toContain('misc.next');
    //     expect(getByTestId('prev-btn').textContent).toContain('misc.previous');

    //     fireEvent.click(getByTestId('new_guest_btn'))
    //     expect(openGuestRequestForm).toBeCalled()
    // }, 50)
  });
});
