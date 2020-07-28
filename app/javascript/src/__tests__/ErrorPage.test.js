import React from 'react'
import Error from '../components/Error'
import { BrowserRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('Error Page', () => {

  const errorTitle = 'Error 101'

  it('Error page should render', () => {
    const { getByText } = render(
      <BrowserRouter>
        <Error title={errorTitle} />
      </BrowserRouter>
    )
    expect(getByText('Home')).toBeInTheDocument()
    expect(getByText('Error 101')).toBeInTheDocument()
  })
})
