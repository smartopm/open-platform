import React from 'react'
import { render, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import OpenTaskDataList from '../Components/OpenTaskDataList'
import taskMock from '../../__mocks__/taskMock'

describe('TaskSubTask Component', () => {
  it('renders without error', async () => {
    let container 
    await act(async () => {
      container = render(
        <BrowserRouter>
          <OpenTaskDataList
            task={taskMock}
            handleTodoClick={jest.fn()}
            handleTaskCompletion={jest.fn}
          />
        </BrowserRouter>
      )})

    expect(container.queryByTestId('open_task_container')).toBeInTheDocument();
    expect(container.queryByTestId('task_completion_toggle_button')).toBeInTheDocument();

    expect(container.queryByTestId('task_body')).toBeInTheDocument();

    expect(container.queryByTestId('task_due_date')).toBeInTheDocument();

    expect(container.queryByTestId('task_completion_toggle_button')).toBeInTheDocument();
    expect(container.queryByTestId('task_assignee')).toBeInTheDocument();

    expect(container.queryByTestId('task_subtasks_count')).toBeInTheDocument();
    expect(container.queryByTestId('task_comments_count')).toBeInTheDocument();
    expect(container.queryByTestId('file_attachments_total')).toBeInTheDocument();
    expect(container.queryByTestId('closing_divider')).toBeInTheDocument();
  })
})
