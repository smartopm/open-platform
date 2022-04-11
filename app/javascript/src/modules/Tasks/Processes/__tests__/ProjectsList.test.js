/* eslint-disable import/prefer-default-export */
import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import ProjectsList from '../Components/ProjectsList';
import { Context } from '../../../../containers/Provider/AuthStateProvider'
import { ProjectsQuery } from '../graphql/process_queries';
import taskMock from "../../__mocks__/taskMock";
import authState from '../../../../__mocks__/authstate'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Projects List', () => {
  it('renders necessary elements', async () => {
    const mocks = [
      {
        request: {
          query: ProjectsQuery,
          variables: {
            offset: 0,
            limit: 50
          }
        },
        result: {
          data: {
            projects: [taskMock]
          }
        }
      }
    ];

    const adminUser = { userType: 'admin', ...authState }
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Context.Provider value={adminUser}>
          <BrowserRouter>
            <ProjectsList />
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).toBeInTheDocument();
    }, 10);
  });
});
