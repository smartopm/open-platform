import React from 'react'
import {fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import CommunitySettings from '../../components/Community/CommunitySettings'

describe('Community settings page ', () => {
  it('should have input field and a remove button', () => {
    const data = {
      supportNumber: [
        {
          phone_number: '260971500748',
          category: 'sales'
        }
      ],
      supportEmail: [
        {
          email: 'abc@gmail.com',
          category: 'customer care'
        },
        {
          email: 'joey@hi.co',
          category: 'sales'
        }
      ],
      logoUrl: null
    }
    const container = render(
      <MockedProvider mocks={[]}>
        <CommunitySettings data={data} />
      </MockedProvider>
    )
    expect(container.queryByText('Community Logo')).toBeInTheDocument()
    expect(container.queryByText('You can change your community logo here')).toBeInTheDocument()
    expect(container.queryByText('Upload new logo')).toBeInTheDocument()
    expect(container.queryByText('Support Contact Information')).toBeInTheDocument()
    expect(container.queryByText('Make changes to your contact information here.')).toBeInTheDocument()
    expect(container.queryByText('Add New Phone Number')).toBeInTheDocument()
    expect(container.queryByText('Add New Email Address')).toBeInTheDocument()
    expect(container.queryByText('UPDATE COMMUNITY SETTINGS')).toBeInTheDocument()
    expect(container.queryByText('UPDATE COMMUNITY SETTINGS')).not.toBeDisabled()
    expect(container.queryAllByLabelText('Email')).toHaveLength(2)
    expect(container.queryByLabelText('Phone Number')).toBeInTheDocument()

    expect(container.queryAllByLabelText('remove')).toHaveLength(3)

    fireEvent.click(container.queryAllByTestId('add_number')[0])

    expect(container.queryAllByLabelText('remove')).toHaveLength(4)
    fireEvent.click(container.queryAllByLabelText('remove')[0])
    expect(container.queryAllByLabelText('remove')).toHaveLength(3)

    fireEvent.click(container.queryByTestId('update_community'))
    expect(container.queryByText('UPDATE COMMUNITY SETTINGS')).toBeDisabled()
  })
})
