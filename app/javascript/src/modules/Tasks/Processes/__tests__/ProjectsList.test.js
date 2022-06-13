/* eslint-disable import/prefer-default-export */
import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';

import { render, screen, waitFor } from '@testing-library/react';
import ProjectsList from '../Components/ProjectsList';
import { Context } from '../../../../containers/Provider/AuthStateProvider'
import { ProjectsQuery } from '../graphql/process_queries';
import taskMock from "../../__mocks__/taskMock";
import authState from '../../../../__mocks__/authstate'
import MockedThemeProvider from '../../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
    location: {
      state: {
        process: {
          id: '123',
          form: {
            id: '123'
          }
        }
      }
    }
  })
}));

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
            <MockedThemeProvider>
              <ProjectsList />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryAllByText('processes.processes')[0]).toBeInTheDocument();
      expect(screen.queryAllByTestId('new-project-speed-dial')[0]).toBeInTheDocument();
      expect(screen.queryAllByTestId('speed-dial')[0]).toBeInTheDocument();
      expect(screen.queryAllByTestId('speed_dial_btn')[0]).toBeInTheDocument();
      expect(screen.queryAllByTestId('speed_dial_icon')[0]).toBeInTheDocument();
      expect(screen.queryAllByTestId('close_icon')[0]).toBeInTheDocument();
      expect(screen.queryAllByTestId('AddIcon')[0]).toBeInTheDocument();
      expect(screen.queryAllByTestId('speed_dial_action')[0]).toBeInTheDocument();
      expect(screen.queryAllByTestId('VisibilityIcon')[0]).toBeInTheDocument();
      expect(screen.queryAllByTestId('prev-btn')[0]).toBeInTheDocument();
      expect(screen.queryAllByTestId('next-btn')[0]).toBeInTheDocument();
      expect(screen.queryAllByText('misc.previous')[0]).toBeInTheDocument();
      expect(screen.queryAllByText('misc.next')[0]).toBeInTheDocument();
      expect(screen.queryByLabelText('project.add_new_project')).toBeInTheDocument();
      expect(screen.queryByLabelText('project.edit_template')).toBeInTheDocument();
    }, 10);
  });
});
