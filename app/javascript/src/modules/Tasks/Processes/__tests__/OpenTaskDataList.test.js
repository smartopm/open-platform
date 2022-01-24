import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import OpenTaskDataList from '../Components/OpenTaskDataList';
import { TaskMock } from '../../__mocks__/taskMock';
import { ProjectOpenTasksQuery } from '../../graphql/task_queries';
import authState from '../../../../__mocks__/authstate';
import { Context } from '../../../../containers/Provider/AuthStateProvider';

describe('TaskSubTask Component', () => {
  const openTaskMock = [
    {
      request: {
        query: ProjectOpenTasksQuery,
        variables: { taskId: '23', limit: 1 }
      },
      result: {
        data: {
          projectOpenTasks: [TaskMock]
        }
      }
    }
  ];

  it('renders without error', async () => {
     const container = render(
       <Context.Provider value={authState}>
         <MockedProvider mocks={openTaskMock} addTypename>
           <BrowserRouter>
             <OpenTaskDataList
               taskId="23"
               handleTodoClick={jest.fn()}
               handleTaskCompletion={jest.fn()}
             />
           </BrowserRouter>
         </MockedProvider>
       </Context.Provider>
      );

    expect(container.queryByTestId('loader')).toBeInTheDocument();
    await waitFor(() => {
      expect(container.queryByTestId('open_task_container')).toBeInTheDocument();

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
      expect(container.queryByTestId('sub_task_see_more')).toBeInTheDocument();
      expect(container.queryByTestId('file_attachments_total')).toBeInTheDocument();
      expect(container.queryByTestId('file_attachments_total')).toHaveTextContent('0');
      expect(container.queryByText('Consultant sub-task')).toBeInTheDocument();
    }, 10);
  });
});
