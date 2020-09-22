import React from 'react';
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import Support from '../components/SupportCard'

describe("Support card loads component", () => {
  const user = {
    userType: "client"
  }
  it('should render support card', () => {
    const container = render(
      <BrowserRouter>
        <Support handleSendMessage={jest.fn()} user={user} />
      </BrowserRouter>
    )
    expect(container.queryByText('support@doublegdp.com')).toBeInTheDocument()
    expect(container.queryByText('Sales Support')).toBeInTheDocument()
    expect(container.queryByText('Customer Care')).toBeInTheDocument()
    expect(container.queryByText('+260 976 261199')).toBeInTheDocument()
    expect(container.queryByText('Support Chat')).toBeInTheDocument()
    expect(container.queryByText('Pay With Mobile Money')).toBeInTheDocument()
    expect(container.queryByText('Pay With Mobile Money')).not.toBeDisabled()
  })
})



