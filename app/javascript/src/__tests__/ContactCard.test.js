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

    it('includes the button text for opening the form', () => {
        const { getByTestId, } = render(<SupportCard />)
        const buttonText = getByTestId('crf');
        expect(buttonText.textContent).toContain('Client Request Form')
        // expect(window.open).toBeCalledWith('https://docs.google.com/forms/d/e/1FAIpQLSeC663sLzKdpxzaqzY2gdGAT5fe-Uc8lvLi1V7KdLfrralyeA/viewform?entry.568472638=Kamran+Khan&entry.1055458143=7778889999', '_blank')
    });

    it('clicks pay with mobile money then opens use window', () => {
        window.open = jest.fn();
        const { getByTestId } = render(<SupportCard />)
        const button = getByTestId('pwmm');
        fireEvent.click(button)
        expect(window.open).toBeCalledWith("/contact/mobile_money", '_self')
    });

    it('clicks pay with mobile money then opens use window', () => {
        window.open = jest.fn()
        const { getByTestId } = render(<SupportCard />)
        const payWithMoMo = getByTestId('pwmm')
        expect(payWithMoMo.textContent).toContain('Pay With Mobile Money')
    })

    afterEach(cleanup)
});
