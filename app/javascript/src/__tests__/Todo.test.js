/* eslint-disable */
import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import { render, fireEvent, screen } from '@testing-library/react'
import gql from 'graphql-tag'
import TodoList from '../components/Notes/TodoList'
import { UsersLiteQuery, flaggedNotes, TaskQuery, TaskStatsQuery } from '../graphql/queries'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
const mck = jest.fn()
const props = {
  currentUser: { name: 'Tester', id: '93sd45435' },
  handleModal: mck,
  saveDate: mck,
  selectedDate: new Date(Date.now()).toISOString(),
  handleDateChange: mck,
  todoAction: mck,
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
        query: ''
      }
    },
    result: {
     flaggedNotes: [{
      body: 'Note example',
      id: '23',
      createdAt: new Date('2020-08-01'),
      author: {
        name: 'Johnsc'
      },
      user: {
        name: 'somebody'
      },
      assignees: [{ name: 'Tester', id: '93sd45435' }],
      assigneeNotes: []
     }]
    }
  }
]

describe('Test the Todo page', () => {
  it('Mount the Todo component', () => {
    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <TodoList {...props}/>
        </BrowserRouter>
      </MockedProvider>
    )
    expect(container.queryByText(/Click a card above to filter/)).toBeTruthy()
    expect(container.queryByText(/Create Task/i)).toBeTruthy()
    expect(container.queryByTestId('todo-container')).toBeTruthy()
    expect(container.queryByTestId('search_input')).toBeTruthy()
    expect(container.queryByTestId('toggle_filter_btn')).toBeTruthy()
    
   
  })

  it('renders task form modal', () => {
    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <TodoList {...props}/>
        </BrowserRouter>
      </MockedProvider>
    )

    const createTaskBtn = container.queryByText(/Create Task/i)
    fireEvent.click(createTaskBtn)
    
    expect(container.queryByText(/Task Body/i)).toBeTruthy()
    expect(container.queryByText(/Task Description/i)).toBeTruthy()
    expect(container.queryByText(/Task Type/i)).toBeTruthy()
    expect(container.queryByText(/due date/i)).toBeTruthy()
  });
})
