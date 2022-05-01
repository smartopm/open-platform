import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import ProcessCommentItem from '../Components/ProcessCommentItem';

describe('Process Comment Item Component', () => {
  const commentdata = {
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
  };

  it('renders the Process comments Item correctly', async () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <ProcessCommentItem commentdata={commentdata} commentType="Sent" />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('chip')).toBeInTheDocument();
      expect(screen.queryByTestId('comment_date')).toBeInTheDocument();
      expect(screen.queryByTestId('body')).toHaveTextContent('sent comment body');
      expect(screen.queryByTestId('task_link')).toBeInTheDocument();
    });
  });
});
