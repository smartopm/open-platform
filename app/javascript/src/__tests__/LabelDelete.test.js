import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import LabelDelete from '../components/Label/LabelDelete'
import '@testing-library/jest-dom/extend-expect'

describe('Comment Delete Component', () => {
  const handleClose = jest.fn
  const open = jest.fn
  const data = {
    id: 'jwhekw',
    shortDesc: 'whgeukhw'
  }

  it('render without error', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <LabelDelete
            data={data}
            open={open}
            handleClose={handleClose}
          />
        </BrowserRouter>
      </MockedProvider>
    )
  })
})
