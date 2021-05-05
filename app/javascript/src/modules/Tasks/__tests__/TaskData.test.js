import React from 'react';
import { MockedProvider } from '@apollo/react-testing'
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import renderTaskData, { LinkToUser } from '../Components/RenderTaskData';
import TodoItem from '../Components/TodoItem'

describe('Task Data components ', () => {
  it('should render proper the link to user component', () => {
    const container = render(
      <BrowserRouter>
        <LinkToUser userId="sdfsdf" name="Joe doe" />
      </BrowserRouter>
    );
    expect(container.queryByText('Joe doe')).toBeInTheDocument();
  });

  const menuData = {
    menuList: [
      { content: 'Edit Task', isAdmin: true, handleClick: jest.fn() },
      { content: 'Leave a Comment', isAdmin: true, handleClick: jest.fn() },
      { content: 'Mark as Complete', isAdmin: true, handleClick: jest.fn() },
    ],
    handleTodoMenu: jest.fn(),
    anchorEl: null,
    open: true,
    handleClose: jest.fn()
  }

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


  it('should check if TodoItem renders with no error', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <TodoItem
            task={task}
            handleChange={() => {}}
            selectedTasks={[]}
            isSelected={false}
            handleTaskDetails={() => {}}
            handleCompleteNote={() => {}}
          />
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
