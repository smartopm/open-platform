import React from 'react'
import SupportCard from '../components/SupportCard'
import {
    cleanup,
    fireEvent,
    render
} from '@testing-library/react'

describe('Contact page', () => {

    const userDetails = {
        id: "863a-45eq-dsf78",
        email: "Jam@jam.com",
        name: "Jam J",
        userType: "user",
        phoneNumber: "7778889999",
        expiresAt: null,
        imageUrl: "https://image.jpg",
        avatarUrl: null
    }

    const sendMessage = {
        pathname: `/message/863a-45eq-dsf78`,
        clientName: 'Contact Support',
        clientNumber: '290974624573',
        from: 'contact'
    }

    it('render without error', () => {
        render(<SupportCard />)
    });


    it('clicks button and opens use window', () => {

        window.open = jest.fn();
        const { getByTestId } = render(<SupportCard handleSendMessage={sendMessage} userData={userDetails} />)
        const button = getByTestId('crf');
        fireEvent.click(button)
        expect(window.open).toBeCalledWith("https://docs.google.com/forms/d/e/1FAIpQLSeC663sLzKdpxzaqzY2gdGAT5fe-Uc8lvLi1V7KdLfrralyeA/viewform?entry.568472638=Jam+J&7778889999?entry.1055458143=7778889999:entry.1055458143=\"\"", '_blank')
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
