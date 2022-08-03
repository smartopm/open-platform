import React from 'react';
import { render, waitFor } from '@testing-library/react';

import routeData, { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/react-testing';
import EntryRequestContextProvider from '../../Context';
import { GuestEntryQuery } from '../../../graphql/guestbook_queries';

describe('EntryRequest Context', () => {
  const mockParams = {
    id: '/123',
  }
  beforeEach(() => {
    jest.spyOn(routeData, 'useParams').mockReturnValue(mockParams)
  });
  it('should have context', async () => {
    const mock = {
      request: {
        query: GuestEntryQuery,
        variables: { id: '123' }
      },
      result: {
        data: {
          entryRequest: {
            id: '123',
            imageUrls: [],
            videoUrl: null
          }
        }
      }
    };
    const wrapper = render(
      <MemoryRouter>
        <MockedProvider mocks={[mock]} addTypename={false}>
          <EntryRequestContextProvider>
            <p>Some child component</p>
          </EntryRequestContextProvider>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(wrapper.queryByText('Some child component')).toBeInTheDocument();
    }, 10)
  });
});
