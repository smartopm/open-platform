import React from 'react'
import SupportCard from '../components/SupportCard'
import {
    cleanup,
    fireEvent,
    render
} from '@testing-library/react'

describe('Contact page', () => {

    const userDetails = {
        id: "1d046c3c-5a28-4b0d-8b2e-758d67346ec2",
        email: "kamran@doublegdp.com",
        name: "Kamran Khan",
        userType: "admin",
        phoneNumber: "7778889999",
        expiresAt: null,
        imageUrl: "https://lh6.googleusercontent.com/-h8heA9fT5Cs/AAAAAAAAAAI/AAAAAAAAAAA/AAKWJJMfQJ67FAkAsFwRebXE3h3NCgUdfg/photo.jpg",
        avatarUrl: null
    }

    const sendMessage = {
        pathname: `/message/1d046c3c-5a28-4b0d-8b2e-758d67346ec2`,
        clientName: 'Contact Support',
        clientNumber: '260974624243',
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
        expect(window.open).toBeCalledWith("https://docs.google.com/forms/d/e/1FAIpQLSeC663sLzKdpxzaqzY2gdGAT5fe-Uc8lvLi1V7KdLfrralyeA/viewform?entry.568472638=Kamran+Khan&7778889999?entry.1055458143=7778889999:entry.1055458143=\"\"", '_blank')
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
