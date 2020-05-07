import React from 'react'
import { SideList } from '../components/SideList'
import { BrowserRouter } from 'react-router-dom/'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('Sidelist component', () => {
  const sideProps = {
    toggleDrawer: jest.fn(),
    user: {
      name: 'Jetro'
    }
  }
  const { getByText } = render(
    <BrowserRouter>
      <SideList {...sideProps} />
    </BrowserRouter>
  )

  it('should contain required list ', () => {
    expect(getByText('Scanner')).toBeInTheDocument()
    expect(getByText('Search People')).toBeInTheDocument()
    expect(getByText('Contact')).toBeInTheDocument()
    expect(getByText('Logout')).toBeInTheDocument()
    expect(getByText('Jetro')).toBeInTheDocument()
  })
})
