import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import { render, fireEvent } from '@testing-library/react'
import TodoList from '../Components/TodoList'
import { flaggedNotes } from '../../../graphql/queries'
import { TaskStatsQuery } from '../graphql/task_queries'
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

const mocks = [
  {
    request: {
      query: TaskStatsQuery,
      variables: { }
    },
    result: {
      taskStats: {
        completedTasks: 22,
        tasksDueIn10Days: 7,
        tasksDueIn30Days: 7,
        tasksOpen: 8,
        tasksOpenAndOverdue: 4,
        overdueTasks: 4,
        tasksWithNoDueDate: 6,
        myOpenTasks: 2,
        totalCallsOpen: 2
      }
    }
  },
  {
    request: {
      query: flaggedNotes,
      variables: {
        offset: 0,
        limit: 50,
        query: `assignees: ${userMock?.user.name} AND completed: false`
      }
    },
    result: {
     flaggedNotes: [
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
        subTasks: [],
        completed: false,
        parentNote: null
      }
     ]
    }
  }
]

describe('Test the Todo page', () => {
  it('Mount the Todo component', async () => {
    const container = render(
      <Context.Provider value={userMock}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <TodoList {...props} />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    )

    await expect(container.findByText(/Task example/)).toBeTruthy()
    expect(container.queryByTestId('create_task_btn')).toBeTruthy()
    expect(container.queryByTestId('todo-container')).toBeTruthy()
    expect(container.queryByTestId('search_input')).toBeTruthy()
    expect(container.queryByTestId('toggle_filter_btn')).toBeTruthy()
  })

  it('renders task form modal', () => {
    const container = render(
      <Context.Provider value={userMock}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <TodoList {...props} />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    )

    const createTaskBtn = container.queryByTestId('create_task_btn')
    fireEvent.click(createTaskBtn)

    expect(container.queryByText('task.task_body_label')).toBeTruthy()
    expect(container.queryByText('task.task_description_label')).toBeTruthy()
    expect(container.queryByText('task.task_type_label')).toBeTruthy()
    expect(container.queryByText('common:form_placeholders.note_due_date')).toBeTruthy()
  });
})
