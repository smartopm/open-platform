import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom'
import { MockedProvider } from '@apollo/react-testing'
import ActionFlowDelete from '../components/ActionFlows/ActionFlowDelete'

describe('action flow delete component', () => {
  it('show correct delete modal', () => {
    const data = {
      id: '1235'
    }
    const open = true

    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <ActionFlowDelete
            data={data}
            refetch={jest.fn()}
            open={open}
            handleClose={jest.fn()}
          />
        </BrowserRouter>
      </MockedProvider>
    )

    expect(container.queryByText('Delete Action Flow')).toBeInTheDocument()
    expect(container.queryByText('Are you sure you want to delete this Action Flow ?')).toBeInTheDocument()
  })
})
