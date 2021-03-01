import React from 'react';
import { act, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import { PostDiscussionQuery } from '../../graphql/queries';
import PostPage from '../../containers/Posts/PostPage';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('NewsPage Component', () => {
  it('should display loader', async () => {
    const mocks = [
      {
        request: {
          query: PostDiscussionQuery,
          variables: {
            postId: '2gg0'
          }
        },
        result: {
          data: {
            postDiscussion: {
              title: 'A post here'
            }
          }
        }
      }
    ];

    let container;
    await act(async () => {
      container = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <PostPage />
          </BrowserRouter>
        </MockedProvider>
      );
    });

    expect(container.getByText(/View comments/)).toBeInTheDocument();
  });
});
