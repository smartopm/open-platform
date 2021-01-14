import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import  PlotModal from '../components/PlotOpen'
import '@testing-library/jest-dom/extend-expect'

describe('add plot modal', () => {
  const handleClose = jest.fn
  const open = true
  const user = {
    userId: '35tf3t4534',
    accountId: 'sjyqhjw'
  }
  it('render without error', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <PlotModal
            open={open}
            userId={user.userId}
            handleClose={handleClose}
            accountId={user.accountId}
          />
        </BrowserRouter>
      </MockedProvider>
    )
  })
})
