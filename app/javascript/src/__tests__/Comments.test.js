import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/';
import Comments from '../components/Comments/Comments';
import { CommentsPostQuery } from '../graphql/queries';

describe('It should test the comments component', () => {
  const mocks = {
    request: {
      query: CommentsPostQuery,
      variables: {
        limit: 20,
        offset: 0
      }
    },
    result: {
      data: {
        fetchComments: [
          {
            content: 'ghyw',
            id: 'khjherf',
            createdAt: '2020-11-13T10:53:16Z',
            user: {
              name: 'jhjhfwe',
              id: '234'
            },
            discussion: {
              id: '2374',
              postId: '774r'
            }
          }
        ]
      }
    }
  };
  it('should render with no error', async () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider mocks={[mocks]} addTypename={false}>
          <Comments />
        </MockedProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(container.queryAllByTestId('container')[0]).toBeInTheDocument();
    }, { timeout: 100 }
    )

    fireEvent.click(container.queryAllByTestId('previous')[0])
    fireEvent.click(container.queryAllByTestId('next')[0])
  });
});
