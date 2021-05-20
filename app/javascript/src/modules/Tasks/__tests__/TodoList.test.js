import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import { render, fireEvent } from '@testing-library/react'
import TodoList from '../Components/TodoList'
import { flaggedNotes } from '../../../graphql/queries'
import { TaskStatsQuery } from '../graphql/task_queries'

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
          <TodoList {...props} />
        </BrowserRouter>
      </MockedProvider>
    )
    expect(container.queryByText('task.click_a_card_to_filter')).toBeTruthy()
    expect(container.queryByText('common:form_actions.create_task')).toBeTruthy()
    expect(container.queryByTestId('todo-container')).toBeTruthy()
    expect(container.queryByTestId('search_input')).toBeTruthy()
    expect(container.queryByTestId('toggle_filter_btn')).toBeTruthy()
    
   
  })

  it('renders task form modal', () => {
    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <TodoList {...props} />
        </BrowserRouter>
      </MockedProvider>
    )

    const createTaskBtn = container.queryByText('common:form_actions.create_task')
    fireEvent.click(createTaskBtn)
    
    expect(container.queryByText('task.task_body_label')).toBeTruthy()
    expect(container.queryByText('task.task_description_label')).toBeTruthy()
    expect(container.queryByText('task.task_type_label')).toBeTruthy()
    expect(container.queryByText('common:form_placeholders.note_due_date')).toBeTruthy()
  });
})
