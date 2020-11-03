import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import MergeLabel from '../components/Label/MergeLabel'
import '@testing-library/jest-dom/extend-expect'

describe('Comment Delete Component', () => {
  const handleClose = jest.fn
  const open = jest.fn
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
})
