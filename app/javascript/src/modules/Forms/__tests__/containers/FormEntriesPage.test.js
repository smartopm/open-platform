import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import FormEntriesPage from '../../containers/FormEntriesPage';
import { Context } from "../../../../containers/Provider/AuthStateProvider";
import authState from "../../../../__mocks__/authstate";

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('FormEntriesPage Component', () => {
  it('renders loader when loading form', () => {
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <BrowserRouter>
            <FormEntriesPage />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(container.queryAllByTestId('loader')[0]).toBeInTheDocument();
  });
});
