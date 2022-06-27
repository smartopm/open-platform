import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Posts from '../Components/Posts';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import authState from '../../../__mocks__/authstate';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('Testing the posts list', () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({}),
    })
  );
  beforeEach(() => {
    fetch.mockClear();
  });
  it('should always render list of posts', async () => {
    const container = render(
      <Context.Provider value={authState}>
        <MockedThemeProvider>
          <MemoryRouter>
            <Posts />
          </MemoryRouter>
        </MockedThemeProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(container.queryByText('news.no_post')).toBeInTheDocument();
      expect(container.queryByText('news.news')).toBeInTheDocument();
    }, 10);
  });
});
