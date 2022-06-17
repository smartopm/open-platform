/* eslint-disable */
import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { render, screen, waitFor } from '@testing-library/react';
import Page404 from '../404';

describe('404 Page', () => {
  it('should mount component correctly', async () => {
      render(
        <MockedProvider>
          <BrowserRouter>
              <Page404 />
          </BrowserRouter>
        </MockedProvider>
      );

    await waitFor(() => {
      expect(screen.queryByTestId('404-header-text')).toBeInTheDocument()
      expect(screen.queryByTestId('404-offline-text')).toBeInTheDocument()
      expect(screen.queryByTestId('404-action-btn')).toBeInTheDocument()
      expect(screen.getByText('404.404')).toBeInTheDocument()
      expect(screen.getByText('404.oops')).toBeInTheDocument()
      expect(screen.getByText('404.action_text')).toBeInTheDocument()
    }, 10)
  });
});
