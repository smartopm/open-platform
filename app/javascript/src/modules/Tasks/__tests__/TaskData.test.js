import React from 'react';
import { MockedProvider } from '@apollo/react-testing'
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import renderTaskData, { LinkToUser } from '../Components/RenderTaskData';
import TodoItem from '../Components/TodoItem'
import MockedThemeProvider from '../../__mocks__/mock_theme'
import t from '../../__mocks__/t'

describe('Task Data components', () => {
  const menuData = {
    menuList: [
      { content: t('menu.open_task_details'), isAdmin: true, handleClick: jest.fn() },
      { content: t('menu.add_subtask'), isAdmin: true, handleClick: jest.fn() },
      { content: t('menu.leave_a_comment'), isAdmin: true, handleClick: jest.fn() },
      { content: t('menu.mark_complete'), isAdmin: true, handleClick: jest.fn() },
    ],
    handleTodoMenu: jest.fn(),
    anchorEl: null,
    open: true,
    handleClose: jest.fn()
  }

  const taskHeader = [
    { title: 'Select', col: 1 },
    { title: 'Task', value: t('common:table_headers.task'), col: 4 },
    { title: 'Created By', value: t('common:table_headers.created_by'), col: 3 },
    { title: 'Duedate', value: t('common:table_headers.due_date'), col: 1 },
    { title: 'Assignees',value: t('common:table_headers.assignees'), col: 2 },
    { title: 'Menu', col: 1 }
  ];

  const mock = jest.fn();
  const task =
    {
      body: 'Task example',
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
      documents: [
        {
          id: 'a6428125-1527-4001-ab9c-60a13584d1a4',
          name: 'documents',
          record_type: 'Notes::Note',
          record_id: '302df8c3-27bb-4175-adc1-43857e972eb4',
          blob_id: '21b8b3d1-40fa-4f9d-a7ac-721ce6e7f772',
          created_at: '2021-11-02T13:37:26.664+02:00'
      },
      ]
    }

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

  it('should check if TodoItem renders with no error', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <MockedThemeProvider>
            <TodoItem
              task={task}
              handleChange={() => {}}
              selectedTasks={[]}
              isSelected={false}
              handleTaskDetails={() => {}}
              handleCompleteNote={() => {}}
              handleAddSubTask={jest.fn()}
            />
          </MockedThemeProvider>
        </MockedProvider>
      </BrowserRouter>
    )

    expect(container.getByTestId("task-select-action")).toBeInTheDocument()
    expect(container.getByTestId("task_body_section")).toBeInTheDocument()
    expect(container.getByTestId("task_body")).toBeInTheDocument()
    expect(container.getByTestId("task_due_date")).toBeInTheDocument()
    // expect(container.getByTestId("task_assignee_section")).toBeInTheDocument()
    expect(container.getByTestId("task_assignee")).toBeInTheDocument()
    expect(container.getByTestId("task_subtasks")).toBeInTheDocument()
    expect(container.getByTestId("task_comments")).toBeInTheDocument()
    expect(container.getByTestId("task_details_section")).toBeInTheDocument()
    // expect(container.getByTestId("task_menu_section")).toBeInTheDocument()
  });

  it('applies filter without error', () => {
    render(
      <BrowserRouter>
        <MockedProvider>
          <MockedThemeProvider>
            <TodoItem
              task={task}
              query='assignees: John Doe'
              handleChange={() => {}}
              selectedTasks={[]}
              isSelected={false}
              handleTaskDetails={() => {}}
              handleCompleteNote={() => {}}
              handleAddSubTask={jest.fn()}
            />
          </MockedThemeProvider>
        </MockedProvider>
      </BrowserRouter>
    )

    expect(screen.getByTestId("task-select-action")).toBeInTheDocument();
    expect(screen.getByTestId("task_body_section")).toBeInTheDocument();
    expect(screen.getByTestId("task_body")).toBeInTheDocument();
    // expect(screen.getByTestId("task_assignee_section")).toBeInTheDocument();
    expect(screen.getByTestId("task_assignee")).toBeInTheDocument();
  });

  it('renders task menu options', () => {
    render(
      <BrowserRouter>
        <MockedProvider>
          <MockedThemeProvider>
            <TodoItem
              task={task}
              handleChange={() => {}}
              selectedTasks={[]}
              isSelected={false}
              handleTaskDetails={() => {}}
              handleCompleteNote={() => {}}
              handleAddSubTask={jest.fn()}
              taskHeader={taskHeader}
            />
          </MockedThemeProvider>
        </MockedProvider>
      </BrowserRouter>
    );

    const menuButton = screen.getByTestId('task-item-menu');
    expect(menuButton).toBeInTheDocument();
    fireEvent.click(menuButton);

    expect(screen.getByText('menu.open_task_details')).toBeInTheDocument();
    expect(screen.getByText('menu.upload_document')).toBeInTheDocument();
    expect(screen.getByText('menu.add_subtask')).toBeInTheDocument();
    expect(screen.getByText('menu.leave_a_comment')).toBeInTheDocument();
    expect(screen.getByText('menu.mark_complete')).toBeInTheDocument();
  });

  it('renders attachment icon', () => {
    render(
      <BrowserRouter>
        <MockedProvider>
          <MockedThemeProvider>
            <TodoItem
              task={task}
              handleChange={() => {}}
              selectedTasks={[]}
              isSelected={false}
              handleTaskDetails={() => {}}
              handleCompleteNote={() => {}}
              handleAddSubTask={jest.fn()}
              taskHeader={taskHeader}
            />
          </MockedThemeProvider>
        </MockedProvider>
      </BrowserRouter>
    );

    expect(screen.getByTestId('task_attach_file')).toBeInTheDocument();
    expect(screen.getByTestId('file_attachments_total')).toHaveTextContent('1');
  });

  it('should check if renderTaskData has correct property names', () => {
    const results = renderTaskData({
      task,
      handleChange: mock,
      selectedTasks: [],
      isSelected: false,
      menuData
    });
    expect(results).toBeInstanceOf(Array);
    expect(results[0]).toHaveProperty('Select');
    expect(results[0]).toHaveProperty('Task');
    expect(results[0]).toHaveProperty('Created By');
    expect(results[0]).toHaveProperty('Duedate');
    expect(results[0]).toHaveProperty('Assignees');
    expect(results[0]).toHaveProperty('Menu');
  });
});
