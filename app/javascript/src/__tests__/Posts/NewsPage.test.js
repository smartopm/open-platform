import React from 'react';
import { act, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import NewsPage from '../../containers/Posts/NewsPage';

describe('NewsPage Component', () => {
  it('should display loader', async () => {
    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
          <BrowserRouter>
            <NewsPage />
          </BrowserRouter>
        </MockedProvider>
      );
    });
    expect(container.queryByTestId('loader')).toBeInTheDocument();
  });
});
