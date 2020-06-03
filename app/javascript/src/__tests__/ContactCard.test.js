import React from 'react'
import SupportCard from '../components/SupportCard'
import {
    cleanup,
    fireEvent,
    render
} from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { shallow } from 'enzyme'
import { MockedProvider } from '@apollo/react-testing'

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
    const authState = {
        loaded: true,
        loggedIn: true,
        setToken: jest.fn(),
        user: {
        avatarUrl: null,
        community: { name: 'Nkwashi' },
        email: '9753942',
        expiresAt: null,
        id: '11cdad78',
        imageUrl: null,
        name: 'John Doctor',
        phoneNumber: '260971500748',
        userType: 'security_guard'
        }
    }


    //    const wrapper = shallow(
    //     <BrowserRouter>
    //     <SupportCard 
    //      handleSendMessage={sendMessage}
    //      userData={userDetails} 
    //      authState={authState}/>
    //     </BrowserRouter>)


    it('render without error', () => {
        render(
            <MockedProvider >
        <BrowserRouter>
        <SupportCard handleSendMessage={sendMessage} userData={userDetails} authState={authState}/>
        </BrowserRouter>
        </MockedProvider>
        )
    });



    // it('clicks button and opens use window', () => {

    //     window.open = jest.fn();
    //     const { getByTestId } = render(
    //         <BrowserRouter>
    //             <SupportCard handleSendMessage={sendMessage} userData={userDetails} authState={authState} />
    //         </BrowserRouter>)
    //     const button = getByTestId('crf');
    //     fireEvent.click(button)
    //     expect(window.open).toBeCalledWith("https://docs.google.com/forms/d/e/1FAIpQLSeC663sLzKdpxzaqzY2gdGAT5fe-Uc8lvLi1V7KdLfrralyeA/viewform?entry.568472638=Jam+J&7778889999?entry.1055458143=7778889999:entry.1055458143=\"\"", '_blank')
    // });

    // it('clicks pay with mobile money then opens use window', () => {
    //     const { getByTestId } = render(
    //         <BrowserRouter>
    //             <SupportCard  handleSendMessage={sendMessage} userData={userDetails} authState={authState}/>
    //         </BrowserRouter>
    //     )
    //     const button = getByTestId('pwmm');
    //     expect(button).toBeTruthy()
    // });

    // it('clicks pay with mobile money then opens use window', () => {
    //     window.open = jest.fn()
    //     const { getByTestId } = render(
    //         <BrowserRouter>
    //             <SupportCard handleSendMessage={sendMessage} userData={userDetails} authState={authState}/>
    //         </BrowserRouter>)
    //     const payWithMoMo = getByTestId('pwmm')
    //     expect(payWithMoMo.textContent).toContain('Pay With Mobile Money')
    // })

    // afterEach(cleanup)
});
