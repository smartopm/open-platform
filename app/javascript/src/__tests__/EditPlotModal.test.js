import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import  EditPlot from '../components/EditPlot'
import '@testing-library/jest-dom/extend-expect'

describe('add plot modal', () => {
  const handleClose = jest.fn
  const open = true
  const data = {
    parcelNumber: 'aqwdkqjw'
  }

  it('render without error', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <EditPlot
            open={open}
            data={data}
            handleClose={handleClose}
          />
        </BrowserRouter>
      </MockedProvider>
    )
  })
})
