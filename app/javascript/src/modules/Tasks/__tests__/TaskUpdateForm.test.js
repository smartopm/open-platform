import React from 'react';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { act, render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import TaskUpdateForm from '../Components/TaskUpdateForm';

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
  attachments: []
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
  taskId: ''
};
describe('task form component', () => {
  it('should render and have editable fields', async () => {
    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
          <BrowserRouter>
            <TaskUpdateForm {...props} />
          </BrowserRouter>
        </MockedProvider>
      );
    });

    expect(container.queryByText('common:form_actions.note_complete')).toBeInTheDocument();
    expect(container.queryByText('common:form_actions.note_complete')).not.toBeDisabled();
    expect(container.queryAllByText('tolulope O.')[0]).toBeInTheDocument();
    expect(container.queryAllByText('another_user')[0]).toBeInTheDocument();
    // needs to be updated
    expect(container.queryAllByTestId('user_chip')).toHaveLength(2);
    expect(container.queryByTestId('mark_task_complete_checkbox')).toBeInTheDocument();
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
          <BrowserRouter>
            <TaskUpdateForm {...newProps} />
          </BrowserRouter>
        </MockedProvider>
      );
    });

    const reminderBtn = container.queryByText('task.reminder_text');
    expect(reminderBtn).toBeInTheDocument();

    fireEvent.click(reminderBtn);

    expect(container.queryByText('task.task_reminder_in_1_hr')).toBeInTheDocument();
    expect(container.queryByText('task.task_reminder_in_24_hr')).toBeInTheDocument();
    expect(container.queryByText('task.task_reminder_in_72_hr')).toBeInTheDocument();
  });

  it('should render task comments section', async () => {
    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
          <BrowserRouter>
            <TaskUpdateForm {...props} />
          </BrowserRouter>
        </MockedProvider>
      );
    });

    expect(container.queryByText(/comments/i)).toBeTruthy();
  });
});
