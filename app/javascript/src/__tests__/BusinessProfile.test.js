import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'
import Profile from '../components/Business/Profile'

describe('It tests the business profile page', () => {
    const props = {
        businessData: {
            businesses: [
                {
                    category: 'construction',
                    createdAt: "2020-06-30T15:54:34Z",
                    homeUrl: null,
                    name: "Artist",
                    userId: "4f1492a9-5451-4f0a-b35d-bc567e1e56b7",
                    id: "43c596de-e07f-4d0f-a727-53fb4b8b44ce",
                    description: null,
                    status: 'verified'
                }
            ]
        }
    }
   
    let container

    beforeEach(() => (
        container = render(
        <BrowserRouter>
            <Profile />
        </BrowserRouter>)
    ))

    it('It should render Company name', () => {
        expect(container.queryByLabelText('pf-company-name')).toBeInTheDocument() 
    });
    it('It should render Phone Number', () => {
        expect(container.queryByLabelText('pf-phone-number')).toBeInTheDocument()
    });
    it('It should render Email Address', () => {
        expect(container.queryByLabelText('pf-email-address')).toBeInTheDocument()
    });
    it('It should render Address', () => {
        expect(container.queryByLabelText('pf-address')).toBeInTheDocument()
    });

    it('It should render Description', () => {
        expect(container.queryByLabelText('pf-description')).toBeInTheDocument()
    });
    

});
