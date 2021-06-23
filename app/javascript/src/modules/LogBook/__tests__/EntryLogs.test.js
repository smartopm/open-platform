import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import EntryLogs from '../Components/EntryLogs';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import userMock from '../../../__mocks__/userMock'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('EntryLogs Component', () => {
  it('renders loader when loading record', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <Context.Provider value={userMock}>
            <EntryLogs match={{ params: { id: '123' } }} />
          </Context.Provider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('loader')).toBeInTheDocument();
  });
});
