import React from 'react'
import { render } from '@testing-library/react'
import TodoList from '../components/TodoList'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('Test the Todo page', () => {
  const data = {
    flaggedNotes: []
  }

  it('Mount the Todo component', () => {
    const container = render(<TodoList data={data} />)
    expect(container.queryByText('No Actions yet')).toBeTruthy()
    expect(container.queryByTestId('todo-container')).toBeTruthy()
  })
})
