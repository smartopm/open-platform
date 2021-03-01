import React from 'react';
import { act, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import Posts from '../../containers/Posts/Posts';

describe('Post Component', () => {
  it('renders nkwashi news', async () => {
    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
          <BrowserRouter>
            <Posts />
          </BrowserRouter>
        </MockedProvider>
      );
    });
    expect(container.getByText(/Nkwashi News/)).toBeInTheDocument();
  });
});
