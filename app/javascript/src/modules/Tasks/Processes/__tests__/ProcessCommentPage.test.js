import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import { ProcessReplyComments } from '../graphql/process_queries';
import ProcessCommentPage from '../Components/ProcessCommentsPage';

describe('Process Comment Page Component', () => {
  const mocks = [
    {
      request: {
        query: ProcessReplyComments
      },
      result: {
        data: {
          processReplyComments: {
            sent: [
              {
                id: '13456g6748',
                body: 'sent comment body',
                createdAt: '2020-12-28T22:00:00Z',
                groupingId: '67ue',
                taggedAttachments: [{ id: '4567', url: 'https://sent-download.com/url' }],
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
                taggedAttachments: [],
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
                taggedAttachments: [],
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
            ]
          }
        }
      }
    }
  ];

  it('renders the Process comments page correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <MockedThemeProvider>
            <ProcessCommentPage />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    expect(screen.queryByTestId('loader')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryAllByText('comments.sent')[0]).toBeInTheDocument();
      expect(screen.queryAllByText('comments.received')[0]).toBeInTheDocument();
      expect(screen.queryAllByText('comments.resolved')[0]).toBeInTheDocument();
      expect(screen.queryAllByText('comments.sent')[1]).toBeInTheDocument();

      fireEvent.click(screen.queryAllByText('comments.received')[0]);
      expect(screen.queryAllByText('comments.received')[1]).toBeInTheDocument();

      fireEvent.click(screen.queryAllByText('comments.resolved')[0]);
      expect(screen.queryAllByText('comments.resolved')[1]).toBeInTheDocument();
    });
  });
});
