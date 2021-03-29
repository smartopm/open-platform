import React from 'react';
import { act, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import Posts from '../../containers/Posts/Posts';

describe('Post Component', () => {
  it('renders nkwashi news', async () => {
    await act(async () => {
      render(
        <MockedProvider>
          <BrowserRouter>
            <Posts />
          </BrowserRouter>
        </MockedProvider>
      );
    });
  });
});
