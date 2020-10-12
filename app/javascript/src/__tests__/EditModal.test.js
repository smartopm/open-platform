import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import '@testing-library/jest-dom/extend-expect'
import EditModal from '../components/Label/EditModal'

describe('Comment Edit Field Component', () => {
  const handleClose = jest.fn
  const open = true
  const data = {
    id: 'jwhekw',
    shortDesc: 'whgeukhw',
    color: "2020-09-30T20:32:17Z",
    description: 'This'
  }

  it('render without error', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <EditModal
            open={open}
            data={data}
            handleClose={handleClose}
          />
        </BrowserRouter>
      </MockedProvider>
    )
  })

  it('should render with edit Label', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider mocks={[]}>
          <EditModal
            open={open}
            data={data}
            handleClose={handleClose}
          />
        </MockedProvider>
      </BrowserRouter>)
    expect(container.queryByText('Edit Label')).toBeInTheDocument()
  })
})