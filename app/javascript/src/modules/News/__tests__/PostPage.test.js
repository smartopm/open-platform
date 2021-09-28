import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import { PostDiscussionQuery } from '../../../graphql/queries';
import PostPage from '../Components/PostPage';
import { CurrentCommunityQuery } from '../../Community/graphql/community_query';
import MockedThemeProvider from '../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('NewsPage Component', () => {
  it('should display loader', async () => {
    const mocks = [
      {
        request: {
          query: CurrentCommunityQuery
        },
        result: {
          data: {
            currentCommunity: {
              imageUrl: 'https://dev.dgdp.site/rails/active_storage/blobs/eyJ.png',
              id: '8d66a68a-ded4-4f95-b9e2-62811d2f395f',
              name: 'Test Community',
              supportEmail: [{email: 'support@test.com', category: 'customer_care'}],
              supportWhatsapp: [{email: 'support@test.com', category: 'customer_care'}],
              supportNumber: [{email: 'support@test.com', category: 'customer_care'}],
              currency: 'kwacha',
              locale: 'en-ZM',
              tagline: 'This is a tagline for this community',
              logoUrl: '',
              language: 'en-US',
              wpLink: 'http://wp.com',
              themeColors: {},
              features: { Dashboard: { features: [] }},
              securityManager: ""
            }
          }
        }
      },
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
            <MockedThemeProvider>
              <PostPage />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      );
    });

    await waitFor(() => {
      expect(container.getByText(/common:misc.comment/)).toBeInTheDocument();
    }, 10)
  });
});
