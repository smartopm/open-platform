import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import Discussion from '../../components/Discussion/Discussion';
import { DiscussionCommentsQuery } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Discussion with comments', () => {
  it('should render correctly and query properly', async () => {
    const data = {
      id: '92384uh2394-32493ds-sedf2',
      createdAt: '2020-03-09',
      user: {
        name: 'Ju'
      },
      description: 'Some description',
      title: 'Last discussion'
    };

    const mocks = [
      {
        request: {
          query: DiscussionCommentsQuery,
          variables: {
            id: data.id,
            limit: 20
          }
        },
        result: {
          data: {
            discussComments: []
          }
        }
      }
    ];

    let container;

    await act(async () => {
      container = render(
        <BrowserRouter>
          <MockedProvider mocks={mocks} addTypename={false}>
            <Discussion discussionData={data} />
          </MockedProvider>
        </BrowserRouter>
      );
    });

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(() => {
      expect(container.queryByText(/Some description/)).toBeInTheDocument();
      expect(container.queryByText(/Last discussion/)).toBeInTheDocument();
      expect(container.queryByText('A note about your activity')).toBeInTheDocument();
      expect(container.queryByText('follow')).toBeInTheDocument();
      
      fireEvent.click(container.queryByText('follow'))
      
      expect(container.queryByText('Subscribe to Discussion')).toBeInTheDocument();
    }, 50);
  });
});
