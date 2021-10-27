import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import { render, fireEvent, screen } from '@testing-library/react'
import TodoList from '../Components/TodoList'
import { flaggedNotes } from '../../../graphql/queries'
import { Context } from '../../../containers/Provider/AuthStateProvider'
import userMock from '../../../__mocks__/userMock';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
const mck = jest.fn()
const props = {
  currentUser: { name: 'Tester', id: '93sd45435' },
  handleModal: mck,
  saveDate: mck,
  selectedDate: new Date(Date.now()).toISOString(),
  handleDateChange: mck,
  location: 'tasks'
}

const task = {
  body: 'Task example',
  id: '23',
  createdAt: new Date('2020-08-01'),
  author: {
    name: 'Johnsc',
    id: '23453435',
    imageUrl: '',
    avatarUrl: ''
  },
  user: {
    name: 'somebody'
  },
  assignees: [
    {
      name: 'Tester',
      id: '93sd45435',
      imageUrl: '',
      avatarUrl: ''
    }
  ],
  assigneeNotes: [],
  completed: false,
  parentNote: null,
  subtasks: [
    {
      body: 'Task example',
      id: '23',
      createdAt: new Date('2020-08-01'),
      author: {
        name: 'Johnsc',
        id: '23453435',
        imageUrl: '',
        avatarUrl: ''
      },
      user: {
        name: 'somebody'
      },
      assignees: [
        {
          name: 'Tester',
          id: '93sd45435',
          imageUrl: '',
          avatarUrl: ''
        }
      ],
      assigneeNotes: [],
      completed: false,
      parentNote: null,
      subTasks: [
        {
          body: 'Task example',
            id: '23',
            createdAt: new Date('2020-08-01'),
            author: {
              name: 'Johnsc',
              id: '23453435',
              imageUrl: '',
              avatarUrl: ''
            },
            user: {
              name: 'somebody'
            },
            assignees: [
              {
                name: 'Tester',
                id: '93sd45435',
                imageUrl: '',
                avatarUrl: ''
              }
            ],
            assigneeNotes: [],
            completed: false,
            parentNote: null,
            subTasks: [],
        }
      ]
    }
  ]
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
      task
     ]
    }
  }
]

describe('Test the Todo page', () => {
  it('Mount the Todo component', () => {
    render(
      <Context.Provider value={userMock}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <TodoList {...props} />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    )

    expect(screen.queryByTestId('create_task_btn')).toBeTruthy()
    expect(screen.queryByTestId('todo-container')).toBeTruthy()
    expect(screen.queryByTestId('search_input')).toBeTruthy()
    expect(screen.queryByTestId('toggle_filter_btn')).toBeTruthy()
  })

  it('renders task form modal', () => {
    render(
      <Context.Provider value={userMock}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <TodoList {...props} />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    )

    const createTaskBtn = screen.queryByTestId('create_task_btn')
    fireEvent.click(createTaskBtn)

    expect(screen.queryByText('task.task_body_label')).toBeTruthy()
    expect(screen.queryByText('task.task_description_label')).toBeTruthy()
    expect(screen.queryByText('task.task_type_label')).toBeTruthy()
    expect(screen.queryByText('common:form_placeholders.note_due_date')).toBeTruthy()
  });
})
