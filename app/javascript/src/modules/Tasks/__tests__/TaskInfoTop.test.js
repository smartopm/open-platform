/* eslint-disable max-lines */
import React from 'react';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../../../containers/Provider/AuthStateProvider'
import TaskInfoTop from '../Components/TaskInfoTop';
import { UpdateNote } from '../../../graphql/mutations';
import authState from '../../../__mocks__/authstate';
import taskMock from '../__mocks__/taskMock';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import MockedSnackbarProvider from '../../__mocks__/mock_snackbar';

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
  anchorEl: document.createElement("button"),
  open: false,
  handleClose: jest.fn()
}

const data = {
  id: '6v2y3etyu2g3eu2',
  body: 'some body',
  formUserId: '2938423',
  description: 'some description',
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
  completed: false,
  parentNote: {
    id: '1234',
    formUserId: '12343rthys',
    body: 'some parent body'
  },
};

const props = {
  currentUser: authState.user,
  data: taskMock,
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
      <MockedProvider>
        <Context.Provider value={authState}>
          <BrowserRouter>
            <MockedThemeProvider>
              <MockedSnackbarProvider>
                <TaskInfoTop {...props} />
              </MockedSnackbarProvider>
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    expect(container.queryByTestId('select-task-status')).toBeInTheDocument();
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

    expect(container.getByTestId('close-drawer-button')).toBeInTheDocument();
    expect(container.getByTestId('select-task-status')).toBeInTheDocument();

    // TODO: Victor & Bonny Remove test after we decide to remove check mark icon
    // const taskInfoMenu = container.getAllByTestId('task-info-menu')[0]
    // fireEvent.click(taskInfoMenu);
    // expect(props.handleTaskComplete).toHaveBeenCalled();
  });

  it('renders form user data for authorized user', () => {
    render(
      <MockedProvider>
        <Context.Provider value={authState}>
          <BrowserRouter>
            <MockedThemeProvider>
              <MockedSnackbarProvider>
                <TaskInfoTop {...props} />
              </MockedSnackbarProvider>
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    expect(screen.getByTestId('submitted_form_title')).toBeInTheDocument();
    expect(screen.getByTestId('submitted_form_button')).toBeInTheDocument();
  });

  it('does not render open form user button for unauthorized user', () => {
    const propsWithUnauthorizedCurrentUser = {
      ...props,
      currentUser: {
        ...authState.user,
        permissions: [
          { module: 'forms',
            permissions: []
          },
        ]
      }
    }

    render(
      <MockedProvider>
        <Context.Provider value={authState}>
          <BrowserRouter>
            <MockedThemeProvider>
              <MockedSnackbarProvider>
                <TaskInfoTop {...propsWithUnauthorizedCurrentUser} />
              </MockedSnackbarProvider>
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    expect(screen.queryByText('processes.submitted_form')).toBeNull();
    expect(screen.queryByText('processes.open_submitted_form')).toBeNull();
  });

  it('renders current task status in select box', () => {
    render(
      <MockedProvider>
        <Context.Provider value={authState}>
          <BrowserRouter>
            <MockedThemeProvider>
              <MockedSnackbarProvider>
                <TaskInfoTop {...props} />
              </MockedSnackbarProvider>
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    expect(screen.getByText('task.in_progress')).toBeInTheDocument();
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
      refetch: jest.fn()
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
        <Context.Provider value={authState}>
          <BrowserRouter>
            <MockedThemeProvider>
              <MockedSnackbarProvider>
                <TaskInfoTop {...newProps} />
              </MockedSnackbarProvider>
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    expect(container2.queryByText('task.chip_close')).toBeInTheDocument();
    expect(container2.queryByText('task.task_assignee_label')).toBeInTheDocument();
    expect(container2.queryByText('some description')).toBeInTheDocument();
    await waitFor(() => {
      expect(container2.queryByText('some body')).toBeInTheDocument();
    });
  });

  it('shows live field update for description', async () => {
    const newProps = {
      ...props,
      data: {
        ...props.data,
        description: 'some description',
        body: 'some body',
        parentNote: { id: '1234', body: 'some parent body', formUserId: taskMock.parentNote.formUserId }
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
      <Context.Provider value={authState}>
        <MockedProvider mocks={[updateMock]} addTypename={false}>
          <BrowserRouter>
            <MockedThemeProvider>
              <MockedSnackbarProvider>
                <TaskInfoTop {...newProps} />
              </MockedSnackbarProvider>
            </MockedThemeProvider>
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
      <Context.Provider value={authState}>
        <MockedProvider mocks={[updateMock]} addTypename={false}>
          <BrowserRouter>
            <MockedThemeProvider>
              <MockedSnackbarProvider>
                <TaskInfoTop {...newProps} />
              </MockedSnackbarProvider>
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );
    expect(container.queryByText('task.chip_close')).toBeInTheDocument();
    expect(container.queryByText('task.task_assignee_label')).toBeInTheDocument();
    expect(container.queryByText('some description')).toBeInTheDocument();
    expect(container.queryByTestId('parent-note')).toBeInTheDocument();
    await waitFor(() => {
      expect(container.queryByText('some body')).toBeInTheDocument();
      expect(container.queryByText('some parent body')).toBeInTheDocument();
    });
  });

  it('shows live field update for body', async () => {
    const newProps = {
      ...props,
      data: {
        ...props.data,
        description: 'some description',
        body: 'some body',
        parentNote: {
          id: '1234',
          body: 'some parent body',
          formUserId: taskMock.parentNote.formUserId
        }
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
        <Context.Provider value={authState}>
          <BrowserRouter>
            <MockedThemeProvider>
              <MockedSnackbarProvider>
                <TaskInfoTop {...newProps} />
              </MockedSnackbarProvider>
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
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
  });

  it('does not render remind me later icon if not assigned', () => {
    const unassignedUserProps = { ...props, isAssignee: jest.fn().mockResolvedValue(false) }
    render(
      <MockedProvider addTypename={false}>
        <Context.Provider value={authState}>
          <BrowserRouter>
            <MockedThemeProvider>
              <MockedSnackbarProvider>
                <TaskInfoTop {...unassignedUserProps} />
              </MockedSnackbarProvider>
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    expect(screen.queryByTestId('alarm')).toBeNull();
  });

  it('renders sub task order field', () => {
    const newProps = {
      ...props,
      data: {
        ...props.data,
        parentNote: {
          ...props.data.parentNote,
          subTasksCount: 2,
        }
      },
      autoCompleteOpen: true,
      refetch: jest.fn()
    };

    render(
      <MockedProvider addTypename={false}>
        <Context.Provider value={authState}>
          <BrowserRouter>
            <MockedThemeProvider>
              <MockedSnackbarProvider>
                <TaskInfoTop {...newProps} />
              </MockedSnackbarProvider>
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    expect(screen.getByTestId('order_number_title')).toBeInTheDocument();
    expect(screen.getByTestId('order_number')).toBeInTheDocument();
  });
});
