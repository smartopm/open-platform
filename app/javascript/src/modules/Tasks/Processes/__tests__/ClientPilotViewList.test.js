import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';

import { render, screen, waitFor } from '@testing-library/react';
import { ProcessesQuery } from '../graphql/process_queries';
import ClientPilotViewList from '../Components/ClientPilotViewList';
import taskMock from '../../__mocks__/taskMock';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Client processes dashboard', () => {
  const mocks = [
    {
      request: {
        query: ProcessesQuery,
      },
      result: {
        data: {
            processes: [taskMock]
        }
      }
    }
  ];

  it('renders loader', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <ClientPilotViewList />
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(() => expect(screen.queryByTestId('loader')).toBeInTheDocument())
  });
});
