import React from 'react'
import { render } from '@testing-library/react'
import NotificationPage from '../components/NotificationPage'
import '@testing-library/jest-dom/extend-expect'

describe('Preference page for the user settings', () => {


const props = {

    handleChange: jest.fn(), 
    checkedState: {
        smsChecked: false,
        emailChecked: false

    }, 
    handleSave: jest.fn(), 
    loading: true
}


it('It should render with no errors', () => {

    const container = render(<NotificationPage {...props} />)
    expect(container.queryByTestId('notification-header')).toBeInTheDocument()
    expect(container.queryByTestId('notification-description')).toBeInTheDocument()
    
});

it('It should render with The checkboxes', () => {

    const container = render(<NotificationPage {...props} />)
    expect(container.queryByTestId('sms-checkbox')).toBeInTheDocument()
    expect(container.queryByTestId('email-checkbox')).toBeInTheDocument()
    
});

it('It should render with the save button', () => {

    const container = render(<NotificationPage {...props} />)
    expect(container.queryByTestId('preferences-save-button"')).toBeDefined()
    
});


    
});