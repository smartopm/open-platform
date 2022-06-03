import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import OpenTaskDataList from '../Components/OpenTaskDataList';
import taskMock from '../../__mocks__/taskMock';
import { ProjectOpenTasksQuery } from '../../graphql/task_queries';
import authState from '../../../../__mocks__/authstate';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import { generateId, objectAccessor } from '../../../../utils/helpers';

describe('OpenTaskDataList Component', () => {

  const tasks = new Array(10).fill(1).map((_, i) => ({
    ...taskMock,
    id: objectAccessor(generateId(), i)
  }));
  
  const openTaskMock = [
    {
      request: {
        query: ProjectOpenTasksQuery,
        variables: { taskId: '23', limit: 10 }
      },
      result: {
        data: {
          projectOpenTasks: tasks
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

      expect(container.getAllByTestId('task_completion_toggle_button')[0]).toBeInTheDocument();

      expect(container.getAllByTestId('task_body')[0]).toBeInTheDocument();

      expect(container.getAllByTestId('task_due_date')[0]).toBeInTheDocument();

      expect(container.getAllByTestId('task_assignee')[0]).toBeInTheDocument();

      expect(container.getAllByTestId('task_subtasks_count')[0]).toBeInTheDocument();
      expect(container.getAllByTestId('task_comments_count')[0]).toBeInTheDocument();
      expect(container.getAllByTestId('closing_divider')[0]).toBeInTheDocument();
      expect(container.queryByTestId('sub_task_see_more')).toBeInTheDocument();
    }, 10);
  });
});
