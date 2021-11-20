import React from 'react';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import TaskInfoTop from '../Components/TaskInfoTop';
import { UpdateNote } from '../../../graphql/mutations';

const menuList = [
  {
    content: ('payment.misc.payment_reminder'),
    isAdmin: true,
    handleClick: () => jest.fn()
  }
]
const menuData = {
  menuList,
  handleTaskInfoMenu: jest.fn(),
  anchorEl: null,
  open: false,
  handleClose: jest.fn()
}

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
  selectedDate: new Date(),
  menuData,
  isAssignee: jest.fn().mockResolvedValue(true),
  activeReminder: ''
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
    expect(container.queryByText('task.due_date_text')).toBeInTheDocument();
    expect(props.isAssignee).toHaveBeenCalled();
    expect(container.getByTestId('active-reminder')).toBeInTheDocument();
    expect(container.queryByText('task.active_reminder')).toBeInTheDocument();
    expect(container.queryByText('task.none')).toBeInTheDocument();
    expect(container.getByTestId('date_created')).toBeInTheDocument();
    expect(container.queryByText('task.task_details_text')).toBeInTheDocument();
    expect(container.queryByText('task.assigned_to_txt')).toBeInTheDocument();
    expect(container.queryByText('task.chip_add_assignee')).toBeInTheDocument();

    expect(container.queryByText('common:form_fields.description')).not.toBeInTheDocument();
    expect(container.queryByText('task.chip_close')).not.toBeInTheDocument();
    expect(container.queryByText('task.task_assignee_label')).not.toBeInTheDocument();

    const taskInfoMenu = container.getByTestId('task-info-menu')
    expect(taskInfoMenu).toBeInTheDocument();
    
    fireEvent.click(taskInfoMenu);
    expect(props.menuData.handleTaskInfoMenu).toHaveBeenCalled();
  });
  it('shows the description', async () => {
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
    const updateMock = {
      request: {
        query: UpdateNote,
        variables: { id: newProps.data.id, description: newProps.data.description }
      },
      result: {
        data: {
          noteUpdate: {
            note: {
              id: data.id,
              flagged: true,
              body: "some parent body",
              dueDate: "",
              parentNote:  {
                id: "1234"
              }
            }
          }
        }
      }
    }
    const container2 = render(
      <MockedProvider mocks={[updateMock]} addTypename={false}>
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

    // show the edit button and click on update button to trigger the mutation
    fireEvent.mouseEnter(container2.queryByTestId('editable_description'))
    expect(container2.queryByTestId('edit_icon')).toBeInTheDocument();

    fireEvent.click(container2.queryByTestId('edit_icon'))
    expect(container2.queryByTestId('edit_action')).toBeInTheDocument();

    fireEvent.click(container2.queryByTestId('edit_action_btn'))
    expect(container2.queryByTestId('edit_action_btn')).toBeDisabled();
    expect(container2.queryByTestId('edit_action_btn').textContent).toContain('common:form_actions.update');

    await waitFor(() => {
      expect(container2.queryByText('task.update_successful')).toBeInTheDocument();
    }, 10)
  })
});
