import React from 'react'
import { render, act, fireEvent } from '@testing-library/react'

import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import TaskSubTask from '../Components/TaskSubTask'
import { Context } from '../../../containers/Provider/AuthStateProvider';
import authState from '../../../__mocks__/authstate';

describe('TaskSubTask Component', () => {
  const data = {
    taskSubTasks: [{
      id: 'whfh23iruhwebnweiuwjfb32iue',
      completed: true,
      body: 'sample-body',
      dueDate: '2022-10-20',
      subTasksCount: 1,
      taskCommentsCount: 2,
      attachments: []
    }]
  };

  it('renders without error', async () => {
    let container
    await act(async () => {
      container = render(
        <Context.Provider value={authState}>
          <MockedProvider>
            <BrowserRouter>
              <TaskSubTask
                taskId='2334rrefef'
                loading={false}
                data={data}
                handleTaskCompletion={jest.fn()}
                handleSplitScreenOpen={jest.fn()}
                fetchMore={jest.fn()}
              />
            </BrowserRouter>
          </MockedProvider>
        </Context.Provider>
      )})

    expect(container.queryByTestId('body')).toBeInTheDocument();
    expect(container.queryByTestId('task-body')).toBeInTheDocument();
    expect(container.queryByTestId('due-date')).toBeInTheDocument();
    expect(container.queryByTestId('comment-count')).toBeInTheDocument();
    expect(container.queryByTestId('attachment-count')).toBeInTheDocument();
    expect(container.queryByTestId('file-attachments-total')).toBeInTheDocument();
    expect(container.queryByTestId('subtask-options')).toBeInTheDocument();

    fireEvent.click(container.queryByTestId('subtask-options'))
    expect(container.queryByText('common:menu.open_task_details')).toBeInTheDocument();

    fireEvent.click(container.queryByText('common:menu.open_task_details'))
    expect(container.queryByTestId('subtask-options')).toBeInTheDocument();
  })

  it('renders no subtask', async () => {
    let container
    await act(async () => {
      container = render(
        <Context.Provider value={authState}>
          <MockedProvider>
            <BrowserRouter>
              <TaskSubTask
                taskId='2334rrefef'
                loading={false}
                handleTaskCompletion={jest.fn()}
                handleSplitScreenOpen={jest.fn()}
                fetchMore={jest.fn()}
              />
            </BrowserRouter>
          </MockedProvider>
        </Context.Provider>
      )})

    expect(container.queryByText('task:sub_task.no_sub_tasks')).toBeInTheDocument();
  })
})
