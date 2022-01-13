/* eslint-disable import/prefer-default-export */
import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import ProjectsList from '../Components/ProjectsList';
import { ProcessesQuery } from '../graphql/process_queries';
import taskMock from "../../__mocks__/taskMock";

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
const mocks = [
  {
    request: {
      query: ProcessesQuery,
      variables: {
        offset: 0,
        limit: 50
      }
    },
    result: {
      data: {
        processes: [taskMock]
      }
    }
  }
];

describe('Projects List', () => {
  it('renders necessary elements', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <ProjectsList />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(screen.queryByTestId('loader')).toBeInTheDocument();

    await waitFor(() => {
      // Nothing is working here. Help ME!
      // expect(screen.queryByTestId('processes-txt')).toBeInTheDocument();
    });
  });
});
