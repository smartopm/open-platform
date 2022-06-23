import React from 'react';
import { act, render, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import { PostDiscussionQuery } from '../../../graphql/queries';
import PostPage from '../Components/PostPage';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import currentCommunityMock from '../../../__mocks__/currentCommunity';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('NewsPage Component', () => {
  it('should display loader', async () => {
    const mocks = {
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
    };

    let container;
    await act(async () => {
      container = render(
        <MockedProvider mocks={[mocks, currentCommunityMock]} addTypename={false}>
          <BrowserRouter>
            <MockedThemeProvider>
              <PostPage />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      );
    });

    await waitFor(() => {
      expect(container.getByText(/common:misc.comment/)).toBeInTheDocument();
    }, 10);
  });
});
