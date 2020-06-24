import React from 'react'
import Campaign from '../components/CampaignForm'
import { render, fireEvent, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'

describe('Campaign page', () => {
  afterEach(cleanup)
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
      phoneNumber: '260971500000',
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
  it('should not render form when user is not admin', () => {
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
        phoneNumber: '260971500000',
        userType: 'resident'
      }
    }
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <Campaign authState={authState} />
        </BrowserRouter>
      </MockedProvider>
    )
    expect(container.queryByText('Tasks')).toBeNull()
    expect(container.queryByText('Campaign Name')).toBeNull()
    expect(container.queryByText('User ID List')).toBeNull()
    expect(container.queryByText('Batch Time')).toBeNull()
  })

  it('should allow campain name inputs', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <Campaign authState={authState} />
        </BrowserRouter>
      </MockedProvider>
    )
    const nameInput = container.queryByLabelText('campaign_name')
    fireEvent.change(nameInput, { target: { value: 'Marketing' } })
    expect(nameInput.value).toBe('Marketing')

  })

  it('should allow campain fields inputs', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <Campaign authState={authState} />
        </BrowserRouter>
      </MockedProvider>
    )
    const messageInput = container.queryByLabelText('campaign_message')
    const idsInput = container.queryByTestId('campaign_ids')

    fireEvent.change(messageInput, { target: { value: 'This is a campaign message from the input field' } })
    expect(messageInput.value).toBe('This is a campaign message from the input field')

    fireEvent.change(idsInput, { target: { value: '6353472323, 734923479324723, 209423423' } })
    expect(idsInput.value).toBe('6353472323, 734923479324723, 209423423')
  })
})
