import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import TaskUpdateList from '../components/Notes/TaskUpdateList'
import '@testing-library/jest-dom/extend-expect'

describe('Comment Card Component', () => {
  const data = [
    {
      id: 'jkfer',
      action: 'ckjer'
    }
  ]
  

  it('render without error', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <TaskUpdateList
            data={data}
          />
        </BrowserRouter>
      </MockedProvider>
    )
  })
})
