import React from 'react'
import {
    cleanup,
    render
} from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import PrivacyPolicy from '../components/PrivacyPolicy/PrivacyPolicy';


describe('Mount privacy policy link', () => {

    it('Mount Privacy component', () => {

        const { getByTestId } = render(

            <BrowserRouter>
                <PrivacyPolicy />
            </BrowserRouter>
        )
        expect(getByTestId('div')).toBeTruthy()
    });

    afterEach(cleanup)

});
