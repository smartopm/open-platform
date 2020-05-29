import React from 'react'
import { NewRequestButton, Results } from '../containers/Search'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom'

describe('new request button', () => {
  it('should render the correct button', () => {
    const container = render(
      <BrowserRouter>
        <NewRequestButton />
      </BrowserRouter>
    )
    expect(container.queryByText('Create a new request')).not.toBeNull()
    expect(container.queryByText('Create a new request')).toBeInTheDocument()
  })
})

describe('search result component', () => {
  it('should return no results when nothing found', () => {
    const props = {
      data: {
        userSearch: []
      },
      loading: false,
      called: true,
      authState: {
        user: {
          userType: 'client'
        }
      }
    }
    const container = render(
      <BrowserRouter>
        <Results {...props} />
      </BrowserRouter>
    )
    expect(container.queryByText('No results found!')).not.toBeNull()
    expect(container.queryByText('No results found!')).toBeInTheDocument()
  })
  it('should return create request button when admin is logged in', () => {
    const props = {
      data: {
        userSearch: []
      },
      loading: false,
      called: true,
      authState: {
        user: {
          userType: 'admin'
        }
      }
    }
    const container = render(
      <BrowserRouter>
        <Results {...props} />
      </BrowserRouter>
    )
    expect(container.queryByText('Create a new request')).toBeInTheDocument()
  })

  it('should display the returned results', () => {
    const props = {
      data: {
        userSearch: [
          {
            name: 'Mocked Jane D',
            id: 'ee6df98a-8016',
            phoneNumber: null,
            roleName: 'Admin',
            state: 'valid'
          },
          {
            name: 'Mocked John',
            id: '685019cc-05f3',
            phoneNumber: '2609715',
            roleName: '',
            state: 'pending'
          }
        ]
      },
      loading: false,
      called: true,
      authState: {
        user: {
          userType: 'admin'
        }
      }
    }
    const container = render(
      <BrowserRouter>
        <Results {...props} />
      </BrowserRouter>
    )
    expect(container.queryByText('Mocked John')).toBeInTheDocument()
    expect(container.queryByText('Mocked Jane D')).toBeInTheDocument()
    expect(container.queryByText('pending')).toBeInTheDocument()
    expect(container.getAllByTestId('link_search_user')).toHaveLength(2)
  })
})
