import React from 'react'
import { render } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import  EditPlot from '../components/EditPlot'
import '@testing-library/jest-dom/extend-expect'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('add plot modal', () => {
  const handleClose = jest.fn
  const open = true
  const data = {
    parcelNumber: 'aqwdkqjw'
  }

  it('render without error', () => {
    render(
      <MockedProvider>
        <EditPlot
          open={open}
          data={data}
          handleClose={handleClose}
          refetch={jest.fn}
        />
      </MockedProvider>
    )
  })
})
