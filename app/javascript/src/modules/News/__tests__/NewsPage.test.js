import React from 'react';
import { act, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import NewsPage from '../Components/NewsPage';

describe('NewsPage Component', () => {
  it('should display loader', async () => {
    await act(async () => {
      render(
        <MockedProvider>
          <BrowserRouter>
            <NewsPage />
          </BrowserRouter>
        </MockedProvider>
      );
    });
  });
});
