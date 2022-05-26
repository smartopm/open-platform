import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { CommunityNewsPostsQuery, SystemTaggedDiscussionsQuery } from '../../../graphql/queries';
import CommunityNews from '../Components/CommunityNews';
import MockedThemeProvider from '../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Community news with posts', () => {
  it('should render correctly and query properly', async () => {
    const props = {
      userType: 'admin',
      userImage: 'https://image.com',
      userPermissions: [{ module: 'discussion', permissions: ['can_set_accessibility'] }],
      dashboardTranslation: () => 'some-text'
    };
    const mocks = [
      {
        request: {
          query: CommunityNewsPostsQuery,
          variables: {
            limit: 4
          }
        },
        result: {
          data: {
            communityNewsPosts: [
              {
                content:
                  'Sometimes you might want to have icons for certain… button you can label it with a dustbin icon',
                createdAt: '2022-05-10T08:57:24Z',
                id: 'df956b37-227e-4a32-9a85-e3279aa7da0e122',
                imageUrls: null,
                discussionId: '123456',
                user: {
                  id: 'e23844f0-9985-438d-bdff-4f34a9e1897b',
                  name: 'Daniel Mutuba',
                  avatarUrl: null,
                  imageUrl:
                    'https://lh3.googleusercontent.com/a-/AOh14Ghj2JnWVlVC_cPrzJrAJ2YyV_UyVTXcEew8YKVp=s96-c',
                  __typename: 'User'
                }
              },

              {
                content:
                  'Sometimes you might want to have icons for certain…lete button you can label it with a dustbin icon.',
                createdAt: '2022-05-10T06:26:56Z',
                id: '5acf905c-e4dd-4f13-89ae-f56d15f5f1d522xdh2',
                imageUrls: null,
                discussionId: '123456',
                user: {
                  id: 'e23844f0-9985-438d-bdff-4f34a9e1897b',
                  name: 'Daniel Mutuba',
                  avatarUrl: null,
                  imageUrl:
                    'https://lh3.googleusercontent.com/a-/AOh14Ghj2JnWVlVC_cPrzJrAJ2YyV_UyVTXcEew8YKVp=s96-c',
                  __typename: 'User'
                }
              },
              {
                content:
                  'A lovely community. Sometimes you might want to ha…lete button you can label it with a dustbin icon.',
                createdAt: '2022-05-10T06:26:48Z',
                id: 'cae2fd20-8e56-4c78-8f32-7df951fbf29522qqww2',
                imageUrls: null,
                discussionId: '123456',
                user: {
                  id: 'e23844f0-9985-438d-bdff-4f34a9e1897b',
                  name: 'Daniel Mutuba',
                  avatarUrl: null,
                  imageUrl:
                    'https://lh3.googleusercontent.com/a-/AOh14Ghj2JnWVlVC_cPrzJrAJ2YyV_UyVTXcEew8YKVp=s96-c',
                  __typename: 'User'
                }
              },
              {
                content:
                  'A lovely community. Sometimes you might want to ha…lete button you can label it with a dustbin icon.',
                createdAt: '2022-05-10T06:26:48Z',
                id: 'cae2fd20-8e56-4c78-8f32-7df951fbf2951weeww',
                imageUrls: null,
                discussionId: '123456',
                user: {
                  id: 'e23844f0-9985-438d-bdff-4f34a9e1897b',
                  name: 'Daniel Mutuba',
                  avatarUrl: null,
                  imageUrl:
                    'https://lh3.googleusercontent.com/a-/AOh14Ghj2JnWVlVC_cPrzJrAJ2YyV_UyVTXcEew8YKVp=s96-c',
                  __typename: 'User'
                }
              }
            ]
          }
        }
      },
      {
        request: {
          query: SystemTaggedDiscussionsQuery
        },
        result: {
          data: {
            systemTaggedDiscussions: [
              {
                title: 'Family',
                id: 'df956b37-227e-4a32-1p85-e3279aa7da0e122',
              }
            ]
          }
        }
      }
    ];

    const container = render(
      <BrowserRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <MockedThemeProvider>
            <CommunityNews {...props} />
          </MockedThemeProvider>
        </MockedProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(container.queryByTestId('card-title')).toBeInTheDocument();
      expect(container.queryAllByTestId('user_avatar')[0]).toBeInTheDocument();

      expect(
        container.queryAllByText(
          /Sometimes you might want to have icons for certain… button you can label it with a dustbin icon/
        )[0]
      ).toBeInTheDocument();
      expect(container.queryByTestId('button')).toBeInTheDocument();

      fireEvent.click(container.queryByTestId('button'));

      fireEvent.click(container.queryAllByTestId('post_options')[0]);
      expect(container.queryAllByText('form_actions.edit_post')[0]).toBeInTheDocument();
      fireEvent.click(container.queryAllByText('form_actions.edit_post')[0]);
    }, 50);
  });
});
