import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import UserMessagePage from '../../containers/Messages/UserMessagePage';

describe('AllMessages Component', () => {
  it('renders UserMessagePage text', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <UserMessagePage />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.getByText(/Messages/)).toBeInTheDocument();
  });
});
