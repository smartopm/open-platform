import React from 'react';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../../../containers/Provider/AuthStateProvider'
import TaskInfoTop from '../Components/TaskInfoTop';
import { UpdateNote } from '../../../graphql/mutations';
import authState from '../../../__mocks__/authstate'

beforeEach(() => {
  jest.useFakeTimers()
  jest.setTimeout(100000)
})

afterEach(() => {
  jest.clearAllTimers()
})


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
  currentUser: authState.user,
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
  activeReminder: '',
  refetch: jest.fn,
  handleTaskComplete: jest.fn()
};

describe('Top part of the task form component', () => {
  it('should render necessary info', () => {
    const container = render(
      <Context.Provider value={authState.user}>
        <MockedProvider>
          <BrowserRouter>
            <TaskInfoTop {...props} />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(container.queryByText('task.due_date_text')).toBeInTheDocument();
    expect(props.isAssignee).toHaveBeenCalled();
    expect(container.getByTestId('active-reminder')).toBeInTheDocument();
    expect(container.queryByText('task.active_reminder')).toBeInTheDocument();
    expect(container.queryByText('task.none')).toBeInTheDocument();
    expect(container.getByTestId('date_created')).toBeInTheDocument();
    expect(container.queryByText('task.assigned_to_txt')).toBeInTheDocument();
    expect(container.queryByText('task.chip_add_assignee')).toBeInTheDocument();

    expect(container.queryByText('task.chip_close')).not.toBeInTheDocument();
    expect(container.queryByText('task.task_assignee_label')).not.toBeInTheDocument();

    const taskInfoMenu = container.getAllByTestId('task-info-menu')[0]
    expect(taskInfoMenu).toBeInTheDocument();

    fireEvent.click(taskInfoMenu);
    expect(props.handleTaskComplete).toHaveBeenCalled();
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
      refetch: jest.fn
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
      <Context.Provider value={authState.user}>
        <MockedProvider mocks={[updateMock]} addTypename={false}>
          <BrowserRouter>
            <TaskInfoTop {...newProps} />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );
    expect(container2.queryByText('task.chip_close')).toBeInTheDocument();
    expect(container2.queryByText('task.task_assignee_label')).toBeInTheDocument();
    expect(container2.queryByText('some description')).toBeInTheDocument();
    expect(container2.queryByText('some body')).toBeInTheDocument();
    expect(container2.queryByText('some parent body')).toBeInTheDocument();

    expect(container2.queryByTestId('editable_description')).toBeInTheDocument();
    expect(container2.queryByTestId('edit_body_icon')).toBeInTheDocument();
  
    // show the edit button and click on update button to trigger the mutation
    fireEvent.mouseEnter(container2.queryByTestId('editable_description'))
    expect(container2.queryByTestId('edit_icon')).toBeInTheDocument();

    fireEvent.click(container2.queryByTestId('edit_icon'))
    expect(container2.queryByTestId('edit_action')).toBeInTheDocument();

    fireEvent.click(container2.queryByTestId('edit_action_btn'))
    expect(container2.queryByTestId('edit_action_btn')).toBeDisabled();
    expect(container2.queryByTestId('edit_action_btn').textContent).toContain('common:form_actions.update');

    fireEvent.click(container2.queryByTestId('edit_body_icon'))
    expect(container2.queryByTestId('editable_body')).toBeInTheDocument();
    expect(container2.queryByTestId('edit_body_action_btn')).toBeInTheDocument();

    const bodyInput = container2.queryByTestId('editable_body')
    fireEvent.change(bodyInput, { target: { value: 'Body changed' } })
    expect(bodyInput.value).toBe('Body changed')
  },)

  it('should test update body', () => {
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
        variables: { id: '', body: '' }
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
    const container = render(
      <MockedProvider mocks={[updateMock]} addTypename={false}>
        <BrowserRouter>
          <TaskInfoTop {...newProps} />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('edit_body_icon')).toBeInTheDocument();

    fireEvent.click(container.queryByTestId('edit_body_icon'));
    expect(container.queryByTestId('edit_body_action_btn')).toBeInTheDocument();
    fireEvent.click(container.queryByTestId('edit_body_action_btn'));

    expect(container.queryByTestId('parent-note')).toBeInTheDocument();
    fireEvent.click(container.queryByTestId('parent-note'));
  });
});
