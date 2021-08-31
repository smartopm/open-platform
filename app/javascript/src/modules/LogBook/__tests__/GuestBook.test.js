import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import GuestBook, { renderGuest } from '../Components/GuestBook';
import { GuestEntriesQuery } from '../graphql/guestbook_queries';

describe('Should render Guest Book Component', () => {
  const mocks = {
    request: {
      query: GuestEntriesQuery
      //   variables: { id: '3c2f8ee2-598b-437c-b217-3e4c0f86c761' }
    },
    result: {
      data: {
        scheduledRequests: [
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
            endTime: '2021-08-31T08:51:44.842Z',
            startTime: '2021-08-31T08:51:44.842Z'
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
            endTime: '2021-08-31T08:20:21.115Z',
            startTime: '2021-08-31T08:20:21.115Z'
          }
        ]
      }
    }
  };
  it('should render proper data', async() => {
    const observe = jest.fn();
    const { getAllByText, getAllByTestId, getByText } = render(
      <MockedProvider mocks={[mocks]} addTypename={false}>
        <BrowserRouter>
          <MockedThemeProvider>
            <GuestBook tabValue={2} handleAddObservation={observe} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    // initially it should not contain any guests, this is because we lazily load this query
    expect(getByText('logbook.no_invited_guests')).toBeInTheDocument()
    
    await waitFor(() => {
        expect(getByText('Test another')).toBeInTheDocument()
        expect(getByText('X Name')).toBeInTheDocument()
        expect(getByText('Js sdd')).toBeInTheDocument()
        expect(getByText('Js user x')).toBeInTheDocument()
        expect(getAllByText('guest_book.start_of_visit')[0]).toBeInTheDocument()
        expect(getAllByText('guest_book.visit_time')[0]).toBeInTheDocument()
        expect(getAllByText('guest_book.expired')[0]).toBeInTheDocument()
        expect(getAllByText('guest_book.visit_time')[0]).toBeInTheDocument()
        expect(getAllByTestId('grant_access_btn')[0]).toBeInTheDocument();
        expect(getAllByTestId('grant_access_btn')[0].textContent).toContain('access_actions.grant_access');

        fireEvent.click(getAllByTestId('grant_access_btn')[0])
        expect(observe).not.toBeCalled() // since it is expired
    }, 50)
  });

  it('should render the guest function properly', () => {
      const classes = {}
      const grantedAccess = jest.fn()
      const translate = jest.fn(() => 'Translated text')
    //   Since this is a mere function, we individually render every property's component
      const guestView = renderGuest(mocks.result.data.scheduledRequests[0], classes, grantedAccess, false, { loading: false }, translate )[0]
      const guestNameContainer = render(
        <BrowserRouter>
          {guestView['Guest Name']}
        </BrowserRouter>
      )
      expect(guestNameContainer.queryByTestId('guest_name')).toBeInTheDocument()
      expect(guestNameContainer.queryByTestId('guest_name').textContent).toContain('Test another')

      const startVisit = render(guestView['Start of Visit'])
      expect(startVisit.queryByTestId('start_of_visit')).toBeInTheDocument()
      expect(startVisit.queryByTestId('start_of_visit').textContent).toContain('Translated text')

      const endVisit = render(guestView['End of Visit'])
      expect(endVisit.queryByTestId('end_of_visit')).toBeInTheDocument()
      expect(endVisit.queryByTestId('end_of_visit').textContent).toContain('-')

      const accessTime = render(guestView['Access Time'])
      expect(accessTime.queryByTestId('access_time')).toBeInTheDocument()
      expect(accessTime.queryByTestId('access_time').textContent).toContain('Translated text')

      const validity = render(guestView.validity)
      expect(validity.queryByTestId('validity')).toBeInTheDocument()
      expect(validity.queryByTestId('validity').textContent).toContain('Translated text')

      const accessAction = render(guestView['Access Action'])
      expect(accessAction.queryByTestId('access_actions')).toBeInTheDocument()
      expect(accessAction.queryByTestId('grant_access_btn')).toBeInTheDocument()
      expect(accessAction.queryByTestId('grant_access_btn')).toBeDisabled()
      expect(accessAction.queryByTestId('grant_access_btn').textContent).toContain('Translated text')
  })
});
