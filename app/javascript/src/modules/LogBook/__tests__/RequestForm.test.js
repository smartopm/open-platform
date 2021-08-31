import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom'
import RequestForm from '../Components/RequestForm'
import MockedThemeProvider from '../../__mocks__/mock_theme'


describe('Request Form Component', () => {
    it('should render the form correctly', () => {
        const container = render(
          <MockedProvider mocks={[]}>
            <BrowserRouter>
              <MockedThemeProvider>
                <RequestForm path="/entry_request" />
              </MockedThemeProvider>
            </BrowserRouter>
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

        const vehicle = container.queryByTestId('companyName')
        fireEvent.change(vehicle, { target: { value: 'ABT412' } })
        expect(vehicle).toHaveValue('ABT412')

        expect(container.queryByTestId('submit_button')).toHaveTextContent('form_actions.invite_guest')
        expect(container.queryByText('form_fields.nrc')).toBeInTheDocument()
        expect(container.queryByText('form_fields.phone_number')).toBeInTheDocument()
        expect(container.queryByText('form_fields.company_name')).toBeInTheDocument()
        expect(container.queryByText('logbook:guest_book.repeats_on')).toBeInTheDocument()
        expect(container.queryAllByTestId('week_days')[0]).toBeInTheDocument()
        // since there are no valid translations here, test will pick individual letters logbook:days 
        expect(container.queryAllByTestId('week_days')[0]).toHaveTextContent('l')
        expect(container.queryAllByTestId('week_days')[1]).toHaveTextContent('o')
        expect(container.queryAllByTestId('week_days')[2]).toHaveTextContent('g')
    })
})
