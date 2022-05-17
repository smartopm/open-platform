import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import FollowButton from '../Components/FollowButton';

describe('Follow Button for discussions', () => {
  const props = { authState: { user: { name: 'Tolulope' } } };

  it('show render follow button', async () => {
    const { getByText } = render(
      <MockedProvider>
        <BrowserRouter>
          <FollowButton discussionId={12} {...props} />
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(() => expect(getByText('follow')).toBeInTheDocument());
  });
});
