import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import TaskListDataList from '../Components/TaskListDataList';
import TodoItem from '../../Components/TodoItem';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import authState from '../../../../__mocks__/authstate';
import { SubTasksQuery } from '../../graphql/task_queries';

describe('Task Data components', () => {
  const task = {
    body: 'Task example',
    formUserId: '242321',
    id: '23',
    createdAt: new Date('2020-08-01'),
    author: {
      name: 'Johnsc',
      id: '23453435',
      imageUrl: '',
      avatarUrl: ''
    },
    user: {
      name: 'somebody'
    },
    assignees: [
      {
        name: 'Tester',
        id: '93sd45435',
        imageUrl: '',
        avatarUrl: ''
      }
    ],
    assigneeNotes: [],
    subTasks: [],
    subTasksCount: 4,
    completed: false,
    parentNote: null,
    progress: {
      progress_percentage: 20
    },
    documents: [
      {
        id: 'a6428125-1527-4001-ab9c-60a13584d1a4',
        name: 'documents',
        record_type: 'Notes::Note',
        record_id: '302df8c3-27bb-4175-adc1-43857e972eb4',
        blob_id: '21b8b3d1-40fa-4f9d-a7ac-721ce6e7f772',
        created_at: '2021-11-02T13:37:26.664+02:00'
      }
    ],
    attachments: [
      {
        id: 'a6428125-1527-4001-ab9c-60a13584d1a4',
        name: 'documents',
        record_type: 'Notes::Note',
        record_id: '302df8c3-27bb-4175-adc1-43857e972eb4',
        blob_id: '21b8b3d1-40fa-4f9d-a7ac-721ce6e7f772',
        created_at: '2021-11-02T13:37:26.664+02:00'
      }
    ],
    taskCommentReply: true,
    order: 1
  };

  it('renders stripped down version of task menu options', async () => {
    render(
      <BrowserRouter>
        <MockedProvider>
          <Context.Provider value={authState}>
            <MockedThemeProvider>
              <TodoItem
                task={task}
                handleTaskDetails={() => {}}
                handleAddSubTask={jest.fn()}
                handleTodoClick={jest.fn}
                createTaskListSubTask
              />
            </MockedThemeProvider>
          </Context.Provider>
        </MockedProvider>
      </BrowserRouter>
    );

    const menuButton = screen.getAllByTestId('task-item-menu')[0];
    expect(menuButton).toBeInTheDocument();
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.getByText('menu.open_task_details')).toBeInTheDocument();
      expect(screen.getByText('menu.add_subtask')).toBeInTheDocument();
    }, 10);
  });

  it('should render TaskListDataList', async () => {
    render(
      <BrowserRouter>
        <MockedProvider>
          <Context.Provider value={authState}>
            <MockedThemeProvider>
              <TaskListDataList
                task={task}
                handleTodoClick={jest.fn()}
                handleAddSubTask={jest.fn()}
                openSubTask
                handleOpenSubTasksClick={jest.fn()}
              />
            </MockedThemeProvider>
          </Context.Provider>
        </MockedProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      const taskMenuItem = screen.queryAllByTestId('MoreVertIcon')[0];
      fireEvent.click(taskMenuItem);

      const addSubTaskMenuItem = screen.getByText('menu.add_subtask');
      expect(addSubTaskMenuItem).toBeInTheDocument();
      const taskDetailsMenuItem = screen.getByText('menu.open_task_details');
      expect(taskDetailsMenuItem).toBeInTheDocument();
      fireEvent.click(taskDetailsMenuItem);
    });
  });

  it('should toggle sub tasks in order', async () => {
    const taskWithOrderedSubTasks = {
      ...task,
      subTasksCount: 3,
      subTasks: [
        { body: 'Sub Step 1', order: 1, ...task },
        { body: 'Sub Step 2', order: 2, ...task },
        { body: 'Sub Step 3', order: 3, ...task }
      ]
    };

    const subTaskMock = [
      {
        request: {
          query: SubTasksQuery,
          variables: { taskId: task.id }
        },
        result: {
          data: {
            taskSubTasks: [
              { body: 'Sub Step 1', order: 1 },
              { body: 'Sub Step 2', order: 2 },
              { body: 'Sub Step 3', order: 3 }
            ]
          }
        }
      }
    ];

    const container = render(
      <BrowserRouter>
        <MockedProvider mocks={subTaskMock} addTypename={false}>
          <Context.Provider value={authState}>
            <MockedThemeProvider>
              <TodoItem
                task={taskWithOrderedSubTasks}
                handleTaskDetails={() => {}}
                handleAddSubTask={jest.fn()}
                handleTodoClick={jest.fn}
                createTaskListSubTask
              />
            </MockedThemeProvider>
          </Context.Provider>
        </MockedProvider>
      </BrowserRouter>
    );

    await waitFor(async () => {
      expect(container.getByTestId('task_list_body_section')).toBeInTheDocument();
      expect(container.getByTestId('task-title')).toBeInTheDocument();
      expect(container.getByTestId('show_task_list_subtasks')).toBeInTheDocument();

      fireEvent.click(container.queryByTestId('show_task_list_subtasks'));
    }, 10);
  });
});