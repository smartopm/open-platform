import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom'
import UserForm, { formatContactType } from '../components/UserForm'
import { AuthStateProvider } from '../containers/Provider/AuthStateProvider'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('UserForm Component', () => {
  it('it should render correct with form properties when creating and editing', () => {
    const props = { isEditing: true, isFromRef: false,  }
    const container = render(
      <MockedProvider mocks={[]}>
        <BrowserRouter>
          <UserForm isEditing={props.isEditing} isFromRef={props.isFromRef} isAdmin />
        </BrowserRouter>
      </MockedProvider>
    )
    expect(container.queryByLabelText('Take a photo')).toBeInTheDocument()
    expect(container.queryByText('Name')).toBeInTheDocument()
    expect(container.queryByText('Primary Phone Number')).toBeInTheDocument()
    expect(container.queryByText('Primary email address')).toBeInTheDocument()
    expect(container.queryByText('Primary Address')).toBeInTheDocument()
    expect(container.queryByLabelText('User Type')).toBeInTheDocument()
    expect(container.queryByLabelText('requestReason')).toBeInTheDocument()
    expect(container.queryByLabelText('state')).toBeInTheDocument()
    expect(container.queryByLabelText('subStatus')).toBeInTheDocument()
    expect(container.queryByTestId('submit_btn')).not.toBeDisabled()
    expect(container.queryByTestId('submit_btn')).toHaveTextContent('Submit')

    // when we hit submit button, it should get disabled
    fireEvent.click(container.queryByTestId('submit_btn'))
    expect(container.queryByTestId('submit_btn')).toBeDisabled()

    fireEvent.change(container.queryByTestId('username'), {
      target: { value: 'My New Name' }
    })
    expect(container.queryByTestId('username').value).toContain('My New Name')

    fireEvent.change(container.queryByTestId('phoneNumber'), {
      target: { value: '090909090909' }
    })
    expect(container.queryByTestId('phoneNumber').value).toContain(
      '090909090909'
    )

    fireEvent.change(container.queryByTestId('email'), {
      target: { value: 'abc@def.jkl' }
    })
    expect(container.queryByTestId('email').value).toContain('abc@def.jkl')

    fireEvent.change(container.queryByTestId('address'), {
      target: { value: '24th street, west' }
    })
    expect(container.queryByTestId('address').value).toContain(
      '24th street, west'
    )
  })
  it('should contain referral form when referring', () => {
    const props = { isEditing: false, isFromRef: true }
    const container = render(
      <MockedProvider mocks={[]}>
        {/* use it as a mock for authState */}
        <AuthStateProvider>
          <BrowserRouter>
            <UserForm isEditing={props.isEditing} isFromRef={props.isFromRef} isAdmin={false} />
          </BrowserRouter>
        </AuthStateProvider>
      </MockedProvider>
    )
    expect(container.queryByLabelText('Take a photo')).toBeNull()
    expect(container.queryByText('Client Name')).toBeInTheDocument()
    expect(container.queryByTestId('clientName')).toBeInTheDocument()
    expect(container.queryByTestId('clientName')).toBeDisabled()
    expect(container.queryByText('Name')).toBeInTheDocument()
    expect(container.queryByText('Primary Phone Number')).toBeInTheDocument()
    expect(container.queryByTestId('phoneNumber')).not.toBeDisabled()
    expect(container.queryByTestId('email')).not.toBeDisabled()

    fireEvent.change(container.queryByTestId('username'), {
        target: { value: 'My New Name' }
      })
    expect(container.queryByTestId('username').value).toContain('My New Name')

    fireEvent.change(container.queryByTestId('phoneNumber'), {
    target: { value: '090909090909' }
    })
    expect(container.queryByTestId('phoneNumber').value).toContain(
    '090909090909'
    )
    expect(container.queryByTestId('referralText')).toHaveTextContent('Nkwashi values its community and believes')
    expect(container.queryByTestId('referralBtn')).not.toBeDisabled()
    expect(container.queryByTestId('referralBtn')).toHaveTextContent('Refer')
    expect(formatContactType('0233082', 'phone')).toMatchObject({ contactType: 'phone', info: '0233082' })
  })
})
