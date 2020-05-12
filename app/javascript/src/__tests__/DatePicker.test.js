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
    
    afterEach(cleanup)
});
