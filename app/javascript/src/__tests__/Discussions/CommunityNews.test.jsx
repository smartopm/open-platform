import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { CommunityNewsPostsQuery } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import CommunityNews from '../../components/Discussion/CommunityNews';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Community news with posts', () => {
  it('should render correctly and query properly', async () => {
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
      }
    ];

    let container;

    await act(async () => {
      container = render(
        <BrowserRouter>
          <MockedProvider mocks={mocks} addTypename={false}>
            <CommunityNews />
          </MockedProvider>
        </BrowserRouter>
      );
    });

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(() => {
      expect(container.queryByTestId('community_news_header')).toBeInTheDocument();
      expect(container.queryAllByTestId('user_avatar')[0]).toBeInTheDocument();

      expect(
        container.queryByText(
          /Sometimes you might want to have icons for certain… button you can label it with a dustbin icon/
        )
      ).toBeInTheDocument();
      expect(container.queryByTestId('load_more_discussion')).toBeInTheDocument();

      fireEvent.click(container.queryByTestId('load_more_discussion'));
    }, 50);
  });
});
