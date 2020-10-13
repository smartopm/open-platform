/* eslint-disable */
import React from 'react'
import Homepage from '../components/HomePage'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'

describe("HomePage component ",() => {
    const adminAuthState = {
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
    it('should render without error and have all cards for admins',()=> {
       const container =  render(
            <MockedProvider >
              <BrowserRouter>
                <Homepage authState={adminAuthState}/>
            </BrowserRouter>
            </MockedProvider>
       )
      expect(container.queryByText('My Messages')).toBeInTheDocument()
      expect(container.queryByText('Users')).toBeInTheDocument()
      expect(container.queryByText('Campaigns')).toBeInTheDocument()
      expect(container.queryByText('Notes')).toBeInTheDocument()
      expect(container.queryByText('Time Card')).toBeInTheDocument()
      expect(container.queryByText('Tasks')).toBeInTheDocument()
      expect(container.queryByText('Labels')).toBeInTheDocument()
    })
  
  it('should render without error and have all cards for custodian', () => {
    const custodianAuthState = {
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
        userType: 'custodian'
      }
    }
    const container = render(
      <MockedProvider >
        <BrowserRouter>
          <Homepage authState={custodianAuthState} />
        </BrowserRouter>
      </MockedProvider>
    )
    expect(container.queryByText('My Messages')).not.toBeInTheDocument()
    expect(container.queryByText('My ID Card')).toBeInTheDocument()
    expect(container.queryByText('Campaigns')).not.toBeInTheDocument()
    expect(container.queryByText('Notes')).not.toBeInTheDocument()
    expect(container.queryByText('Time Card')).toBeInTheDocument()
    expect(container.queryByText('Tasks')).not.toBeInTheDocument()
    expect(container.queryByText('Log Book')).not.toBeInTheDocument()
    expect(container.queryByText('Users')).not.toBeInTheDocument()
    expect(container.queryByText('Labels')).not.toBeInTheDocument()
  })
  it('should render without error and have all cards for client', () => {
    const clientAuthState = {
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
        userType: 'client'
      }
    }
    const container = render(
      <MockedProvider >
        <BrowserRouter>
          <Homepage authState={clientAuthState} />
        </BrowserRouter>
      </MockedProvider>
    )
    expect(container.queryByText('My Messages')).toBeInTheDocument()
    expect(container.queryByText('My ID Card')).toBeInTheDocument()
    expect(container.queryByText('Campaigns')).not.toBeInTheDocument()
    expect(container.queryByText('Notes')).not.toBeInTheDocument()
    expect(container.queryByText('Time Card')).not.toBeInTheDocument()
    expect(container.queryByText('Tasks')).not.toBeInTheDocument()
    expect(container.queryByText('Log Book')).not.toBeInTheDocument()
    expect(container.queryByText('Users')).not.toBeInTheDocument()
    expect(container.queryByText('Referrals')).toBeInTheDocument()
    expect(container.queryByText('Labels')).not.toBeInTheDocument()
  })
  
  it('should render without error and have all cards for prospective client', () => {
    const prospectAuthState = {
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
        userType: 'prospective_client'
      }
    }
    const container = render(
      <MockedProvider >
        <BrowserRouter>
          <Homepage authState={prospectAuthState} />
        </BrowserRouter>
      </MockedProvider>
    )
    expect(container.queryByText('My Messages')).toBeInTheDocument()
    expect(container.queryByText('My ID Card')).toBeInTheDocument()
    expect(container.queryByText('Campaigns')).not.toBeInTheDocument()
    expect(container.queryByText('Notes')).not.toBeInTheDocument()
    expect(container.queryByText('Time Card')).not.toBeInTheDocument()
    expect(container.queryByText('Tasks')).not.toBeInTheDocument()
    expect(container.queryByText('Log Book')).not.toBeInTheDocument()
    expect(container.queryByText('Users')).not.toBeInTheDocument()
    expect(container.queryByText('Referrals')).not.toBeInTheDocument()
  })

  // check for the window.open


  it('should not contain any non security_guard cards', () => {
    const prospectAuthState = {
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
        userType: 'security_guard'
      }
    }
    const container = render(
      <MockedProvider >
        <BrowserRouter>
          <Homepage authState={prospectAuthState} />
        </BrowserRouter>
      </MockedProvider>
    )
    expect(container.queryByText('Tasks')).toBeNull()
    expect(container.queryByText('Log Book')).toBeNull()
    expect(container.queryByText('Users')).toBeNull()
    expect(container.queryByText('Referrals')).toBeNull()
  });
})