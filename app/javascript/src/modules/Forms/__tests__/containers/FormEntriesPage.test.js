import React from 'react';
import { render, waitFor } from '@testing-library/react';

import routeData, { MemoryRouter } from 'react-router/';
import { MockedProvider } from '@apollo/react-testing';
import FormEntriesPage from '../../containers/FormEntriesPage';
import { Context } from "../../../../containers/Provider/AuthStateProvider";
import authState from "../../../../__mocks__/authstate";

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('FormEntriesPage Component', () => {
  const mockParams = {
    formId: '/123',
  }
  beforeEach(() => {
    jest.spyOn(routeData, 'useParams').mockReturnValue(mockParams)
  });
  it('renders loader when loading form', async () => {
    const container = render(
      <MemoryRouter>
        <Context.Provider value={authState}>
          <MockedProvider>
            <FormEntriesPage />
          </MockedProvider>
        </Context.Provider>
      </MemoryRouter>
    );
    await waitFor(() => expect(container.queryAllByTestId('loader')[0]).toBeInTheDocument())
  });
});
