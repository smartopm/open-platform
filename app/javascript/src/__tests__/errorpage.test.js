import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { render } from '@testing-library/react'

import Error from '../components/Error'

describe('Error Page', () => {
  const errorTitle = 'Error 101'
  it('Error page should render', () => {
    const { getByText } = render(
      // eslint-disable-next-line react/jsx-filename-extension
      <BrowserRouter>
        <Error title={errorTitle} />
      </BrowserRouter>
    )
    expect(getByText('Home')).toBeInTheDocument()
    expect(getByText('Error 101')).toBeInTheDocument()
  })
})
