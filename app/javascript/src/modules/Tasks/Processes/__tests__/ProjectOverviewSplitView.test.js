import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import authState from '../../../../__mocks__/authstate';
import { TaskContext } from '../../Context';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import taskMock from '../../__mocks__/taskMock'
import { ProjectOverviewSplitView } from '../Components/ProjectOverview';


jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn()());
describe('Project Processes Tab', () => {
  const data = [{ ...taskMock }]

  it('should render correctly', () => {
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <TaskContext.Provider
                value={{
                  setSelectedStep: jest.fn(),
                  handleStepCompletion: jest.fn()()
              }}
              >
                <ProjectOverviewSplitView 
                  data={data}
                  refetch={jest.fn()}
                  handleProjectStepClick={jest.fn()}
                />
              </TaskContext.Provider>
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(container.queryByTestId('requirements-section')).toBeInTheDocument();
    expect(container.queryByTestId('process-check-box')).toBeInTheDocument();
    expect(container.queryByTestId('step_body')).toBeInTheDocument();
    expect(container.queryByTestId('show_step_sub_steps')).toBeInTheDocument();
  });

  it('should render No Steps', () => {
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <TaskContext.Provider
                value={{
                  setSelectedStep: jest.fn(),
                  handleStepCompletion: jest.fn()
              }}
              >
                <ProjectOverviewSplitView
                  data={[]}
                  refetch={jest.fn()}
                  handleProjectStepClick={jest.fn()}
                />
              </TaskContext.Provider>
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(container.queryByTestId('no-steps')).toBeInTheDocument();
  });
});
