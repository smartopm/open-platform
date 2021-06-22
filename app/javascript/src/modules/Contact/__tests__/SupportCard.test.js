import React from 'react';
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import Support, {  SupportContact } from '../Components/SupportCard'

describe("Support card loads component", () => {
  const user = {
    userType: "client",
    community: {
      name: 'Nkwashi',
      supportNumber: [{phone_number: '+260 966 194383', category: 'sales'}],
      supportEmail: [{email: 'support@doublegdp.com', category: 'customer_care'}],
      supportWhatsapp: [{whatsapp: '+2347065834175', category: 'customer_care'}],
    }
  }
  it('should render support card', () => {
    const container = render(
      <BrowserRouter>
        <Support handleSendMessage={jest.fn()} user={user} />
      </BrowserRouter>
    )
    expect(container.queryByText(/Nkwashi/i)).toBeInTheDocument()
    expect(container.queryByText(/registration kiosk at the showroom/i)).toBeInTheDocument()
    expect(container.queryByText('support@doublegdp.com')).toBeInTheDocument()
    expect(container.queryByText('Sales Support')).toBeInTheDocument()
    expect(container.queryByText('Customer Care')).toBeInTheDocument()
    expect(container.queryByText('+260 966 194383')).toBeInTheDocument()
    expect(container.queryByText('+2347065834175')).toBeInTheDocument()
    expect(container.queryByText('Support Chat')).toBeInTheDocument()
    expect(container.queryByText('Pay With Mobile Money')).toBeInTheDocument()
    expect(container.queryByText('Pay With Mobile Money')).not.toBeDisabled()
    expect(container.queryByText('Privacy and Terms of Service')).toBeInTheDocument()
    expect(container.queryByText('Privacy and Terms of Service')).not.toBeDisabled()
  })

  it('should render not render Pay with Mobile Money for CM community', () => {
    user.community.name = 'Ciudad Morazán'

    const container = render(
      <BrowserRouter>
        <Support handleSendMessage={jest.fn()} user={user} />
      </BrowserRouter>
    )
    expect(container.queryByText(/Ciudad Morazán/i)).toBeInTheDocument()
    expect(container.queryByText('Pay With Mobile Money')).not.toBeInTheDocument()
  })

  it('should display no contacts message', () => {
    const newUser = {
      userType: "client",
      community: {
        supportNumber: [],
        supportEmail: [{email: 'support@doublegdp.com', category: 'customer_care'}],
        supportWhatsapp: [],
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



