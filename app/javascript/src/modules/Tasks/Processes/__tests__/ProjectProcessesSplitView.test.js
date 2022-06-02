import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import authState from '../../../../__mocks__/authstate';
import { TaskContext } from '../../Context';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import taskMock from '../../__mocks__/taskMock'
import ProjectProcessesSplitView from '../Components/ProjectProcessesSplitView';
import { TaskQuery } from '../../graphql/task_queries';


jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Project Processes Split View', () => {
  const mocks = [
    {
      request: {
        query: TaskQuery,
        variables: {
          taskId: taskMock.id
        }
      },
      result: {
       data: {
         task: {...taskMock}
        }
      }
    }
  ]

  it('should render correctly', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <MockedThemeProvider>
              <TaskContext.Provider
                value={{
                  projectId: taskMock.id,
                  selectedStep: {...taskMock},
                  handleStepCompletion: jest.fn
              }}
              >
                <ProjectProcessesSplitView 
                  refetch={jest.fn()} 
                  setSplitScreenOpen={jest.fn()}
                  handleProjectStepClick={jest.fn()}
                  splitScreenOpen
                />
              </TaskContext.Provider>
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).toBeInTheDocument()
    }, 20)
  });
});
