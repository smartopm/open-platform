import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import { allFeedback } from '../../graphql/queries';
import AllFeedback from '../../containers/Activity/AllFeedback';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Feedback Component', () => {
  it('renders loader when loading feedback', async () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <AllFeedback />
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(container.queryByTestId('loader')).toBeInTheDocument();
    }, 10)
  });

  it('should display neccesary elements after fetching feedback', async () => {
    const mocks = [
      {
        request: {
          query: allFeedback,
          variables: {
            limit: 20,
            offset: 0
          }
        },
        result: {
          data: {
            usersFeedback: [
              {
                id: '12h3k4',
                user: {
                  id: '45fhd',
                  name: 'Nurudeen'
                },
                isThumbsUp: true,
                createdAt: '2021-02-01',
                review: 'Nice feedback'
              }
            ]
          }
        }
      }
    ];

    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <AllFeedback />
        </BrowserRouter>
      </MockedProvider>
      );

    await waitFor(() => {
      expect(container.queryByTestId('prev-link')).toBeInTheDocument();
      expect(container.queryByTestId('next-link')).toBeInTheDocument();
      fireEvent.click(container.queryByTestId('prev-link'));
      fireEvent.click(container.queryByTestId('next-link'));
    }, 10)
  });

  it('should display no feedback if no result is fetched', async () => {
    const mocks = [
      {
        request: {
          query: allFeedback,
          variables: {
            limit: 20,
            offset: 0
          }
        },
        result: {
          data: {
            usersFeedback: []
          }
        }
      }
    ];

    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <AllFeedback />
        </BrowserRouter>
      </MockedProvider>
      );
    // });

    await waitFor(() => {
      expect(container.queryByTestId('no-feedback-txt')).toBeInTheDocument();
    }, 20)
  });
});
