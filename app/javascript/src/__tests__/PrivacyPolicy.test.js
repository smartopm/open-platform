/* eslint-disable */
import React from 'react'
import {
    cleanup,
    fireEvent,
    render
} from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import PrivacyPolicy from '../components/PrivacyPolicy/PrivacyPolicy';


describe('Mount privacy policy link', () => {

    const { getByTestId } = render(

        <BrowserRouter>
            <PrivacyPolicy />
        </BrowserRouter>
    )
    it('Mount Privacy component', () => {
        expect(getByTestId('privacy_link')).toBeTruthy()
 
    });
    it('Display privacy link text', () => {
        const { getByTestId } = render(

            <BrowserRouter>
                <PrivacyPolicy />
            </BrowserRouter>
        )
        
        expect(getByTestId('privacy_text').innerHTML).toBe('<u><strong>Privacy and Terms of Service</strong></u>')
        
        
    });

    it('opens new tab for privacy policy doc',()=>{
        window.open = jest.fn();
        const { getByTestId } = render(

            <BrowserRouter>
                <PrivacyPolicy />
            </BrowserRouter>
        )
        const botton = getByTestId('privacy_text')
        fireEvent.click(botton)
        expect(window.open).toBeCalledWith('https://docs.google.com/document/d/1d0zK4uKZESQNP4iqVDmXa3xBp5vcuR1KmbSzl-_kqPM/edit?usp=sharing','_blank')
        
    })
    

    afterEach(cleanup)

});
