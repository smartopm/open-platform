import React from 'react';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { act, render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import TaskUpdateForm from '../Components/TaskUpdateForm';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import authState from '../../../__mocks__/authstate';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

// TODO: Fix tests errors and warnings
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
  completed: false,
  attachments: [],
  description: 'A description',
};
const props = {
  data,
  assignUser: jest.fn(),
  refetch: jest.fn(),
  users: [],
  currentUser: { name: 'tester', id: '6523gvhvg' },
  historyData: [
    { action: 'create', noteEntityType: 'Comments::NoteComment', user: { name: 'name' }, createdAt: new Date() }
  ],
  historyRefetch: jest.fn(),
  authState: {},
  taskId: 'abc123'
};

describe('task form component', () => {
  it('should render and have editable fields', async () => {
    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
          <Context.Provider value={authState}>
            <BrowserRouter>
              <TaskUpdateForm {...props} />
            </BrowserRouter>
          </Context.Provider>
        </MockedProvider>
      );
    });

    expect(container.queryByText('common:form_actions.note_complete')).toBeInTheDocument();
    expect(container.queryByText('common:form_actions.note_complete')).not.toBeDisabled();
    expect(container.queryAllByTestId('user-chip')[0]).toBeInTheDocument();
    expect(container.queryAllByTestId('add-assignee')[0]).toBeInTheDocument();;
  });

  it('should render the remind-me-later button if current user is an assignee', async () => {
    const newProps = {
      ...props,
      currentUser: { name: 'tolulope 0.', id: '34543' }
    };
    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
          <Context.Provider value={authState}>
            <BrowserRouter>
              <TaskUpdateForm {...newProps} />
            </BrowserRouter>
          </Context.Provider>
        </MockedProvider>
      );
    });

    const taskInfoMenu = container.queryAllByTestId('task-info-menu')[0];
    expect(taskInfoMenu).toBeInTheDocument();

    fireEvent.click(taskInfoMenu);

    expect(container.queryByText('task:task.task_reminder_in_1_hr')).toBeInTheDocument();
    expect(container.queryByText('task:task.task_reminder_in_24_hr')).toBeInTheDocument();
    expect(container.queryByText('task:task.task_reminder_in_72_hr')).toBeInTheDocument();
  });

  describe('Task detail sections', () => {
    it('renders page sections', async () => {
      render(
        <MockedProvider>
          <Context.Provider value={authState}>
            <BrowserRouter>
              <TaskUpdateForm {...props} />
            </BrowserRouter>
          </Context.Provider>
        </MockedProvider>
      );

      expect(await screen.findByTestId("task-info-section")).toBeInTheDocument();
      expect(await screen.findByTestId("task-subtasks-section")).toBeInTheDocument();
      expect(await screen.findByTestId("task-comments-section")).toBeInTheDocument();
      expect(await screen.findByTestId("task-documents-section")).toBeInTheDocument();
      expect(await screen.findByTestId("task-updates-section")).toBeInTheDocument();
    });
  });
});
