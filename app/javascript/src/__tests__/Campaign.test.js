import React from 'react'
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import Campaign from '../components/CampaignForm'
import { EmailTemplatesQuery } from '../modules/Emails/graphql/email_queries'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
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
  const mocks = {
    request: {
      query: EmailTemplatesQuery
    },
    result: {
      data: {
        emailTemplates: [
          {
            name: 'task update',
            id: '501b718c-8687-4e78-8c65-60b732df5ab1',
          }
        ]
      }
    }
  }

  it('should render without error', async () => {
    const { getByText } = render(
      <MockedProvider mocks={[mocks]}>
        <BrowserRouter>
          <Campaign authState={authState} />
        </BrowserRouter>
      </MockedProvider>
    )
    await waitFor(() => {
      expect(getByText('form_fields.message')).toBeInTheDocument()
    }, 10)
  })
  it('should render input elements', async () => {
    const { getByText } = render(
      <MockedProvider mocks={[mocks]}>
        <BrowserRouter>
          <Campaign authState={authState} />
        </BrowserRouter>
      </MockedProvider>
    )
    await waitFor(() => {
      expect(getByText('form_fields.message')).toBeInTheDocument()
      expect(getByText('form_fields.campaign_name')).toBeInTheDocument()
      expect(getByText('form_fields.user_id_list')).toBeInTheDocument()
    }, 10)
  })
  it('should not render form when user is not admin', async () => {
    const residentAuthState = {
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
      <MockedProvider mocks={[mocks]}>
        <BrowserRouter>
          <Campaign authState={residentAuthState} />
        </BrowserRouter>
      </MockedProvider>
    )
    await waitFor(() => {
      expect(container.queryByText('Tasks')).toBeNull()
      expect(container.queryByText('form_fields.campaign_name')).toBeNull()
      expect(container.queryByText('form_fields.user_id_list')).toBeNull()
    }, 10)
  })

  it('should allow campain name inputs', async () => {
    const container = render(
      <MockedProvider mocks={[mocks]}>
        <BrowserRouter>
          <Campaign authState={authState} />
        </BrowserRouter>
      </MockedProvider>
    )
    await waitFor(() => {
      const nameInput = container.queryByTestId('campaign_name')
      fireEvent.change(nameInput, { target: { value: 'Marketing' } })
      expect(nameInput.value).toBe('Marketing')
    }, 10)
  })

  it('should allow campain fields inputs', async () => {
    const container = render(
      <MockedProvider mocks={[mocks]}>
        <BrowserRouter>
          <Campaign authState={authState} />
        </BrowserRouter>
      </MockedProvider>
    )
    const messageInput = container.queryByTestId('campaign_message')
    const idsInput = container.queryByTestId('campaign_ids')
    const nameInput = container.queryByTestId('campaign_name')
    const checkInput = container.queryByTestId('reply_link')

    await waitFor(() => {



    fireEvent.change(nameInput, { target: { value: 'new campaign' } })
    expect(nameInput.value).toBe('new campaign')

    fireEvent.change(messageInput, {
      target: { value: 'This is a campaign message from the input field' }
    })
    expect(messageInput.value).toBe(
      'This is a campaign message from the input field'
    )

    fireEvent.change(idsInput, {
      target: { value: '6353472323, 734923479324723, 209423423' }
    })
    expect(idsInput.value).toBe('6353472323, 734923479324723, 209423423')

    fireEvent.change(checkInput, { target: { checked: true } })
    expect(checkInput.checked).toBe(true)
  })
  })
})
