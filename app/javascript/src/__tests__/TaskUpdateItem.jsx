import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import TaskUpdateItem from '../components/Notes/TaskUpdateItem'
import '@testing-library/jest-dom/extend-expect'

describe('Comment Card Component', () => {
  const user = 'tolulope'
  const content = 'content'
  

  it('render without error', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <TaskUpdateItem
            user={user}
            content={content}
            icon={<AddBoxOutlinedIcon />}
          />
        </BrowserRouter>
      </MockedProvider>
    )
  })
})
