import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import Labels from '../Containers/Labels';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import userMock from '../../../__mocks__/authstate';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Labels Component', () => {
  it('renders loader when loading form', async () => {
    const container = render(
      <MockedProvider>
        <Context.Provider value={userMock}>
          <BrowserRouter>
            <Labels />
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );
      await waitFor(() => expect(container.queryAllByTestId('loader')[0]).toBeInTheDocument())
  });
});
