import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import RequestForm from '../Components/RequestForm'
import MockedThemeProvider from '../../__mocks__/mock_theme'


describe('Request Form Component', () => {
    it('should render the form correctly', () => {
        const container = render(
          <MockedProvider mocks={[]}>
            <MockedThemeProvider>
              <RequestForm path="/entry_request" />
            </MockedThemeProvider>
          </MockedProvider>
        )

        const name = container.queryByTestId('name')
        fireEvent.change(name, { target: { value: 'Some User Nam' } })
        expect(name.value).toBe('Some User Nam')

        const phoneNumber = container.queryByTestId('phone_number')
        fireEvent.change(phoneNumber, { target: { value: '837485735' } })
        expect(phoneNumber.value).toBe('837485735')

        const nrc = container.queryByTestId('nrc')
        fireEvent.change(nrc, { target: { value: '1000/10/1' } })
        expect(nrc.value).toBe('1000/10/1')

        const vehicle = container.queryByTestId('vehicle')
        fireEvent.change(vehicle, { target: { value: 'ABT412' } })
        expect(vehicle).toHaveValue('ABT412')

        expect(container.queryByTestId('submit_button')).toHaveTextContent('form_actions.submit')
        expect(container.queryByText('form_fields.nrc')).toBeInTheDocument()
        expect(container.queryByText('form_fields.phone_number')).toBeInTheDocument()
        expect(container.queryByText('form_fields.vehicle_plate_number')).toBeInTheDocument()
    })
})
