import React from 'react';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { act, render, fireEvent, screen } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import TaskDetail from '../Components/TaskDetail';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import authState from '../../../__mocks__/authstate';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
const data = {
  id: '6v2y3etyu2g3eu2',
  body: 'a task smsd',
  formUserId: '454353453',
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
  currentUser: { name: 'tester', id: '6523gvhvg', userType: 'admin' },
  historyData: [
    { id: "543rfsdf34-543rfsdf34-543rfsdf34", action: 'create', noteEntityType: 'Comments::NoteComment', user: { name: 'name' }, createdAt: new Date() }
  ],
  historyRefetch: jest.fn(),
  authState: {},
  taskId: 'abc123',
  handleTaskCompletion: jest.fn
};

describe('task form component', () => {
  it('should render and have editable fields', async () => {
    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
          <Context.Provider value={authState}>
            <BrowserRouter>
              <TaskDetail {...props} />
            </BrowserRouter>
          </Context.Provider>
        </MockedProvider>
      );
    });

    expect(container.queryAllByTestId('user-chip')[0]).toBeInTheDocument();
    expect(container.queryAllByTestId('add-assignee')[0]).toBeInTheDocument();
  });

  it('should render the remind-me-later button if current user is an assignee', async () => {
    const newProps = {
      ...props,
      currentUser: { name: 'tolulope 0.', id: '34543', userType: 'resident' }
    };
    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
          <Context.Provider value={authState}>
            <BrowserRouter>
              <TaskDetail {...newProps} />
            </BrowserRouter>
          </Context.Provider>
        </MockedProvider>
      );
    });

    const remindMeLaterButton = container.getByTestId('set-reminder-button');
    expect(remindMeLaterButton).toBeInTheDocument();

    fireEvent.click(remindMeLaterButton);

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
              <TaskDetail {...props} />
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
