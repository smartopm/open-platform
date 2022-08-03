import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import MergeLabel from '../Components/MergeLabel'


describe('Merge Label Component', () => {
  const handleClose = jest.fn()
  const refetch = jest.fn()
  const open = true
  const mergeData = {
    id: 'jwhekw'
  }

  it('test if modal is rendered', async () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MergeLabel
            mergeData={mergeData}
            open={open}
            handleClose={handleClose}
            refetch={refetch}
          />
        </BrowserRouter>
      </MockedProvider>
    )

    await waitFor(() => {
      expect(container.queryByText('label.merge_dialog_title')).toBeInTheDocument()
      expect(container.queryByText('label.merge_text')).toBeInTheDocument()
    })
  })
})
