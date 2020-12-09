import React from 'react';
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import Support, {  SupportContact } from '../components/SupportCard'

describe("Support card loads component", () => {
  const user = {
    userType: "client",
    community: {
      supportNumber: [{phone_number: '+260 966 194383', category: 'sales'}],
      supportEmail: [{email: 'support@doublegdp.com', category: 'customer_care'}],
    }
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
    expect(container.queryByText('+260 966 194383')).toBeInTheDocument()
    expect(container.queryByText('Support Chat')).toBeInTheDocument()
    expect(container.queryByText('Pay With Mobile Money')).toBeInTheDocument()
    expect(container.queryByText('Pay With Mobile Money')).not.toBeDisabled()
  })

  it('should display no contacts message', () => {
    const newUser = {
      userType: "client",
      community: {
        supportNumber: [],
        supportEmail: [],
      }
    }
    const container = render(
      <BrowserRouter>
        <Support handleSendMessage={jest.fn()} user={newUser} />
      </BrowserRouter>
    )

    expect(container.queryByText('Contacts not available at the moment')).toBeInTheDocument()
  })
})

describe("Support contact component", () => {
  const customerCare = {
    contact: "+260 900000000",
    type: "phone"
  }
  it('should render support card', () => {
    const container = render(<SupportContact support={customerCare} classes={{}} />)
    expect(container.queryByText('+260 900000000')).toBeInTheDocument()
  })
})



