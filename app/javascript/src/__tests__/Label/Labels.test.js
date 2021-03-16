import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import Labels from '../../containers/Label/Labels';



jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Labels Component', () => {
  it('renders loader when loading form', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <Labels />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryAllByTestId('loader')[0]).toBeInTheDocument();
  });
});
