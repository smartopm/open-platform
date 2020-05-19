import React from 'react'
import { shallow } from 'enzyme'
import { createClient } from '../utils/apollo'
import { ApolloProvider } from 'react-apollo'
import { MemoryRouter } from 'react-router-dom'
import { HomeGuard } from '../containers/GuardHome'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())

describe('home component', () => {
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
      userType: 'security_guard'
    }
  }
  const wrapper = shallow(
    <MemoryRouter>
      <ApolloProvider client={createClient}>
        <HomeGuard authState={authState} />
      </ApolloProvider>
    </MemoryRouter>
  )

  // Todo: @olivier add proper tests in this component
  it('renders a search input', () => {
    expect(wrapper.find('input')).toBeTruthy()
  })

})
