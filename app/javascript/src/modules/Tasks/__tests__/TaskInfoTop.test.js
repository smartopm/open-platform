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
    content: ('task.task_reminder_in_1_hr'),
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
    const container = render(
      <Context.Provider value={authState.user}>
        <MockedProvider mocks={[updateMock]} addTypename={false}>
          <BrowserRouter>
            <TaskInfoTop {...newProps} />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );
    expect(container.queryByText('task.chip_close')).toBeInTheDocument();
    expect(container.queryByText('task.task_assignee_label')).toBeInTheDocument();
    expect(container.queryByText('some description')).toBeInTheDocument();
    expect(container.queryByText('some body')).toBeInTheDocument();
    expect(container.queryByText('some parent body')).toBeInTheDocument();
  });

  it('shows live field update for description', async () => {
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
    const container = render(
      <Context.Provider value={authState.user}>
        <MockedProvider mocks={[updateMock]} addTypename={false}>
          <BrowserRouter>
            <TaskInfoTop {...newProps} />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    const description = container.queryByText('some description');
    expect(description).toBeInTheDocument();
    
    // // Trigger mouseOver
    fireEvent.mouseOver(description)
    
    const editableField = container.queryAllByTestId('live_editable_field')[0];
    const editableFieldTextInput = container.queryAllByTestId('live-text-field')[0];
    
    expect(editableField).toBeInTheDocument();
    expect(editableFieldTextInput).toBeInTheDocument();
    
    // // Update Description
    fireEvent.mouseEnter(description)
    fireEvent.change(editableFieldTextInput, { target: { value: 'another description' } })
    expect(editableFieldTextInput.value).toBe('another description')
  });


  it('shows task body', async () => {
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
    const container = render(
      <Context.Provider value={authState.user}>
        <MockedProvider mocks={[updateMock]} addTypename={false}>
          <BrowserRouter>
            <TaskInfoTop {...newProps} />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );
    expect(container.queryByText('task.chip_close')).toBeInTheDocument();
    expect(container.queryByText('task.task_assignee_label')).toBeInTheDocument();
    expect(container.queryByText('some description')).toBeInTheDocument();
    expect(container.queryByText('some body')).toBeInTheDocument();
    expect(container.queryByText('some parent body')).toBeInTheDocument();
    expect(container.queryByTestId('parent-note')).toBeInTheDocument();
  });

  it('shows live field update for body', async () => {
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
    };

    const container = render(
      <MockedProvider mocks={[updateMock]} addTypename={false}>
        <BrowserRouter>
          <TaskInfoTop {...newProps} />
        </BrowserRouter>
      </MockedProvider>
    );

    const body = container.queryByText('some body');
    expect(body).toBeInTheDocument();
    
    // // Trigger mouseOver
    fireEvent.mouseOver(body)
    
    const editableField = container.queryAllByTestId('live_editable_field')[0];
    const editableFieldTextInput = container.queryAllByTestId('live-text-field')[0];
    
    expect(editableField).toBeInTheDocument();
    expect(editableFieldTextInput).toBeInTheDocument();
    
    // Trigger mouseLave
    fireEvent.mouseLeave(editableField)
    expect(editableField).not.toBeInTheDocument();
    expect(editableFieldTextInput).not.toBeInTheDocument();
  });

  it('does not render remind me later icon if not assigned', () => {
    const unassignedUserProps = { ...props, isAssignee: jest.fn().mockResolvedValue(false) }
    render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <TaskInfoTop {...unassignedUserProps} />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(screen.queryByTestId('alarm')).toBeNull();
  });
});
