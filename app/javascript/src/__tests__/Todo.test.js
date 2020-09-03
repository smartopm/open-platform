/* eslint-disable */
import React from 'react'
import { render } from '@testing-library/react'
import TodoList from '../components/Notes/TodoList'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe.skip('Test the Todo page', () => {
  it('Mount the Todo component', () => {
    const container = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <BrowserRouter>
          <TodoList />
        </BrowserRouter>
      </MockedProvider>
    )
    expect(container.queryByText('No Actions yet')).toBeTruthy()
    expect(container.queryByTestId('todo-container')).toBeTruthy()
  })
})
