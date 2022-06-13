import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { LinkToUser } from '../Components/RenderTaskData';
import TaskDataList from '../Components/TaskDataList';
import TodoItem from '../Components/TodoItem';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import t from '../../__mocks__/t';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import authState from '../../../__mocks__/authstate';
import { SubTasksQuery } from '../graphql/task_queries';

describe('Task Data components', () => {
  const taskHeader = [
    { title: 'Select', col: 1 },
    { title: 'Task', value: t('common:table_headers.task'), col: 4 },
    { title: 'Created By', value: t('common:table_headers.created_by'), col: 3 },
    { title: 'Duedate', value: t('common:table_headers.due_date'), col: 1 },
    { title: 'Assignees', value: t('common:table_headers.assignees'), col: 2 },
    { title: 'Menu', col: 1 }
  ];

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

  it('should render proper the link to user component', () => {
    const container = render(
      <BrowserRouter>
        <MockedThemeProvider>
          <LinkToUser userId="sdfsdf" name="Joe doe" />
        </MockedThemeProvider>
      </BrowserRouter>
    );
    expect(container.queryByText('Joe doe')).toBeInTheDocument();
  });

  it('should check if TodoItem renders with no error', async () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <Context.Provider value={authState}>
            <MockedThemeProvider>
              <TodoItem
                task={task}
                handleChange={() => {}}
                selectedTasks={[]}
                isSelected={false}
                handleTaskDetails={() => {}}
                handleCompleteNote={() => {}}
                handleAddSubTask={jest.fn()}
                handleTodoClick={jest.fn}
                handleTaskCompletion={jest.fn}
                handleUploadDocument={jest.fn}
                showWidgetsIcon
              />
            </MockedThemeProvider>
          </Context.Provider>
        </MockedProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(container.getByTestId('task_completion_toggle_button')).toBeInTheDocument();
      expect(container.getByTestId('task_body_section')).toBeInTheDocument();
      expect(container.getByTestId('task_body')).toBeInTheDocument();
      expect(container.getByTestId('open_task_details')).toBeInTheDocument();
      expect(container.getByTestId('progress_bar_large_screen')).toBeInTheDocument();
    }, 10);
  });

  it('applies filter without error', async () => {
    render(
      <BrowserRouter>
        <MockedProvider>
          <Context.Provider value={authState}>
            <MockedThemeProvider>
              <TodoItem
                task={task}
                query="assignees: John Doe"
                handleChange={() => {}}
                selectedTasks={[]}
                isSelected={false}
                handleTaskDetails={() => {}}
                handleCompleteNote={() => {}}
                handleAddSubTask={jest.fn()}
                handleTodoClick={jest.fn}
                handleTaskCompletion={jest.fn}
                handleUploadDocument={jest.fn}
              />
            </MockedThemeProvider>
          </Context.Provider>
        </MockedProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('task_completion_toggle_button')).toBeInTheDocument();
      expect(screen.getByTestId('task_body_section')).toBeInTheDocument();
      expect(screen.getByTestId('task_body')).toBeInTheDocument();
    }, 10);
  });

  it('renders task menu options', async () => {
    render(
      <BrowserRouter>
        <MockedProvider>
          <Context.Provider value={authState}>
            <MockedThemeProvider>
              <TodoItem
                task={task}
                handleChange={() => {}}
                selectedTasks={[]}
                isSelected={false}
                handleTaskDetails={() => {}}
                handleAddSubTask={jest.fn()}
                taskHeader={taskHeader}
                handleTodoClick={jest.fn}
                handleTaskCompletion={jest.fn}
                handleUploadDocument={jest.fn}
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
      expect(screen.getByText('menu.upload_document')).toBeInTheDocument();
      expect(screen.getByText('menu.add_subtask')).toBeInTheDocument();
      expect(screen.getByText('menu.leave_a_comment')).toBeInTheDocument();
      expect(screen.getByText('menu.mark_complete')).toBeInTheDocument();
    }, 10);
  });

  it('should render TaskDataList', async () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <Context.Provider value={authState}>
            <MockedThemeProvider>
              <TaskDataList
                task={task}
                handleChange={jest.fn()}
                handleFileInputChange={jest.fn()}
                selectedTasks={[]}
                isSelected={false}
                menuData={{}}
                clickable
                handleClick={jest.fn()}
                openSubTask
                handleOpenSubTasksClick={jest.fn()}
                handleTaskCompletion={jest.fn}
                showWidgetsIcon
              />
            </MockedThemeProvider>
          </Context.Provider>
        </MockedProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(container.getByTestId('open_task_details')).toBeInTheDocument();
      expect(container.getByTestId('progress_bar_large_screen')).toBeInTheDocument();
      expect(container.queryByTestId('task_completion_toggle_button')).toBeInTheDocument();
      expect(container.queryByTestId('task_status')).toBeInTheDocument();
      fireEvent.click(container.queryByTestId('task_completion_toggle_button'));
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
                handleChange={() => {}}
                selectedTasks={[]}
                isSelected={false}
                handleTaskDetails={() => {}}
                handleCompleteNote={() => {}}
                handleAddSubTask={jest.fn()}
                handleTodoClick={jest.fn}
                handleTaskCompletion={jest.fn}
                handleUploadDocument={jest.fn}
                showWidgetsIcon
              />
            </MockedThemeProvider>
          </Context.Provider>
        </MockedProvider>
      </BrowserRouter>
    );

    await waitFor(async () => {
      expect(container.getByTestId('open_task_details')).toBeInTheDocument();
      expect(container.getByTestId('task-title')).toBeInTheDocument();
      expect(container.getByTestId('progress_bar_large_screen')).toBeInTheDocument();
      expect(container.getByTestId('show_task_subtasks')).toBeInTheDocument();

      fireEvent.click(container.queryByTestId('show_task_subtasks'));
    }, 10);
  });

  it('renders task icons', async () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <Context.Provider value={authState}>
            <MockedThemeProvider>
              <TaskDataList
                task={task}
                handleChange={jest.fn()}
                handleFileInputChange={jest.fn()}
                selectedTasks={[]}
                isSelected={false}
                menuData={{}}
                clickable
                handleClick={jest.fn()}
                openSubTask
                handleOpenSubTasksClick={jest.fn()}
                handleTaskCompletion={jest.fn}
                subTaskCard
              />
            </MockedThemeProvider>
          </Context.Provider>
        </MockedProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(container.getByTestId('task_details_section')).toBeInTheDocument();
      expect(container.getByTestId('task-comment')).toBeInTheDocument();
      expect(container.getByTestId('task_attach_file')).toBeInTheDocument();
    }, 10);
  });

  it('renders attachment icon', async () => {
    render(
      <BrowserRouter>
        <MockedProvider>
          <Context.Provider value={authState}>
            <MockedThemeProvider>
              <TaskDataList
                task={task}
                handleChange={jest.fn()}
                handleFileInputChange={jest.fn()}
                selectedTasks={[]}
                isSelected={false}
                menuData={{}}
                clickable
                handleClick={jest.fn()}
                openSubTask
                handleOpenSubTasksClick={jest.fn()}
                handleTaskCompletion={jest.fn}
                subTaskCard
              />
            </MockedThemeProvider>
          </Context.Provider>
        </MockedProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('task_attach_file')).toBeInTheDocument();
      expect(screen.getByTestId('file_attachments_total')).toHaveTextContent('1');
    }, 10);
  });
});
