import React from 'react'
import Campaign from '../components/CampaignForm'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'

describe('Campaign page', () => {
  const authState = {
    loaded: true,
    loggedIn: true,
    setToken: jest.fn(),
    user: {
      avatarUrl: null,
      community: { name: 'Nkwashi' },
      email: '9753942',
      expiresAt: null,
      id: '11cdad78',
      imageUrl: null,
      name: 'John Doctor',
      phoneNumber: '260971500748',
      userType: 'admin'
    }
  }
  it('should render without error', () => {
    const { getByText } = render(
      <MockedProvider>
        <BrowserRouter>
          <Campaign authState={authState} />
        </BrowserRouter>
      </MockedProvider>
    )
    expect(getByText('Message')).toBeInTheDocument()
  })
  it('should render input elements', () => {
    const { getByText } = render(
      <MockedProvider>
        <BrowserRouter>
          <Campaign authState={authState} />
        </BrowserRouter>
      </MockedProvider>
    )
    expect(getByText('Message')).toBeInTheDocument()
    expect(getByText('Campaign Name')).toBeInTheDocument()
    expect(getByText('User ID List')).toBeInTheDocument()
    expect(getByText('Batch Time')).toBeInTheDocument()
  })
})
