import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import { ProjectRepliesRequestedComments } from '../graphql/process_queries';
import ProjectDetailsAccordion from '../Components/ProjectDetailsAccordion'

describe('Admin processes dashboard', () => {
  const mocks = [
    {
      request: {
        query: ProjectRepliesRequestedComments,
        variables: { taskId: '1345sfgh' }
      },
      result: {
        data: {
          repliesRequestedComments: {
            sent: [
              {
                id: '13456g6748',
                body: 'sent comment body',
                createdAt: '2020-12-28T22:00:00Z',
                groupingId: '67ue',
                user: {
                  id: 'yu678',
                  name: 'Sent User Name',
                  imageUrl: 'https://image.com'
                },
                replyFrom: {
                  id: '452yu',
                  name: 'Sent To User'
                },
                note: {
                  id: 'piuy89',
                  body: 'sent subtask'
                }
              }
            ],
            received: [
              {
                id: '13ad6g6748',
                body: 'received comment body',
                createdAt: '2020-12-29T22:00:00Z',
                groupingId: '67oe',
                user: {
                  id: 'yua788',
                  name: 'Received User Name',
                  imageUrl: 'https://image.com'
                },
                note: {
                  id: 'pi563b89',
                  body: 'received subtask'
                }
              }
            ],
            resolved: [
              {
                id: '676g6748',
                body: 'resolved comment body',
                createdAt: '2020-12-30T22:00:00Z',
                groupingId: '672hgoe',
                user: {
                  id: 'ya8788',
                  name: 'Resolved User Name',
                  imageUrl: 'https://image.com'
                },
                note: {
                  id: 'piu73nbb89',
                  body: 'resolved subtask'
                }
              }
            ],
            others: [
              {
                id: '1fa66g6748',
                body: 'ordinary comment body',
                createdAt: '2020-12-31T22:00:00Z',
                groupingId: '6a62e',
                user: {
                  id: 'a9n788',
                  name: 'Ordinary User Name',
                  imageUrl: 'https://image.com'
                },
                note: {
                  id: 'p9ahy3b89',
                  body: 'ordinary subtask'
                }
              }
            ]
          }
        }
      }
    }
  ];

  it('renders the summary page correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <MockedThemeProvider>
            <ProjectDetailsAccordion taskId='1345sfgh' />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    expect(screen.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Sent User Name')).toBeInTheDocument()
      expect(screen.queryByText('sent comment body')).toBeInTheDocument()
      expect(screen.queryByText('received comment body')).toBeInTheDocument()
      expect(screen.queryByText('Received User Name')).toBeInTheDocument()
      expect(screen.queryByText('resolved comment body')).toBeInTheDocument()
      expect(screen.queryByText('ordinary comment body')).toBeInTheDocument()
    })
  });
});
