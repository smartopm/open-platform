import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import { ProcessCommentsQuery, ProcessReplyComments } from '../graphql/process_queries';
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
    },
    {
      request: {
        query: ProcessCommentsQuery
      },
      result: {
        data: {
          processComments: [
            {
              id: "9f00d606-dced-432d-b6d8-283438c29f80",
              body: "Require reply comment pending reply",
              createdAt: "2022-07-07T13:46:01+02:00",
              groupingId: "9f00d606-dced-432d-b6d8-283438c29f80",
              taggedAttachments: null,
              user: {
                  id: "c8b16e54-095e-4b92-bf51-b197f6b916a6",
                  name: "Some User",
                  "imageUrl": "https://example.com/image"
              },
              replyFrom: {
                  "id": "ccca5372-add6-4377-ba22-1521b5e90b99",
                  name: "Reply from user"
              },
              note: {
                  id: "ecd8f782-189c-421d-9a55-19f2bf17e73b",
                  "body": "A Project Name"
              }
            },
            {
              id: "01a23d49-d274-48a4-8676-7d3d727b718a",
              body: "None reply required comment",
              createdAt: "2022-07-07T13:37:57+02:00",
              groupingId: null,
              taggedAttachments: null,
              user: {
                  id: "ccca5372-add6-4377-ba22-1521b5e90b99",
                  "name": "User Name",
                  "imageUrl": "https://example.com/image"
              },
              replyFrom: null,
              note: {
                  "id": "4d82edf4-1db6-4752-a8db-9a12e99a9290",
                  "body": "Test Project"
              }
            },
          ]
        }
      }
    },
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

  it('renders the Process comments by list view', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <MockedThemeProvider>
            <ProcessCommentPage />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    const tabViewBtn = screen.getByTestId('comments-list-view');
    expect(tabViewBtn).toBeInTheDocument();
    expect(screen.getByTestId('comments-tab-view')).toBeInTheDocument();

    fireEvent.click(tabViewBtn);
    await waitFor(() => {
      expect(screen.getByText(/None reply required comment/)).toBeInTheDocument();
      expect(screen.getByText(/Require reply comment pending reply/)).toBeInTheDocument();
    });
  });
});
