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
      { content: t('menu.edit_task'), isAdmin: true, handleClick: jest.fn() },
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
        name: 'Johnsc'
      },
      user: {
        name: 'somebody'
      },
      assignees: [{ name: 'Tester', id: '93sd45435' }],
      assigneeNotes: []
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
              headers={taskHeader}
            />
          </MockedThemeProvider>
        </MockedProvider>
      </BrowserRouter>
    )

    expect(container.getByTestId("subject")).toBeInTheDocument()
    expect(container.getByTestId("task")).toBeInTheDocument()
    expect(container.getByTestId("createdby")).toBeInTheDocument()
    expect(container.getByTestId("duedate")).toBeInTheDocument()
    expect(container.getByTestId("assignee")).toBeInTheDocument()
    expect(container.getByTestId("menu")).toBeInTheDocument()
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
              headers={taskHeader}
            />
          </MockedThemeProvider>
        </MockedProvider>
      </BrowserRouter>
    );

    const menuButton = screen.getByTestId('todo-menu');
    expect(menuButton).toBeInTheDocument();
    fireEvent.click(menuButton);

    expect(screen.getByText('menu.edit_task')).toBeInTheDocument();
    expect(screen.getByText('menu.add_subtask')).toBeInTheDocument();
    expect(screen.getByText('menu.leave_a_comment')).toBeInTheDocument();
    expect(screen.getByText('menu.mark_complete')).toBeInTheDocument();
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
