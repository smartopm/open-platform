import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import MergeLabel from '../components/Label/MergeLabel'
import '@testing-library/jest-dom/extend-expect'

describe('Merge Label Component', () => {
  const handleClose = jest.fn
  const open = true
  const mergeData = {
    id: 'jwhekw'
  }

  it('render without error', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <MergeLabel
            mergeData={mergeData}
            open={open}
            handleClose={handleClose}
          />
        </BrowserRouter>
      </MockedProvider>
    )
  })

  it('test if modal is rendered', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MergeLabel
            mergeData={mergeData}
            open={open}
            handleClose={handleClose}
          />
        </BrowserRouter>
      </MockedProvider>
    )

    expect(container.queryByText('Merging this label will move all users from this label into the selected label')).toBeInTheDocument()
    expect(container.queryByText('Merge this label into:')).toBeInTheDocument()
  })
})
