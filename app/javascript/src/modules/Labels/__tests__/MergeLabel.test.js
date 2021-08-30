import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import MergeLabel from '../Components/MergeLabel'
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

    expect(container.queryByText('label.merge_dialog_title')).toBeInTheDocument()
    expect(container.queryByText('label.merge_text')).toBeInTheDocument()
  })
})
