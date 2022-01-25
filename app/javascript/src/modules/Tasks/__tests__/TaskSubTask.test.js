import React from 'react'
import { render, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import TaskSubTask from '../Components/TaskSubTask'
import { SubTasksQuery } from '../graphql/task_queries'
import taskMock from '../__mocks__/taskMock';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import authState from '../../../__mocks__/authstate';

describe('TaskSubTask Component', () => {
  const subTaskMock = [
    {
      request: {
        query: SubTasksQuery,
        variables: { taskId: '23' }
      },
      result: {
        data: {
          taskSubTasks: [taskMock.subtasks]
        }
      }
    }
  ];

  it('renders without error', async () => {
    let container
    await act(async () => {
      container = render(
        <Context.Provider value={authState}>
          <MockedProvider mocks={subTaskMock} addTypename={false}>
            <BrowserRouter>
              <TaskSubTask
                taskId='23'
                users={[]}
                assignUser={jest.fn()}
                handleTaskCompletion={jest.fn}
                handleSplitScreenOpen={jest.fn}
              />
            </BrowserRouter>
          </MockedProvider>
        </Context.Provider>
      )})

    expect(container.queryByTestId('sub_tasks_header')).toBeInTheDocument();
    expect(container.queryByTestId('add_sub_task_icon')).toBeInTheDocument();
    expect(container.queryByText('task:sub_task.sub_tasks')).toBeInTheDocument();
  })

  it('renders no subtasks', async () => {
    let container
    await act(async () => {
      container = render(
        <Context.Provider value={authState}>
          <MockedProvider mocks={[]} addTypename={false}>
            <BrowserRouter>
              <TaskSubTask
                taskId='23'
                users={[]}
                assignUser={jest.fn()}
                handleTaskCompletion={jest.fn}
                handleSplitScreenOpen={jest.fn}
              />
            </BrowserRouter>
          </MockedProvider>
        </Context.Provider>
      )})

    expect(container.queryByTestId('no_subtasks')).toBeInTheDocument();
    expect(container.queryByText('task:sub_task.no_sub_tasks')).toBeInTheDocument();
  })
})
