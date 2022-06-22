import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import AllNotes from '../../containers/Activity/AllNotes';
import { allNotes } from '../../graphql/queries'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Feedback Component', () => {
  const mocks = [
    {
      request: {
        query: allNotes,
        variables: {
          limit: 20,
          offset: 0
        }
      },
      result: {
        data: {
          allNotes: [
            {
              body: 'shujkwjei',
              createdAt: '2021-02-01',
              flagged: false,
              id: 'wjfjwefef',
              user: {
                name: 'cwejkfkjw',
                id: 'ejwfewefwefwe'
              },
              author: {
                name: 'cwejkfkjw',
                id: 'ejwfewefwefwe'
              }
            }
          ]
        }
      }
    }
  ];
  it('renders loader when loading notes', async () => {
    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <AllNotes />
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() =>  {
      expect(container.queryAllByTestId('name')[0]).toBeInTheDocument()
      expect(container.queryAllByTestId('user')[0]).toBeInTheDocument()
      fireEvent.click(container.queryByTestId('prev-link'));
      fireEvent.click(container.queryByTestId('next-link'));
    }, 10)
  });
});
