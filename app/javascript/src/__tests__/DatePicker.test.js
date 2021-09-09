/* eslint-disable */
import React from 'react'
import {
    cleanup,
    render 
} from '@testing-library/react'
import DatePickerDialog from '../components/DatePickerDialog';

describe('Mounts date picker', () => {

    it('Render date component', () => {

        const {getByTestId} = render(
            <DatePickerDialog selectedDate='2020/05/12' handleDateChange={jest.fn()} label='Expiration Date'/>
        )

        expect(getByTestId('date-picker')).toBeTruthy()
        
    });

    it('Render date component with validation error', () => {
        const rendered = render(
            <DatePickerDialog selectedDate='2020/05/12'
                handleDateChange={jest.fn()}
                label='Expiration Date'
                inputValidation={{ error: true, fieldName: 'Expiration Date' }}
            />
        )
        expect(rendered.queryByText('form:errors.required_field')).toBeTruthy()
    });
    
    afterEach(cleanup)
});
