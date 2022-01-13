import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { ProcessesQuery } from '../graphql/process_queries';
import ClientPilotViewList from '../Components/ClientPilotViewList';
import taskMock from '../../__mocks__/taskMock';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
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

describe('Client processes dashboard', () => {


  it('renders loader', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <ClientPilotViewList />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(screen.queryByTestId('loader')).toBeInTheDocument();
  });
});
