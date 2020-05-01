import React from 'react'
import SupportCard from '../components/SupportCard'
import { render} from '@testing-library/react'

describe('Contact page', () => {

    it('render without error', () => {
        render(<SupportCard />)
    });
    

});
