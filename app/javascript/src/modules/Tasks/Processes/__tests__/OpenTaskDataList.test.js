import React from 'react'
import { render, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import OpenTaskDataList from '../Components/OpenTaskDataList'
import taskMock from '../../__mocks__/taskMock'
import { ProjectOpenTasksQuery } from '../../graphql/task_queries'
import authState from '../../../../__mocks__/authstate';
import { Context } from '../../../../containers/Provider/AuthStateProvider'
import { MockedProvider } from '@apollo/react-testing'

describe('TaskSubTask Component', () => {
  const openTaskMock = [
    {
      request: {
        query: ProjectOpenTasksQuery,
        variables: { taskId: '23', limit: 1 }
      },
      result: {
        data: {
          projectOpenTasks: [...taskMock.subtasks]
        }
      }
    }
  ];

  it('renders without error', async () => {
      let container 
      await act(async () => {
        container = render(
          <Context.Provider value={authState}>
            <MockedProvider mocks={openTaskMock} addTypename={false}>
              <BrowserRouter>
                <OpenTaskDataList
                  taskId='23'
                  handleTodoClick={jest.fn()}
                  handleTaskCompletion={jest.fn}
                />
              </BrowserRouter>
            </MockedProvider>
          </Context.Provider>
        )})
    await waitFor(()=>{
      expect(container.queryByTestId('open_task_container')).toBeInTheDocument();
    }, 1000000)

  
    // expect(container.queryByTestId('open_task_container')).toBeInTheDocument();
    // expect(container.queryByTestId('task_completion_toggle_button')).toBeInTheDocument();

    // expect(container.queryByTestId('task_body')).toBeInTheDocument();

    // expect(container.queryByTestId('task_due_date')).toBeInTheDocument();

    // expect(container.queryByTestId('task_completion_toggle_button')).toBeInTheDocument();
    // expect(container.queryByTestId('task_assignee')).toBeInTheDocument();

    // expect(container.queryByTestId('task_subtasks_count')).toBeInTheDocument();
    // expect(container.queryByTestId('task_comments_count')).toBeInTheDocument();
    // expect(container.queryByTestId('file_attachments_total')).toBeInTheDocument();
    // expect(container.queryByTestId('closing_divider')).toBeInTheDocument();
  })
})
