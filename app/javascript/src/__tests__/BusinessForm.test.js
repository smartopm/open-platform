import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import BusinessForm from '../components/Business/BusinessForm'
import '@testing-library/jest-dom/extend-expect'

describe('Business  form', () => {
  it('should allow editing business fields inputs', () => {
      const handleClose = jest.fn()
    const container = render(
      <MockedProvider>
        <BusinessForm close={handleClose} />
      </MockedProvider>
    )
    const businessName = container.queryByTestId('business_name')
    const businessEmail = container.queryByTestId('business_email')
    const businessPhone = container.queryByTestId('business_phone_number')
    const businessLink = container.queryByTestId('business_link')
    const businessDesc = container.queryByTestId('business_description')
    const businessAddress = container.queryByTestId('business_address')
    const businessHours = container.queryByTestId('business_operating_hours')
    const businessImage = container.queryByTestId('business_image')

    fireEvent.change(businessName, { target: { value: 'new campaign' } })
    expect(businessName.value).toBe('new campaign')

    fireEvent.change(businessEmail, { target: { value: 'newbusiness@gm.ail' } })
    expect(businessEmail.value).toBe('newbusiness@gm.ail')

    fireEvent.change(businessPhone, { target: { value: '6353472323' } })
    expect(businessPhone.value).toBe('6353472323')

    fireEvent.change(businessLink, { target: { value: 'https://ulr.com' } })
    expect(businessLink.value).toBe('https://ulr.com')

    fireEvent.change(businessAddress, { target: { value: 'Plot 32, Nkwashi' } })
    expect(businessAddress.value).toBe('Plot 32, Nkwashi')


    fireEvent.change(businessAddress, { target: { value: 'Plot 32, Nkwashi' } })
    expect(businessAddress.value).toBe('Plot 32, Nkwashi')

    fireEvent.change(businessHours, { target: { value: '6-7' } })
    expect(businessHours.value).toBe('6-7')

    fireEvent.change(businessImage, { target: { value: 'https:image.jepg' } })
    expect(businessImage.value).toBe('https:image.jepg')

    fireEvent.change(businessDesc, { target: { value: 'described as following bring change to startups' } })
    expect(businessDesc.value).toBe('described as following bring change to startups')

    const submit = container.queryByText('Create a Business')
    const cancel = container.queryByText('Cancel')
    expect(submit).toBeInTheDocument()
    expect(container.queryByText('Cancel')).toBeInTheDocument()

    fireEvent.click(cancel)
    expect(handleClose).toHaveBeenCalled()
  })
})