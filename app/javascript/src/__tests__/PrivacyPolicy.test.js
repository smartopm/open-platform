import React from 'react'
import {
    cleanup,
    render
} from '@testing-library/react'
import PrivacyPolicy from '../components/PrivacyPolicy/PrivacyPolicy';


describe('Mount privacy policy link', () => {

    it('Mount Privacy component', () => {
        
        const {getByTestId} = render(
            <PrivacyPolicy />
        )
        expect(getByTestId('div')).toBeTruthy()
    });
    
    afterEach(cleanup)
    
});
