import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import DiscussionPage from '../../containers/Discussions/DiscussionPage';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Discussions Component', () => {
  it('renders Discussion elements', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <DiscussionPage />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('loader')).toBeInTheDocument();
  });
});
