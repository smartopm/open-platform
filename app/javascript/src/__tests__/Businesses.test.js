/* eslint-disable */
import React from 'react'
import { render } from '@testing-library/react'
import Business from '../components/Business/BusinessList';
import { BrowserRouter } from 'react-router-dom/'
describe('It tests the business directory list', () => {

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
  
    it('It should render business name', () => {
        const container = render(
            <BrowserRouter>
                <Business {...props} />
            </BrowserRouter>)
        expect(container.queryByTestId('business-name')).toBeTruthy()
    });

    it('It should render business category', () => {
        const container = render(
            <BrowserRouter>
                <Business {...props} />
            </BrowserRouter>)
        expect(container.queryByTestId('business-category').textContent).toBeTruthy()
    });

});
