import React from 'react';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import TaskInfoTop from '../Components/TaskInfoTop';

const data = {
  id: '6v2y3etyu2g3eu2',
  user: {
    id: '543rfsdf34',
    name: 'tolulope',
    imageUrl: 'http://image.com'
  },
  assignees: [
    { name: 'tolulope O.', id: '34543' },
    { name: 'another_user', id: '983y7r2' }
  ],
  assigneeNotes: [],
  completed: false
};

const props = {
  data,
  assignUser: jest.fn(),
  users: [],
  autoCompleteOpen: false,
  handleOpenAutoComplete: jest.fn(),
  setDate: jest.fn(),
  liteData: {},
  setSearchUser: jest.fn(),
  searchUser: jest.fn(),
  selectedDate: new Date()
};

describe('Top part of the task form component', () => {
  it('should render necessary info', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <TaskInfoTop {...props} />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.getByTestId('task-details-breadcrumb')).toBeInTheDocument();
    expect(container.getByTestId('date_created_title')).toBeInTheDocument();
    expect(container.getByTestId('date_created')).toBeInTheDocument();
    expect(container.queryByText('task.due_date_text')).toBeInTheDocument();
    expect(container.queryByText('task.assigned_to_txt')).toBeInTheDocument();
    expect(container.queryByText('task.chip_add_assignee')).toBeInTheDocument();

    expect(container.queryByText('common:form_fields.description')).not.toBeInTheDocument();
    expect(container.queryByText('task.chip_close')).not.toBeInTheDocument();
    expect(container.queryByText('task.task_assignee_label')).not.toBeInTheDocument();

    const newProps = {
      ...props,
      data: {
        ...props.data,
        description: 'some description',
        body: 'some body',
        parentNote: { id: '1234', body: 'some parent body' }
      },
      autoCompleteOpen: true,
    };
    const container2 = render(
      <MockedProvider>
        <BrowserRouter>
          <TaskInfoTop {...newProps} />
        </BrowserRouter>
      </MockedProvider>
    );
    expect(container2.queryByText('task.chip_close')).toBeInTheDocument();
    expect(container2.queryByText('task.task_assignee_label')).toBeInTheDocument();
    expect(container2.queryByText('some description')).toBeInTheDocument();
    expect(container2.queryByText('some body')).toBeInTheDocument();
    expect(container2.queryByText('some parent body')).toBeInTheDocument();

    expect(container2.queryByTestId('editable_description')).toBeInTheDocument();

  });
});
