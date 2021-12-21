/* eslint-disable import/prefer-default-export */
import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import TodoList from '../Components/TodoList'
import { flaggedNotes } from '../../../graphql/queries'
import { Context } from '../../../containers/Provider/AuthStateProvider'
import authState from '../../../__mocks__/authstate'
import taskMock from '../__mocks__/taskMock';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
const mck = jest.fn()
const props = {
  isDialogOpen: false,
  currentUser: { name: 'Tester', id: '93sd45435' },
  handleModal: mck,
  saveDate: mck,
  selectedDate: new Date(Date.now()).toISOString(),
  handleDateChange: mck,
  location: 'tasks'
};

const mocks = [
  {
    request: {
      query: flaggedNotes,
      variables: {
        offset: 0,
        limit: 50,
        query: 'assignees: Tester AND completed: false'
      }
    },
    result: {
     flaggedNotes: [
      taskMock
     ]
    }
  }
]

describe('Test the Todo page', () => {
  it('Mount the Todo component', () => {
    render(
      <Context.Provider value={authState.user}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <TodoList {...props} />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    )

    expect(screen.queryByTestId('create_task_btn')).toBeTruthy()
    expect(screen.queryByTestId('todo-container')).toBeTruthy()
    expect(screen.queryByTestId('search')).toBeTruthy()
    expect(screen.queryByTestId('filter_container')).toBeInTheDocument();
  })

  it('renders task form modal', async () => {
    render(
      <Context.Provider value={authState.user}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <TodoList {...props} />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    const createTaskBtn = screen.queryByTestId('create_task_btn');
    fireEvent.click(createTaskBtn);

    await waitFor(() => {
      expect(screen.queryByText('task.task_body_label')).toBeInTheDocument();
      expect(screen.queryByText('task.task_description_label')).toBeInTheDocument();
      expect(screen.queryByText('task.task_type_label')).toBeInTheDocument();
      expect(screen.queryByText('common:form_placeholders.note_due_date')).toBeInTheDocument();
    });
  });

  it('does not render split screen on initial page load', async () => {
    render(
      <Context.Provider value={authState.user}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <TodoList {...props} />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
    });
  });
})
