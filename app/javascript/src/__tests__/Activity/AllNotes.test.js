import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import AllNotes from '../../containers/Activity/AllNotes';


jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Feedback Component', () => {
  it('renders loader when loading notes', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <AllNotes />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('loader')).toBeInTheDocument();
  });
});
