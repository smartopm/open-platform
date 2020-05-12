import React from 'react'
import SupportCard from '../components/SupportCard'
import {
    cleanup,
    fireEvent,
    render
} from '@testing-library/react'

describe('Contact page', () => {

    it('render without error', () => {
        render(<SupportCard />)
    });


    it('clicks button and opens use window', () => {

        window.open = jest.fn();
        const { getByTestId } = render(<SupportCard />)
        const button = getByTestId('crf');
        fireEvent.click(button)
        expect(window.open).toBeCalledWith('https://forms.gle/Sdbj91Sia8EpDJiN6', '_blank')
    });

    it('clicks pay with mobile money then opens use window', () => {

        window.open = jest.fn();
        const { getByTestId } = render(<SupportCard />)
        const button = getByTestId('pwmm');
        fireEvent.click(button)
        expect(window.open).toBeCalledWith("/contact/mobile_money", '_self')
    });


    afterEach(cleanup)

});
