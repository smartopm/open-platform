import React from 'react'
import {
    cleanup,
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
        
        expect(getByTestId('privacy_text').innerHTML).toBe('<strong>Privacy and Terms of Service</strong>')
        
        
    });
    

    afterEach(cleanup)

});
